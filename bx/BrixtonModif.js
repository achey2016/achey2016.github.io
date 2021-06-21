// Test de Brixton modifié
// Adaptation pour l'Etude sur le déficit de transport de Créatine (Aurore Curie, HCL)
// proposée par Eric Chabanat, UCBL
// Code HTML par Anne Cheylus, CNRS


// Liste des numeros des cercles (départ à 0 modulo 14)
var listeRegles = [
  {"increment": 1, "repetitions" :10},
  {"increment": -1, "repetitions" :10},
  {"increment": 7, "repetitions" :8},
  {"increment": -1, "repetitions" :5},
  {"increment": 1, "repetitions" :5}
];
var listeTests = [];
var from_item = 0;
var to_item = 0;
var predict_item = 0;
var repetition = 0;
for (var i=0; i< listeRegles.length; i++) {
  for (var j=0; j< listeRegles[i].repetitions; j++) {
    to_item = (14 + from_item + listeRegles[i].increment) % 14 ;
    if ((j === 0) && (i>0) ) {
      predict_item = (14 + from_item + listeRegles[i-1].increment) % 14 ;
      repetition = listeRegles[i-1].repetitions;
    } else {
      predict_item = to_item;
      repetition = j;
    }
    listeTests.push({
      "title" : "Brixton modif " + i + "_" + j, 
      "from": from_item, 
      "to": to_item,
      "predict_item" : predict_item,
      "repetition" : repetition, 
      "increment" : listeRegles[i].increment
    });
    from_item = to_item;
  }
}

var currentTest=-1;
var score = 0;

// enregistrer la réponse
var setinfotrial = function(e) {
  console.log('setinfotrial ' + e.currentTarget.id);
  // seulement si le trial a debute
  if(listeTests[currentTest].debut) {
    // infosTrial
    if (currentTest>=0 && currentTest < listeTests.length && e && e.currentTarget ) {
      if (!listeTests[currentTest].hasOwnProperty('response')) {
        // toujours compter la première réponse comme juste car on n'a pas encore de règle
        listeTests[currentTest].response = (e.currentTarget.id == "c" + listeTests[currentTest].predict_item) ||
                                           (currentTest === 0);
        listeTests[currentTest].essais = 1;
        listeTests[currentTest].fin = new Date();
        listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
        if (listeTests[currentTest].response) {
          // score si bonne réponse au 1er essai
          score = score + 1;
        }
      } else {
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
  var error_rate_cond = listeTestsCond.reduce((prev,cur) => prev + !cur.response,0) * 100.0 / listeTestsCond.length;
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
  document.getElementById("testscreen").hidden=true;
  document.getElementById("endscreen").hidden=false;
  // Modifier le numero du sujet pour l'enregistrement
  if(listeTests[0].debut) {
    var date_heure = listeTests[0].debut.toISOString().substr(0,16).replace(/-|T|:/g,"");
    document.getElementById("allCSV").download="test" + date_heure + ".csv";
    document.getElementById("allCSV").innerHTML = "Enregistrer test" + date_heure + ".csv";
    // rappel score sans le premier item
    document.getElementById("score").innerHTML = "Score : " + (score - 1) + " / " + (listeTests.length - 1);
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
    "title","from",
    "to","repetition","increment",
    "debut","fin",
    "essais","response","RT"
  ];
  trialtable.innerHTML="<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody></tbody>";
  console.log(trialtable);
  document.getElementById("allCSV").href+= encodeURI(colnames.join(";")+"\n");
  for (var i=0; i< listeTests.length; i++) {
    if(listeTests[i].hasOwnProperty("response")) {
      var infoligne=[];
      colnames.forEach(x => infoligne.push(listeTests[i][x]));
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
var gonext;
    gonext = function(e) {
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
  // premier trial
  gonext();
}
// log cache
var logCacheEvent = function(evt) {
  console.log(evt.type);
  document.getElementById("title").innerHTML = "! ! ! ! ! "+ evt.type + " ! ! ! ! ! ";
    
};

// cette fonction (window.onload) s'exécute lorsque la page est chargée
window.onload = function() {
  // Mettre a jour l'adresse pour nextsuj
  document.getElementById("nextsuj").href = document.location.href;
  // gestion du cache
  if (window.applicationCache && 
      window.applicationCache.status !== window.applicationCache.UNCACHED) {
    // en cas de mise a jour du cache, le charger
    window.applicationCache.addEventListener('updateready',  maj_cache, false);  
    // s'il n'y a pas de MAJ ou si tout est en cache on peut commencer
    window.applicationCache.addEventListener('noupdate',onCacheOK,false);
    window.applicationCache.addEventListener('cached',onCacheOK,false);
    // s'il n'y a plus de cache ou si le reseau ne repond pas on peut commencer
    window.applicationCache.addEventListener('obsolete',onCacheOK,false);
    window.applicationCache.addEventListener('error',onCacheOK,false);
    // sinon tout logger
    // checking a toujours lieu au moins 1 fois
    window.applicationCache.addEventListener('checking',logCacheEvent,false);
    // les ressources sont en cours de telechargement
    window.applicationCache.addEventListener('downloading',logCacheEvent,false);
  } else {
    // s'il n'y a pas de gestion du cache on peut commencer
    onCacheOK();
  }
};


