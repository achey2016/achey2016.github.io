// Échelles à fort contraste pour Annie Moulin, CNRS
// Code HTML/javascript/CSS par Anne Cheylus, CNRS


// Liste des questions
var listeQuestions = [
  "Choisissez une valeur entre 0 et 10",
  "Choisissez à nouveau",
  "Choississez une dernière fois"
];

// temps maximum pour repondre : dix minutes (600000 ms)
var maxwait = 600000;
var checkTimeoutInterval = false;


// Traduction des questions en liste de tests
var listeTests = listeQuestions.map(q => ({'question': q}));

var currentTest=-1;
var score = 0;

// enregistrer la réponse
var setinfotrial = function(e) {
  console.log('setinfotrial ' + e.currentTarget.id);
  // seulement si le trial a debute
  if(listeTests[currentTest].debut) {
    // infosTrial
    if (currentTest>=0 && currentTest < listeTests.length && e && e.currentTarget ) {
      // Si non applicable
      if (e.currentTarget.id === "NA") {
        if (e.currentTarget.checked) {
          listeTests[currentTest].response = "NA";
          document.getElementById("OKnext").disabled = false;
        } else {
          document.getElementById("OKnext").disabled = true;
        }
      // Si choix sur l'échelle  
      } else {
        // décocher NA, noter la réponse, autoriser le passage à la suite
        document.getElementById("NA").checked = false;
        if (e.currentTarget.value) {
          // pour mousedown ou touchstart, "value" n'a pas encore changé
          // mais il faut quand même l'enregistrer au cas où elle ne changerait pas
          listeTests[currentTest].response = e.currentTarget.value;
        }
        document.getElementById("OKnext").disabled = false;
        // timing au début du toucher ou du clic
        if((e.type === "touchstart") || (e.type === "mousedown")) {
          listeTests[currentTest].fin = new Date();
          listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
        }
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
    var scoremax = listeTests.filter((q) => (q.response!=="NA")).length*10;
    document.getElementById("allCSV").download=csv_name;
    document.getElementById("allCSV").innerHTML = "Enregistrer " + csv_name;
    // rappel score sans le premier item
    document.getElementById("score").innerHTML = "Score : " + score  + " / " + scoremax;
    document.getElementById("score").innerHTML += "<br>Participant : " + listeTests[0].participant;
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
    "participant","question","response","RT"
  ];
  trialtable.innerHTML="<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody></tbody>";
  console.log(trialtable);
  document.getElementById("allCSV").href+= encodeURI(colnames.join(";")+"\n");
  for (var i=0; i< listeTests.length; i++) {
      var infoligne=[];
      colnames.forEach(x => infoligne.push((listeTests[i][x] && listeTests[i][x].toLocaleString && (x!=="RT")) ? listeTests[i][x].toLocaleString() : listeTests[i][x] ));
      trialtable.tBodies[0].innerHTML +="<tr><td>"+ infoligne.join("</td><td>") + "</td></tr>";
      document.getElementById("allCSV").href += encodeURI(infoligne.join(";") + "\n");
  }
  if(listeTests[0].debut) {
    // backup localStorage
    var cjt = getCjtStorage();
    cjt.sessions.push(document.location.href + '_' + listeTests[0].debut.toLocaleString());
    cjt.testdata.push(listeTests);
    setCjtStorage(cjt);
    document.getElementById("cjtJSON").href += encodeURI(JSON.stringify(cjt) + "\n");
  } 
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
  // ajout de la dernière réponse au score
  if(currentTest>=0 && listeTests[currentTest].response && (listeTests[currentTest].response !== "NA")) {
    score = score + parseInt(listeTests[currentTest].response, 10);
  }
  currentTest = currentTest+1;
  if (currentTest < listeTests.length) {
    // empecher zoom et defilements
    preventDefaultGestures = true;
    // modifier le titre
    var title = document.getElementById("title");
    title.innerHTML = "Score : " + score;
    title.hidden = true;
    document.getElementById("scale").value = 5;
    document.getElementById("NA").checked = false;
    document.getElementById("question").innerHTML = listeTests[currentTest].question;
    document.getElementById("OKnext").disabled = true;
    if (listeTests[currentTest].reponse0) {
      document.getElementById("reponse0").innerHTML = listeTests[currentTest].reponse0;
      document.getElementById("reponse10").innerHTML = listeTests[currentTest].reponse10;
    }
    // couleur de fond d'écran en fonction du test
    if (listeTests[currentTest].type_data) {
      document.getElementById("testscreen").className = listeTests[currentTest].type_data.replace(/[0-9]*/,"");
    } else {
      document.getElementById("testscreen").className = "";
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
  checkTimeoutInterval = setInterval(checkTimeout,1000);
  // premier trial
  gonext();
  // renvoyer false pour eviter le rechargement de la page a la soumission du formulaire
  return(false); 
};

// mise a jour du cache pour les ipads (obsolète mais utile si ancienne version installée sur l'ipad)
var maj_cache = function(e) {
    window.applicationCache.swapCache();
    endTest(e);
};

/*
 * Teste si un sous-test est demandé dans l'adresse
 */
var testeAdressSousTest = function(adress) {
    document.title = "Échelle"; 
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        // demander la version
        navigator.serviceWorker.controller.postMessage('version');
    } else {
        document.getElementById("title").insertAdjacentText("afterend", "Absence de contrôle du cache\n");
    }
};

/*
 * Tests infos codees dans l'adresse et le protocole
 */
var testeAdress = function() {
    var protocol=document.location.protocol;
    var adress=document.location.search;

    testeAdressSousTest(adress);
};
// changement de questionnaire
async function changeQuestions(e) {
  if (e && e.target && e.target.files && e.target.files.length === 1) {
    console.log(e.target.files[0]);
    var txt = await e.target.files[0].text();
    var csv_lines = txt.replaceAll('\r','').split('\n');
    csv_header = csv_lines.shift();
    // les noms des champs sont dans la 1ère ligne, séparés par des ; 
    csv_colnames = csv_header.split(';')
    // pour chaque ligne, les valeurs sont séparées par des ; 
    // on les regroupe dans un objet
    listeTests = csv_lines.map(q => (Object.assign(...csv_colnames.map((col,i) => ({[col]: q.split(';')[i]})))));
    listeTests = listeTests.filter(t => (t.question));
    var cjt = getCjtStorage();
    cjt.questions = { 
      'filename': e.target.files[0].name, 
      'listeTests': listeTests
    };
    setCjtStorage(cjt);
  }
  
}
// s'il n'y a pas de mise a jour, charger le test
var onCacheOK = function() {
  // Verifier s'il y a des questions enregistrees
  var cjt = getCjtStorage();
  if (cjt.questions) {
    document.getElementById("selectQ").defaultValue = cjt.questions.filename;
    listeTests = cjt.questions.listeTests;
  }
  // si le sous-test est specifie, adapter la liste des tests
  testeAdress();
  // lorsqu'on clique dessus enregistrer la réponse
  if( 'ontouchstart' in window) {
    document.getElementById("scale").addEventListener('touchstart', setinfotrial, true);
  } else {
    document.getElementById("scale").addEventListener('mousedown', setinfotrial, true);
  }
  document.getElementById("scale").addEventListener('change', setinfotrial, true);
  document.getElementById("NA").addEventListener('change', setinfotrial, true);
  document.getElementById("OKnext").disabled = true;
  document.getElementById("OKnext").addEventListener('click', gonext, true);
  document.getElementById("selectQ").addEventListener('change', changeQuestions, false);
  if (document.getElementById("infosuj").hidden) {
    // Le lancement est manuel depuis la page infosuj sauf si elle est masquée
    commencer();
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

