// Liste des tests (pages html sur le même modèle)
var listeTests = [];

var currentTest=-1;
var score = 0;
// temps maximum pour repondre : une minute (60000 ms)
var maxwait = 60000;
var checkTimeoutInterval = false;

// enregistrer la réponse
var setinfotrial = function(e) {
  console.log('setinfotrial ' + e.currentTarget.id);
  // seulement si le trial a debute
  if(listeTests[currentTest].debut) {
    // infosTrial
    if (currentTest>=0 && currentTest < listeTests.length && e && e.currentTarget ) {
      if (!listeTests[currentTest].hasOwnProperty('response')) {
        listeTests[currentTest].response = (e.currentTarget.id == "gooditem");
        listeTests[currentTest].fin = new Date();
        listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
        // feedback puis lorsque l'animation sera finie passer au trial suivant
        if (e.currentTarget.id == "gooditem") {
          // score
          score = score + 1;
          document.getElementById("good").addEventListener('endEvent', gonext, {once: true, capture: true});
          document.getElementById("good").beginElement();
        } else {
          document.getElementById("bad").addEventListener('endEvent', gonext, {once: true, capture: true});
          document.getElementById("bad").beginElement();
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
  document.getElementById("testscreen").hidden=true;
  document.getElementById("pausescreen").hidden = true;
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
    // rappel score
    document.getElementById("score").innerHTML = "Score : " + score + " / " + listeTests.length;
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
    "participant","title","type",
    "topimg","goodimg","badimg",
    "good","bad",
    "debut","fin",
    "response","RT"
  ];
  trialtable.innerHTML="<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody></tbody>";
  console.log(trialtable);
  document.getElementById("allCSV").href+= encodeURI(colnames.join(";")+"\n");
  for (var i=0; i< listeTests.length; i++) {
    if(listeTests[i].hasOwnProperty("response")) {
      var infoligne=[];
      colnames.forEach(x => infoligne.push(listeTests[i][x].toLocaleString ? listeTests[i][x].toLocaleString() : listeTests[i][x]));
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
   // recherche des éléments svg animateTransform pour la bonne et la mauvaise réponse (good et bad)
  var good = document.getElementById("good");
  var bad = document.getElementById("bad");
  
  currentTest = currentTest+1;
  if (currentTest < listeTests.length) {
    // empecher zoom et defilements
    preventDefaultGestures = true;
    // modifier le titre
    var title = document.getElementById("title");
    title.innerHTML = listeTests[currentTest].title + " - score : " + score;
    title.hidden = true;
    // modifier les 3 images
    var topimg = document.getElementById("topimg");
    var goodimg = document.getElementById("goodimg");
    var badimg = document.getElementById("badimg");
    
    // modifier le côté de la bonne réponse
    var topitem = document.getElementById("topitem");
    var gooditem = document.getElementById("gooditem");
    var baditem = document.getElementById("baditem");
    // Tout masquer le temps de redessiner
    topitem.hidden=true;
    gooditem.hidden=true;
    baditem.hidden=true;
    // modifier les cotes
    gooditem.setAttribute("class", listeTests[currentTest].good);
    baditem.setAttribute("class", listeTests[currentTest].bad);
    
    // a faire quand tout est charge
    var nload=3;
    // Parfois il y a une image deja chargee, en tenir compte.
    if(topimg.getAttribute("xlink:href") == listeTests[currentTest].topimg) {
      nload--;
    }
    if(goodimg.getAttribute("xlink:href") == listeTests[currentTest].goodimg) {
      nload--;
    }
    if(badimg.getAttribute("xlink:href") == listeTests[currentTest].badimg) {
      nload--;
    }
    var checkAllLoaded = function(e) {
      nload--;
      if (nload === 0) {
        // Lorsque tout est pret, afficher et horodater le debut
        topimg.onload = undefined;
        goodimg.onload = undefined;
        badimg.onload = undefined;
        topitem.hidden = false;
        gooditem.hidden = false;
        baditem.hidden = false;
        listeTests[currentTest].debut=new Date();
        title.innerHTML = listeTests[currentTest].title + " - score : " + score + ".";
      }
    };
    topimg.onload = checkAllLoaded;
    goodimg.onload = checkAllLoaded;
    badimg.onload = checkAllLoaded;
    topimg.onerror = errorload;
    goodimg.onerror = errorload;
    badimg.onerror = errorload;
    topimg.setAttribute("xlink:href", listeTests[currentTest].topimg);
    goodimg.setAttribute("xlink:href", listeTests[currentTest].goodimg);
    badimg.setAttribute("xlink:href", listeTests[currentTest].badimg);
    setTimeout(function() {
      // Si les images sont en cache, il n'y a pas toujours de trigger d'onload
      if (nload===0 || (window.applicationCache && nload>0)) {
        nload=1;
        checkAllLoaded();
      }
    }, 100);
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
  participant = document.getElementById("participant_code").value;
  participant = participant.toUpperCase();
  listeTests.forEach(x => x.participant = participant);
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

/* 
 * lecture json
 */
var readJSON = async function(jf) {
  r = await fetch(jf); 
  jdata = await r.json();
  return (jdata);
}

var readAllJSON = async function(jsonfiles) {
  for (jf of jsonfiles) {
    jdata = await readJSON(jf);
    listeTests = listeTests.concat(jdata);
  }
}
/*
 * Teste si un sous-test est demandé dans l'adresse
 */
var testeAdressSousTest = function(adress) {
  jsonfiles = [];
  var icn = document.createElement('link');
  icn.rel = 'apple-touch-icon';
  icn.href='apple-touch-icon.png';
  if (adress && (adress.indexOf("test=1")>0)) {
    jsonfiles.push('json/pvse1.json');
    document.title = "PVS1";
    icn.href = 'pvse1.png';
  } else if (adress && (adress.indexOf("test=2")>0)) {
    jsonfiles.push('json/pvse2.json');
    document.title = "PVS2";
    icn.href = 'pvse2.png';
  } else if (adress && (adress.indexOf("test=3")>0)) {
    jsonfiles.push('json/pvse3.json');
    document.title = "PVS3";
    icn.href = 'pvse3.png';
  } else if (adress && (adress.indexOf("test=4")>0)) {
    jsonfiles.push('json/pvse4.json');
    document.title = "PVS4";
    icn.href = 'pvse4.png';
  } else if (adress && (adress.indexOf("test=5")>0)) {
    jsonfiles.push('json/pvse5.json');
    document.title = "PVS5";
    icn.href = 'pvse5.png';
  } else {
    jsonfiles.push('json/pvse1.json');
    jsonfiles.push('json/pvse2.json');
    jsonfiles.push('json/pvse3.json');
    jsonfiles.push('json/pvse4.json');
    jsonfiles.push('json/pvse5.json');
    document.title = "PVS";
    icn.href = 'pvse2.png';
  }
  document.head.appendChild(icn);
  readAllJSON(jsonfiles).then(function(){
    document.getElementById("title").innerHTML = listeTests[0].title;
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      // demander la version
      navigator.serviceWorker.controller.postMessage('version');
    } else {
      document.getElementById("title").insertAdjacentText("afterend", "Absence de contrôle du cache\n");
    }
  });
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
  // recherche des éléments item pour la bonne et la mauvaise réponse (gooditem et baditem)
  var gooditem = document.getElementById("gooditem");
  var baditem = document.getElementById("baditem");
  
  // lorsqu'on clique dessus enregistrer la réponse
  if( 'ontouchstart' in window) {
    gooditem.addEventListener('touchstart', setinfotrial, true);
    baditem.addEventListener('touchstart', setinfotrial, true);
  } else {
    gooditem.addEventListener('click', setinfotrial, true);
    baditem.addEventListener('click', setinfotrial, true);
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
      document.getElementById("title").insertAdjacentText("afterend", "Un changement de contrôleur est intervenu.\n");
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


