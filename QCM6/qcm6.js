// Questions à 6 choix posibles pour Annie Moulin, CNRS
// Code HTML/javascript/CSS par Anne Cheylus, CNRS

/* 
 * En reprenant les questionnaires sur tablette, j'ai pensé que le test lexical que nous utilisons pourrait aussi être mis sur tablette.
 * Ce test est un QCM (cf PJ): une question, 6 réponses (chacune sous forme d'un mot).
 * Les logiciels tout faits qui permettent de gérer celà ont des petites cases à côté des réponses, qu'il faut cocher, et qui ne sont pas bien contrastées. 
 * Pour que ce soit adapté à des personnes âgées, il faudrait qu'elles puissent choisir la réponse en cliquant dessus et que leur choix soit évident 
 * (comme tu avais fait pour les questionnaires : c'est la même population cible).
 * il y a 34 QCM : 1 par page serait bien, avec un bouton "valider", et sans possibilité de retourner en arrière, mais un bouton quitter en cours de route 
 * (petit celui là). Pour les temps de réaction, c'est plus compliqué : il me semble qu'il faudrait le TR du dernier mot sélectionné avant le clic sur valider, 
 * et aussi le TR attaché au bouton valider (j'ai peur que certains patients oublient de valider pendant un moment, surtout au début).
 * Il n'y a pas de retour patient : la bonne réponse ne doit pas apparaitre. Il n'y a pas de randomisation non plus : les réponses sont graduées (plus difficiles 
 * à la fin).
*/

// temps maximum pour repondre : dix minutes (600000 ms)
var maxwait = 600000;
// initialisation de la référence au callback du timeout
var checkTimeoutInterval = false;


// Liste de tests à modifier en chargeant le csv
var listeTests = [{ 
  nom_var: 'b',
  num_question: 0,
  question: 'b', 
  option_1: 'A', 
  option_2: 'B',
  option_3: 'C',
  option_4: 'D',
  option_5: 'E',
  option_6: 'F',
  solution: '2',  
  type: 'test'}];

var currentTest=-1;

var onVisibilityChange = function(e) {
  var now = new Date();
  var cjt = getCjtStorage();
  if (document.visibilityState === 'hidden') {
    if (currentTest !== -1) {
      // Le participant a commencé à répondre, logger la pause
      if (!cjt.log) {
        cjt.log = [];
      }
      cjt.log.push({'pause': now, 'session' : cjt.sessions.length, 'test' : currentTest});
    }
  } else {
    // VisibilityState != hidden : on reprend
    if (currentTest !== -1) {
       // Le participant a commencé à répondre, logger la reprise
      if (!cjt.log) {
        cjt.log = [];
      }
      cjt.log.push({'reprise': now, 'session' : cjt.sessions.length, 'test' : currentTest});
      pause();
    }
  }
  // Enregistrer
  setCjtStorage(cjt);
}

// souligner la réponse choisie
var feedback_selection = function(id_choix) {
  document.querySelectorAll('.option').forEach(e => e.className = (e.id == id_choix) ? 'option choisie' : 'option')
};
// enregistrer la réponse
var setinfotrial = function(e) {
  console.log('setinfotrial ' + e.currentTarget.id);
  // seulement si le trial a debute
  if(listeTests[currentTest].debut) {
    // infosTrial
    if (currentTest>=0 && currentTest < listeTests.length && e && e.currentTarget ) {
      // noter la réponse, autoriser le passage à la suite
      listeTests[currentTest].choix = e.currentTarget.id.replace('option_','');
      feedback_selection(e.currentTarget.id);
      if (listeTests[currentTest].type.match('exemple avant choix')) {
        // Au moment de l'exemple, on passe à la suite si on fait le bon choix
        if (listeTests[currentTest].choix == listeTests[currentTest].solution) {
          gonext();
        }
      } else if(listeTests[currentTest].type.match('exemple après choix')) {
        // On peut passer à la suite si le bon mot reste souligné
        document.getElementById("OKnext").disabled = listeTests[currentTest].choix != listeTests[currentTest].solution;
      } else {
        // Au moment du test tout choix peut être pris en validé 
        document.getElementById("OKnext").disabled = false;
      }
      // timing au début du toucher ou du clic
      if((e.type === "touchstart") || (e.type === "mousedown")) {
        listeTests[currentTest].fin = new Date();
        listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
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
var strScores = function() {
  score = listeTests
    .filter(t => t.type =="test")
    .map(e => e.choix == e.solution)
    .reduce((a,b) => b? a+1:a, 0)
  str = "<h3> score : " + score + "</h3>";
  return(str);
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
    // scores par test
    document.getElementById("score").innerHTML = "";
    document.getElementById("score").innerHTML += strScores();
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
    "participant","nom_var","num_question","question","solution","choix","RT","RT2"
  ];
  trialtable.innerHTML="<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody></tbody>";
  console.log(trialtable);
  document.getElementById("allCSV").href+= encodeURI(colnames.join(";")+"\n");
  for (var i=0; i< listeTests.length; i++) {
    if(listeTests[i].type=="test") {
      var infoligne=[];
      colnames.forEach(x => infoligne.push(listeTests[i][x]));
      trialtable.tBodies[0].innerHTML +="<tr><td>"+ infoligne.join("</td><td>") + "</td></tr>";
      document.getElementById("allCSV").href += encodeURI(infoligne.join(";") + "\n");
    }
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

// définition de la fonction pour aller au test suivant : gonext
var gonext = function(e) {
  if ( (currentTest >= 0) && !listeTests[currentTest].hasOwnProperty('fin')) {
    listeTests[currentTest].fin = new Date();
    listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
  }
  if (currentTest >= 0) {
    listeTests[currentTest].validation = new Date();
    listeTests[currentTest].RT2 = listeTests[currentTest].validation.getTime() - listeTests[currentTest].fin.getTime();
  }
  console.log("gonext : " + currentTest);
  currentTest = currentTest + 1;
  if (currentTest < listeTests.length) {
    // empecher zoom et defilements
    preventDefaultGestures = true;
    document.querySelectorAll('.consigne').forEach(e => e.remove());
    document.getElementById("question").innerHTML = listeTests[currentTest].question;
    document.querySelectorAll('.option').forEach(e => e.innerText = listeTests[currentTest][e.id])
    feedback_selection('none');
    document.getElementById("OKnext").disabled = listeTests[currentTest].type.match('(test|exemple avant choix)');
    if (listeTests[currentTest].type.match('(test|exemple avant choix)')) {
      feedback_selection('');
    } else {
      feedback_selection('option_' + listeTests[currentTest].solution);
    }
    if (listeTests[currentTest].type.match('consigne')) {
      document.getElementById("OKnext").value = 'Suivant';
    } else {
      document.getElementById("OKnext").value = 'Valider';
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
  if (document.getElementById('endscreen').hidden) {
    document.getElementById("reprendre").addEventListener('click', reprendre, {once: true, capture: true});
    document.getElementById("terminer").addEventListener('click', endTest, {once: true, capture: true});
    document.getElementById("testscreen").hidden = true;
    document.getElementById("pausescreen").hidden = false;
  }
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

// randomiser l'ordre de présentation des test s'il y a un pivot
var randomiser = function() {
  // randomisation sur les minutes du début (si paires)
  let now = new Date();
  if ((now.getMinutes() % 2) == 1) {
    return;
  }
  ipivot = listeTests.map((t,i)=>(t.type_data=="Pivot"?i:-1)).filter(x=>(x>=0));
  imerci = listeTests.map((t,i)=>(t.type_data=="Merci"?i:-1)).filter(x=>(x>=0));
  // randomisation sur les minutes du début (si paires)
  if ((ipivot.length == 1) && (imerci.length == 1) && (imerci[0] = listeTests.length-1)) {
    ipivot = ipivot[0];
    imerci = imerci[0];
    // échanger merci et pivot puis 1ère et 2ème partie
    listeTests = listeTests.concat(listeTests.splice(ipivot,1,listeTests.splice(imerci,1)[0]));
    listeTests = listeTests.concat(listeTests.splice(0,ipivot+1));
  }
};
// lire le code participant et commencer l'essai
var commencer = function() {
  randomiser();
  listeTests.forEach(x => x.participant = document.getElementById("participant_code").value);
  console.log(listeTests[0].participant);
  // masquer le clavier et le formulaire, afficher le test
  document.activeElement.blur();
  document.getElementById("infosuj").hidden = true;
  document.getElementById("title").hidden = true;
  document.getElementById("testscreen").hidden = false;
  // verifier l'absence d'interruption prolongee
  checkTimeoutInterval = setInterval(checkTimeout,1000);
  // premier trial
  gonext();
  // renvoyer false pour eviter le rechargement de la page a la soumission du formulaire
  return(false); 
};

/*
 * Teste si un sous-test est demandé dans l'adresse (non implémenté)
 */
var testeAdressSousTest = function(adress) {
    document.title = "QCM6"; 
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
    if(document.getElementById("cacheinfo")) {
      document.getElementById("cacheinfo").remove();
    } 
    var cjt = getCjtStorage();
    cjt.questions = { 
      'filename': e.target.files[0].name, 
      'listeTests': listeTests
    };
    setCjtStorage(cjt);
  }
};

// s'il n'y a pas de mise a jour, charger le test
var onCacheOK = function() {
  // Verifier s'il y a des questions enregistrees
  var cjt = getCjtStorage();
  if (cjt.questions) {
    document.getElementById("selectQ").defaultValue = cjt.questions.filename;
    document.getElementById("selectQ").insertAdjacentHTML("afterend", 
    "<div id='cacheinfo'>En mémoire : " + cjt.questions.filename + "</div>");
    listeTests = cjt.questions.listeTests;
  }
  // si le sous-test est specifie, adapter la liste des tests (non implémenté)
  testeAdress();
  // lorsqu'on clique dessus enregistrer la réponse
  if( 'ontouchstart' in window) {
    document.querySelectorAll('.option').forEach(e => e.addEventListener('touchstart', setinfotrial, true))
  } else {
    document.querySelectorAll('.option').forEach(e => e.addEventListener('mousedown', setinfotrial, true))
  }
  document.getElementById("OKnext").disabled = true;
  document.getElementById("OKnext").addEventListener('click', gonext, true);
  document.getElementById("selectQ").addEventListener('change', changeQuestions, false);
  document.addEventListener("visibilitychange", onVisibilityChange);
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

