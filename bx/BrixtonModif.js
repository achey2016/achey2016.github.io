// Test de Brixton modifié
// Adaptation pour le déficit en transporteur de Créatine (Aurore Curie, HCL/UCBL)
// proposée par Eric Chabanat, UCBL
// Code HTML par Anne Cheylus, CNRS


// Liste des numeros des cercles (départ à 0 modulo 14) : 0 1 2 .. 13
// liste des règles pour passer d'un item au suivant
var listeRegles = [
  {"increment": 1, "repetitions" :10},
  {"increment": -1, "repetitions" :10},
  {"increment": -2, "repetitions" :7},
  {"increment": 2, "repetitions" :7},
  {"increment": -3, "repetitions" :7},
  {"increment": 3, "repetitions" :7},
  {"increment": 7, "repetitions" :8},
  {"increment": -1, "repetitions" :5, "txt" : "bis"},
  {"increment": 1, "repetitions" :5, "txt" : "bis},
  {"alternance": [-1,1], "repetitions" :5}
];

// temps maximum pour repondre : une minute (60000 ms)
var maxwait = 60000;
var checkTimeoutInterval = false;

var applique_regle = function(from,regle) {
  var retval = -1;
  if(regle.increment) {
    retval = (14 + from + regle.increment) % 14 ;
  } else if(regle.alternance) {
    var first = regle.alternance.shift();
    regle.alternance.push(first);
    retval = (14 + from + first) % 14;
  }
  return(retval);
};
// Donner un nom à la règle
var ajoute_nom = function(regle) {
  if(regle.increment) {
    regle.nom = (regle.increment > 0 ) ? "plus " + regle.increment : "minus " + (- regle.increment) ;
  } else if(regle.alternance) {
    regle.nom = "alt " + regle.alternance.join("/");
  }
  if(regle.txt) {
    regle.nom = regle.nom + " " + regle.txt;
  }
};
// Traduction des règles en liste de tests
var listeTests = [];
var from_item = 0;
var to_item = 0;
var predict_item = 0;
var repetition = 0;
var alt_items = [];
var rule = "any";
// Pour chaque règle,
for (var i=0; i< listeRegles.length; i++) {
  ajoute_nom(listeRegles[i]);
  // pour chaque répétition
  for (var j=0; j< listeRegles[i].repetitions; j++) {
    // l'item suivant est obtenu en appliquant la règle courante
    to_item = applique_regle(from_item, listeRegles[i]) ;
    if ((j === 0) && (i>0) ) {
      // l'item prévisible est obtenu en appliquant la règle précédente au moment du switch
      predict_item = applique_regle(from_item, listeRegles[i-1]) ;
      repetition = listeRegles[i-1].repetitions;
      rule = listeRegles[i-1].nom;
    } else {
      // si c'est la première alternance il faut 2 transitions pour établir la règle
      if ((j===1) && listeRegles[i].alternance && (i>0) && listeRegles[i-1].increment) {
        // une prédiction acceptable serait alors un incrément comme à la 1ère transition
        predict_item  = applique_regle(from_item, {"increment": listeRegles[i].alternance[0]}) ;
        rule="start_alt";
      } else {
        // sinon c'est l'item suivant
        predict_item = to_item;
        rule = ((i+j)===0) ? "start" :listeRegles[i].nom;
      }
      repetition = j;
    }
    // liste des réponses alternatives pour les règles qui précèdent
    // afin de séparer les réponses aberrantes des abandons de règle
    alt_items = [];
    for (var k=0; k<i; k++) {
      // items obtenu en appliquant la règle k 
      alt_items.push(applique_regle(from_item, listeRegles[k]));
    }
    listeTests.push({
      "title" : "Brixton modif " + i + "_" + j, 
      "from": from_item, 
      "to": to_item,
      "predict_item" : predict_item,
      "repetition" : repetition, 
      "alt" : alt_items,
      "alt_prev" : (i>0) ? alt_items[i-1] : undefined,
      "increment" : listeRegles[i].increment,
      "rule" : rule
    });
    from_item = to_item;
  }
}

var currentTest=-1;
var score = 0;
var nb_perseverance = 0;
var nb_abandon = 0;
// test abandon : la regle courante a été adoptée au moins une fois
// une règle proposée auparavant a été appliquée à sa place
var test_abandon = function(listT,c,rep) {
  var retval= false;
  if (! listT[c].valid) {
    // la regle courante a-t-elle déjà été adoptée ?
    var listeRegleCourante = listT.filter((x,i) => (i<c) && (x.rule == listT[c].rule));
    if (listeRegleCourante.some(x => x.valid)) {
      // si la règle courante a déjà été adoptée, une règle précédente a-t-elle été appliquée ?
      retval=listT[c].alt.some(x => ("c" + x == rep) );
    }
  }
  return(retval);
};

// test perseverance : la regle courante n'a pas encore été appliquée
// la règle proposée juste avant a été appliquée à sa place
var test_perseverance = function(listT,c,rep) {
  var retval= false;
  if (! listT[c].valid) {
    // la regle courante a-t-elle déjà été adoptée ?
    var listeRegleCourante = listT.filter((x,i) => (i<c) && (x.rule == listT[c].rule));
    if ( ! listeRegleCourante.some(x => x.valid)) {
      // si la règle courante n'a pas encore été adoptée, la règle précédente a-t-elle été appliquée ?
      retval = ("c" + listT[c].alt_prev == rep) ;
    }
  }
  return(retval);
};
// enregistrer la réponse
var setinfotrial = function(e) {
  console.log('setinfotrial ' + e.currentTarget.id);
  // seulement si le trial a debute
  if(listeTests[currentTest].debut) {
    // infosTrial
    if (currentTest>=0 && currentTest < listeTests.length && e && e.currentTarget ) {
      if (!listeTests[currentTest].hasOwnProperty('valid')) {
        // s'il n'y a pas encore de réponse enregistrée (1er essai)
        listeTests[currentTest].response = e.currentTarget.id.replace(/^c/,'');
        // voir si la réponse est juste ;
        // toujours compter la première réponse comme juste car on n'a pas encore de règle
        listeTests[currentTest].valid = (e.currentTarget.id == "c" + listeTests[currentTest].predict_item) ||
                                           (currentTest === 0);
        listeTests[currentTest].essais = 1;
        listeTests[currentTest].fin = new Date();
        listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
        if (listeTests[currentTest].valid) {
          // score si bonne réponse au 1er essai
          score = score + 1;
        }
        // abandons
        listeTests[currentTest].abandon = test_abandon(listeTests,currentTest,e.currentTarget.id);
        if (listeTests[currentTest].abandon) {
          nb_abandon = nb_abandon + 1;
        }
        // perseverance
        listeTests[currentTest].perseverance = test_perseverance(listeTests,currentTest,e.currentTarget.id);
        if (listeTests[currentTest].perseverance) {
          nb_perseverance = nb_perseverance + 1;
        }
      } else {
        // il y a déjà eu d'autre essais, incrémenter le compteur d'essais
        listeTests[currentTest].essais = listeTests[currentTest].essais + 1;
      }
      if(e.currentTarget.id == "c" + listeTests[currentTest].predict_item || currentTest === 0) {
        // bonne réponse : trial suivant
        gonext();
      } else {
        // sinon mauvaise réponse : feedback négatif
        document.getElementById("bad").beginElement();
      }
    } 
  } 
};

// stockage local
var getCjtStorage = function() {
    var myStorage = window.localStorage;
    var cjt = myStorage.getItem('cjt');
    if(!cjt) {
      console.log("pas de stockage local : initialisation");
      cjt = { ipad: Date.now().toString(36) + Math.random().toString(36).substr(2),
              sessions: [],
              testdata : []};
    } else {
      cjt = JSON.parse(cjt);
      console.log("cjt =");
      console.log(cjt);
    }
    return (cjt);
};
var setCjtStorage = function (cjt) {
    var myStorage = window.localStorage;
    myStorage.setItem('cjt',JSON.stringify(cjt));
    console.log("cjt <-");
    console.log(cjt);
    return "0";
};
var clearCjtStorage = function() {
  var myStorage = window.localStorage;
  myStorage.removeItem('cjt');
  return "0";
};
// mise à jour du graphique en fin de test
var median = function(listeTests,val){
  if(listeTests.length ===0) return 0;
  listeTests.sort(function(a,b){ 
    return a[val]-b[val];
  });
  var half = Math.floor(listeTests.length / 2);
  if (listeTests.length % 2) return listeTests[half][val];
  return (listeTests[half - 1][val] + listeTests[half][val]) / 2.0;
};
var maj_graphique_cond = function(listeTests,type_match,cond) {
  var listeTestsCond = listeTests.filter(x => x.repetition == cond);
  if (type_match === ">=") {
    listeTestsCond = listeTests.filter(x => x.repetition >= cond);
  }
  var error_rate_cond = listeTestsCond.reduce((prev,cur) => prev + !cur.valid,0) * 100.0 / listeTestsCond.length;
  var median_rt = median(listeTestsCond,'RT');
  document.getElementById('er_' + cond).setAttribute('height', error_rate_cond * 4.83);
  document.getElementById('rt_' + cond).setAttribute('height', median_rt * 66/1000);
  document.getElementById('erval_' + cond).innerHTML = Math.round(error_rate_cond) + '%';
  document.getElementById('rtval_' + cond).innerHTML = Math.round(median_rt/10)/100 + 's';
};
var maj_graphique = function(listeTests) {
  maj_graphique_cond(listeTests,'==',1);
  maj_graphique_cond(listeTests,'==',2);
  maj_graphique_cond(listeTests,'==',3);
  maj_graphique_cond(listeTests,'==',4);
  maj_graphique_cond(listeTests,'>=',5);
};
// fin du test
var endTest = function(e) {
  preventDefaultGestures = false;
  document.getElementById("pausescreen").hidden = true;
  document.getElementById("testscreen").hidden=true;
  document.getElementById("endscreen").hidden=false;
  if (checkTimeoutInterval) {
    clearInterval(checkTimeoutInterval);
    checkTimeoutInterval = false;
  }
  // Modifier le numero du sujet pour l'enregistrement
  if(listeTests[0].debut) {
    var date_heure = listeTests[0].debut.toISOString().substr(0,16).replace(/-|T|:/g,"");
    var csv_name = listeTests[0].participant + "_" + document.title + "_" + date_heure + ".csv";
    document.getElementById("allCSV").download=csv_name;
    document.getElementById("allCSV").innerHTML = "Enregistrer " + csv_name;
    // rappel score sans le premier item
    document.getElementById("score").innerHTML = "Score : " + (score - 1) + " / " + (listeTests.length - 1);
    document.getElementById("score").innerHTML += "<br>Participant : " + listeTests[0].participant;
    document.getElementById("score").innerHTML += "<br>Abandons : " + nb_abandon ;
    document.getElementById("score").innerHTML += "<br>Persévérances : " + nb_perseverance;
    document.getElementById("score").innerHTML += "<br>Début : " + listeTests[0].debut.toLocaleString();
    if(listeTests[listeTests.length-1].fin){
      document.getElementById("score").innerHTML += "<br>Fin : " + listeTests[listeTests.length-1].fin.toLocaleString();
      var duree = new Date(listeTests[listeTests.length-1].fin.getTime() - listeTests[0].debut.getTime());
      document.getElementById("score").innerHTML += "<br>Durée : " + duree.toISOString().substr(11, 8) ;
    }
  }
  // table récapitulative
  var trialtable = document.getElementById("trialtable");
  var colnames = [
    "participant","title","from",
    "to","repetition","rule",
    "debut","fin",
    "essais","response",
    "valid","abandon", "perseverance", 
    "RT"
  ];
  trialtable.innerHTML="<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody></tbody>";
  console.log(trialtable);
  document.getElementById("allCSV").href+= encodeURI(colnames.join(";")+"\n");
  for (var i=0; i< listeTests.length; i++) {
    if(listeTests[i].hasOwnProperty("valid")) {
      var infoligne=[];
      colnames.forEach(x => infoligne.push((listeTests[i][x] && listeTests[i][x].toLocaleString && (x!=="RT")) ? listeTests[i][x].toLocaleString() : listeTests[i][x] ));
      trialtable.tBodies[0].innerHTML +="<tr><td>"+ infoligne.join("</td><td>") + "</td></tr>";
      document.getElementById("allCSV").href += encodeURI(infoligne.join(";") + "\n");
    }
  }
  // backup localStorage
  var cjt = getCjtStorage();
  cjt.sessions.push(document.location.href + '_' + listeTests[0].debut.toLocaleString());
  cjt.testdata.push(listeTests);
  setCjtStorage(cjt);
  document.getElementById("cjtJSON").href += encodeURI(JSON.stringify(cjt) + "\n");
  
  // modification du graphique
  maj_graphique(listeTests);
};

// en cas d'erreur de chargement
var errorload = function(e) {
  listeTests[currentTest].response = 'load error for ' + e.currentTarget.id + " : could not load " + e.currentTarget.getAttribute("xlink:href");
  endTest(e);
};
// en cas d'erreur autre
var errormsg = function(e, msg) {
  listeTests[currentTest].response = msg;
  endTest(e);
};
// définition de la fonction pour aller au test suivant : gonext
var gonext = function(e) {
  console.log("gonext : " + currentTest);
  
  currentTest = currentTest+1;
  if (currentTest < listeTests.length) {
    // empecher zoom et defilements
    preventDefaultGestures = true;
    // modifier le titre
    var title = document.getElementById("title");
    title.innerHTML = listeTests[currentTest].title + " - score : " + score;
    title.hidden = true;
    // modifier les couleurs des cercles
    for (var i=0; i<14; i++) {
      if (i==listeTests[currentTest].from) {
        document.getElementById("c" + i).setAttribute("fill","black");
      } else if (currentTest>0 && i==listeTests[currentTest-1].from) {
        document.getElementById("c" + i).setAttribute("fill","#ddd");
      } else {
        document.getElementById("c" + i).setAttribute("fill","white");
      }
    }
    // c'est parti
    listeTests[currentTest].debut=new Date();
  } else {
    // c'est fini
    endTest();
  } 
};

// Reprendre (apres interruption prolongee)
var reprendre = function() {
  currentTest = currentTest - 1;
  document.getElementById("pausescreen").hidden = true;
  document.getElementById("testscreen").hidden = false;
  gonext();
};

// Mettre en pause (si interruption prolongee)
var pause = function() {
  document.getElementById("reprendre").addEventListener('click', reprendre, {once: true, capture: true});
  document.getElementById("terminer").addEventListener('click', endTest, {once: true, capture: true});
  document.getElementById("testscreen").hidden = true;
  document.getElementById("pausescreen").hidden = false;
};

// Verifier que le sujet est bien actif (absence d'interruption prolongee)
var checkTimeout = function() {
  if ( !document.getElementById("testscreen").hidden ) {
    if (currentTest>=0 && currentTest < listeTests.length && listeTests[currentTest].debut ) {
      datenow =  new Date();
      elapsed = datenow.getTime() - listeTests[currentTest].debut.getTime();
      if (elapsed > maxwait) {
        pause();
      }
    } 
  }
};


// lire le code participant et commencer l'essai
var commencer = function() {
  listeTests.forEach(x => x.participant = document.getElementById("participant_code").value);
  console.log(listeTests[0].participant);
  // masquer le clavier et le formulaire, afficher le test
  document.activeElement.blur();
  document.getElementById("infosuj").hidden = true;
  document.getElementById("testscreen").hidden = false;
  // verifier l'absence d'interruption prolongee
  checkTimeoutInterval = setInterval(checkTimeout,maxwait);
  // premier trial
  gonext();
  // renvoyer false pour eviter le rechargement de la page a la soumission du formulaire
  return(false); 
};

// mise a jour du cache pour les ipads
var maj_cache = function(e) {
    window.applicationCache.swapCache();
    endTest(e);
};

/*
 * Teste si un sous-test est demandé dans l'adresse
 */
var testeAdressSousTest = function(adress) {
  document.title = "Brixton modifié";
};

/*
 * Tests infos codees dans l'adresse et le protocole
 */
var testeAdress = function() {
    var protocol=document.location.protocol;
    var adress=document.location.search;

    testeAdressSousTest(adress);
};
// s'il n'y a pas de mise a jour, charger le test
var onCacheOK = function() {
  // si le sous-test est specifie, adapter la liste des tests
  testeAdress();

  // lorsqu'on clique dessus enregistrer la réponse
  for (var i=0; i<14; i++) {
    if( 'ontouchstart' in window) {
      document.getElementById("c" + i).addEventListener('touchstart', setinfotrial, true);
    } else {
      document.getElementById("c" + i).addEventListener('click', setinfotrial, true);
    }
  }
}
// log message from serviceWorker
var logMsg = function(evt) {
  console.log(evt);
  if (evt.data) {
    if (evt.data.indexOf('version:')==0) {
      document.getElementById("title").innerHTML = document.getElementById("title").innerHTML.replace(/\( version: [^\)]*\)|$/, " ( "+ evt.data + " )");
    } else {
      document.getElementById("title").insertAdjacentText("afterend",evt.data + "\n");
    }
  } else if (evt.type == "controllerchange") {
    if (navigator.serviceWorker.controller) {
        // demander la version
        navigator.serviceWorker.controller.postMessage('version');
    } else {
      document.getElementById("title").insertAdjacentText("afterend", 
      "Un changement de contrôleur est intervenu, mais le contrôleur n'est pas défini.\n");
    }
    // en cas de changement de contrôleur, s'il n'y a pas un test en cours, mieux vaut recharger la page
    if (currentTest <0) {
      document.getElementById("infosuj").hidden = true;
      endTest(evt);
    }
    
  } else {
    document.getElementById("title").insertAdjacentText("afterend", "! ! ! ! ! "+ JSON.stringify(evt) + " ! ! ! ! !\n");
  }
};

// cette fonction (window.onload) s'exécute lorsque la page est chargée
window.onload = function() {
  // Mettre a jour l'adresse pour nextsuj
  document.getElementById("nextsuj").href = document.location.href;
  // gestion du cache
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', logMsg);
    navigator.serviceWorker.addEventListener('error', logMsg);
    navigator.serviceWorker.addEventListener('controllerchange', logMsg);
    // skip le cache HTTP du navigateur, c'est le sw qui gerera le cache
    navigator.serviceWorker.register('sw.js',{updateViaCache: 'none'}).then(onCacheOK);
  } else {
    document.getElementById("title").insertAdjacentText("afterend", "! ! ! ! ! Pas d'utilisation hors ligne possible ! ! ! ! !\n");
    onCacheOK();
  }
};

