// Cible pour Sébastien MATEO UCBL & HCL
// Code HTML/javascript/CSS par Anne Cheylus, CNRS
// Adaptation à partir du code https://github.com/crnl-lab/ipad_html_tests 
// Sous licence GPLv3 https://www.gnu.org/licenses/gpl-3.0.txt



// Numéro de la session en cours (sera lu dans le local storage)
var currentSession = -1;

// currentTest pointe sur la répétition actuelle
var currentTest=-1;

// Questions du formulaire initial pour la configuration (participant/session)
// Liste des étapes à afficher séparément, identifiées par l'id d'une question
var listeEtapes = [
  "code_participant",
  "session",
  "type_session_pretest",
  "repetition",
  "diametre_cible",
  "distance_vert",
  "distance_orange",
  "distance_rouge",
  "validation",
  "cible1"
];
// listeTests
var listeTests=listeEtapes.map(q => ({'question': q}));

// enregistrer les données de formulaire
var saveformdata = function () {
  // Il ne doit y avoir qu'un seul formulaire
  var f = document.querySelector('form'); 
  // Ajouter des noms quand il n'y en a pas (sinon ils ne seront pas enregistrés)
  f.querySelectorAll('input, select, textarea').forEach((e) => e.name = ((e.name == "") ? e.id : e.name));
  // Récupérer les données (non disabled) du formulaire
  var fd = new FormData(f);
  // Ajouter le code participant même s'il est disabled et toujours en majuscules
  fd.set('code_participant',document.querySelector('#code_participant').value.toUpperCase());
  var fds = new URLSearchParams(fd);
  // Enregistrer dans localStorage
  var cjt = getCjtStorage();
  if (! cjt.formdata) {
    cjt.formdata = [];
  }
  cjt.formdata[currentSession] = fds.toString();
  setCjtStorage(cjt);
};

// enregistrer la réponse
var setinfotrial = function(listinput, testnum) {
  console.log('setinfotrial ' + testnum);
  // seulement si le trial a debute
  if(listeTests[testnum].debut) {
    // infosTrial
    if (testnum>=0 && testnum < listeTests.length) {
      listeTests[testnum].response = [...listinput].map(e => e.id + ":" + e.value+ " " +  e.checked+ "; ").reduce((a,b)=>a+b, "");
      listeTests[testnum].fin = new Date();
      listeTests[testnum].RT = listeTests[testnum].fin.getTime() - listeTests[testnum].debut.getTime();
    } 
    // Save it in local storage
    saveformdata();
  } 
};

// stockage local
var getCjtStorage = function() {
    var myStorage = window.localStorage;
    var cjt = myStorage.getItem('cjt');
    if(!cjt) {
      console.log("pas de stockage local : initialisation");
      cjt = { ipad: Date.now().toString(36) + Math.random().toString(36).substring(2),
              sessions: [],
              testdata : [],
              formdata : []
            };
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

var ajouteRapportGlobal = function(testdata, infoSessions) {
  // table récapitulative
  var colnames = [
    "participant","type_session","session","debut","fin","n","distance","RT"
  ];
  var trialtable = infoSessions.querySelector("#recapGlobal");
  if (!trialtable) {
    trialtable = document.createElement('table');
    trialtable.className = "tab_r";
    trialtable.id = 'recapGlobal'
    trialtable.innerHTML="<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody></tbody>";
    infoSessions.appendChild(trialtable)
    document.getElementById('allCSV').href = 'data:text/plain;charset=utf-8,%EF%BB%BF';
    document.getElementById("allCSV").href+= encodeURI(colnames.join(";")+"\n");
  }
  // remettre les dates au format date
  testdata['debut'] = testdata['debut'] && (new Date(testdata['debut']));
  testdata['fin']   = testdata['fin']   && (new Date(testdata['fin']));
  var infoligne = colnames.map(k => testdata[k])
    .map(x => (x && x.toLocaleDateString) ? x.toLocaleString().replace("à ","") : x)
    .map(x => (x && x.replaceAll) ? x.replaceAll(/(;|\n)/g,' ') : x);
  trialtable.tBodies[0].innerHTML +="<tr><td>"+ infoligne.join("</td><td>") + "</td></tr>";
  document.getElementById("allCSV").href += encodeURI(infoligne.join(";") + "\n");   
  document.getElementById("allCSV").innerText="Export CSV" 
  // actualisation timestamp dans csv_name
  var now = new Date();
  var date_heure = now.toISOString().substring(0,16).replace(/-|T|:/g,"");
  var csv_name = `${date_heure}_${document.title}_TOUT.csv`;
  document.getElementById("allCSV").download = csv_name;
}

var ajouteInfoFd = function() {
  // tabFd = tableau avec le contenu de formdata pour la session courante
  var tabFd = document.querySelector("#fdd");
  if (! tabFd) {
    tabFd = document.createElement("table");
    tabFd.id = "fdd";
    document.getElementById("endscreen").insertAdjacentElement("beforeend", tabFd);
  }
  var cjt = getCjtStorage();
  // Infos sur la session courante
  if (cjt.formdata && cjt.formdata[currentSession]) {
    var colnames = ['clé','valeur'];
    var tabFdData = cjt.formdata[currentSession]
      .split('&')
      .map((e) => 
        '<td>' + decodeURI(e).replace('=','</td><td>') + '</td>')
      .join('</tr><tr>');
    tabFd.innerHTML = "<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody>" + tabFdData + "</tbody>";
  }
  // Sessions enregistrées et finies
  var idx_sessions_finies = cjt.formdata.map((e,i) => (e && e.indexOf('&validation=on')>=0)?i:null).filter(e => (e!==null));
  var idx_sessions_partielles = cjt.formdata.map((e,i) => (e && e.indexOf('part')>=0 && e.indexOf('&validation=on')<0)?i:null).filter(e => (e!==null));
  var idx_sessions_vides = cjt.sessions.map((e,i) => cjt.formdata[i]?null:i).filter(e => (e!==null));
  var infoSessions = document.querySelector('#infoSessions');
  if (! infoSessions) {
    infoSessions = document.createElement("div");
    infoSessions.id="infoSessions";
    document.getElementById("endscreen").insertAdjacentElement("beforeend", infoSessions);
  }
  infoSessions.innerHTML = "<h2>Enregistrements</h2>" +
    "<p><ul><li>" + idx_sessions_finies.length + " enregistrements validés"  +
    "</li><li>" + idx_sessions_partielles.length + " enregistrements non validés" +
    "</li><li hidden>" + idx_sessions_vides.length + " enregistrements vides" +
    "</li><li hidden>Pour un total de " + cjt.sessions.length  + " sessions </li></ul>"  ;
  
  if(idx_sessions_finies.length>0) {
    infoSessions.innerHTML += "<h3>Enregistrements validés</h3>";
    var debut = idx_sessions_finies.reduce((a,b) => Math.min(a,b));
    infoSessions.innerHTML += 'du ' + cjt.sessions[debut].split('_')[1];
  } 
  if(idx_sessions_finies.length>1) {
    var fin = idx_sessions_finies.reduce((a,b) => Math.max(a,b));
    infoSessions.innerHTML += ' au ' + cjt.sessions[fin].split('_')[1];
  }
  // Ajouter le rapport global
  cjt.testdata.filter(x => x).map(testd => {
    testd.filter(e => e.session && e.debut).map(t => ajouteRapportGlobal(t,document.getElementById('infoSessions')))
  });
};




// fin du test
var endTest = function(evt) {
  document.getElementById("pausescreen").hidden = true;
  document.getElementById('tab_title').hidden=false
  document.getElementById("endscreen").hidden=false;
  preventDefaultGestures = false;
  // Modifier le numero du sujet pour l'enregistrement
  if(listeTests[0].debut) {
    var date_heure = listeTests[0].debut.toISOString().substr(0,16).replace(/-|T|:/g,"");
    var csv_name = listeTests[0].participant + "_" + document.title + "_" + date_heure + ".csv";
    document.getElementById("allCSV").download = csv_name;
    document.getElementById("allCSV").innerHTML = "Enregistrer " + csv_name;
    // infos globales
    document.getElementById("recap").innerHTML = "";
    document.getElementById("recap").innerHTML += "<br>Participant : " + listeTests[0].participant;
    document.getElementById("recap").innerHTML += "<br>Début : " + listeTests[0].debut.toLocaleString().replace(" à ", " ");
    if(listeTests[listeTests.length-1].fin){
      document.getElementById("recap").innerHTML += "<br>Fin : " + listeTests[listeTests.length-1].fin.toLocaleString().replace(" à ", " ");
      var duree = new Date(listeTests[listeTests.length-1].fin.getTime() - listeTests[0].debut.getTime());
      document.getElementById("recap").innerHTML += "<br>Durée : " + duree.toISOString().substr(11, 8) ;
    }
  }
  // table récapitulative
  var trialtable = document.getElementById("trialtable");
  var colnames = [
    "participant","type_session", "session","debut","fin","n","distance","RT"
  ];
  trialtable.innerHTML="<thead><tr><th>"+ colnames.join("</th><th>")+"</th></tr></thead><tbody></tbody>";
  console.log(trialtable);
  document.getElementById("allCSV").href+= encodeURI(colnames.join(";")+"\n");
  for (var i=0; i< listeTests.length; i++) {
    if((listeTests[i].question.indexOf('cible')==0) && listeTests[i].debut) {
      var infoligne = colnames.map(x => listeTests[i][x]);
      infoligne = infoligne.map(x => (x && x.toLocaleDateString) ? x.toLocaleString().replace("à ","") : x);
      trialtable.tBodies[0].innerHTML +="<tr><td>"+ infoligne.join("</td><td>") + "</td></tr>";
      infoligne = infoligne.map(e => e && e.replaceAll && e.replaceAll(/(;|\n)/g,' ') || e);
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
// Actualise la visibilité du bouton Validation si une modif change la validité du formulaire
// si doTest est faux on sait déjà que c'est invalide, inutile de vérifier
var testValide = function(doTest) {
  // seulement pour les paramètres au début
  var nvalid = listeEtapes.indexOf('validation');
  if ((currentTest < nvalid) && (currentTest>=0)) {
    var valid = false;
    if (doTest) {
      valid = document.querySelector('#' + listeEtapes[currentTest]).validity.valid ;
    }
    listeTests[currentTest].valid = valid;
  } else if (currentTest == nvalid) {
    var valid = false;
    if (doTest) {
      valid = listeEtapes
        .map((e,i) => (i >= nvalid || document.querySelector('#' + e ).validity.valid ))
        .reduce((a,b) => (a && b), true);
    } 
    console.log("testValide : " + valid);
    var btnv = document.querySelector('#validation');
    // Activer ou désactiver le(s) fieldset(s) parent(s) du bouton "Validation"
    p = btnv.parentElement;
    while (p) {
      if (p.type && (p.type === 'fieldset')) {
        p.disabled = !valid;
      }
      p = p.parentElement;
    } 
    listeTests[nvalid].valid = valid && btnv.validity.valid;
  }
}
// Préparer les tests cibles 
var ajuste_parametres_cible = function() {
  var n = document.querySelector('#repetition').value;
  var i = 1;
  listeTests = listeTests.filter(e => e.question.indexOf('cible')!==0);
  for (i = 1; i<=n; i++) {
    listeTests.push({ 
      'participant': listeTests[0].participant,
      'type_session': document.querySelector('input[name="type_session"]:checked').value,
      'session': document.querySelector('input[name="session"]').value,
      'question': 'cible' + i, 
      'n': i});
  }
  preventDefaultGestures = true;
};
// Vérifier si le formulaire courant est validé pour enregistrer et passer à la suite
var traiteModifications = function(parentFieldset, testnum) {
  var tmTest = function(e) {
    if(e && e.target) {
      var listinput = parentFieldset.querySelectorAll('select,input,textarea');
      // un élément du fieldset parent est valide, qu'en est-il des autres ?
      var allvalid = [...listinput].map(i => i.validity.valid).reduce((a,b) => a && b, true);
      // s'ils sont tous valides enregistrer les infos et autoriser les réponses qui suivent
      if (allvalid) {
        listeTests[testnum].valid = true;
        setinfotrial(listinput, testnum);
        // activer le test suivant sauf si retour en arrière ou textarea et input
        if ((testnum == currentTest) && ((e.type!='input') || (e.target.type!='textarea'))) {
          // Si c'est le bouton valider qui est coché ajuster les paramètres
          if (e.target.id && (e.target.id == 'validation')) {
            ajuste_parametres_cible();
          }
          gonext();
        } else {
          // tester les autres questions pour voir si on peut valider
          testValide(true);
        }
      } else {
        listeTests[testnum].valid = false;
        console.log('non valide : ' + testnum + '-' + e.target.id )
        // si le questionnaire n'est plus valide, actualiser le bouton valider
        testValide(false);
      }
    }
  }
  return tmTest
}
// Surveiller les modifications dans le fieldset ou son parent
var surveilleModifications = function(q) {
  parentFieldset = document.getElementById(q);
  if (parentFieldset.type != 'fieldset') {
    parentFieldset = document.getElementById(q).parentElement;
  }
  if (parentFieldset.type != 'fieldset') {
    visibleError('surveilleModification en dehors d\'un fieldset');
  }
  listmod = parentFieldset.querySelectorAll('select,input,textarea');
  listmod.forEach(e => e.addEventListener('input', traiteModifications(parentFieldset, currentTest)));
  listmod = parentFieldset.querySelectorAll('textarea');
  listmod.forEach(e => e.addEventListener('blur', traiteModifications(parentFieldset, currentTest)));
}
/* feedback sur position initiale par recalage */
var recale_centre_cible = function(evt) {
  var c = document.getElementById('centre_cible');
  c.setAttribute( 'fill','#000');
  c.setAttribute('cx', evt.clientX);
  c.setAttribute('cy', evt.clientY);
  c.setAttribute('r', document.querySelector('#diametre_cible').value/2) ;
};
/* Attendre un délai supplémentaire ou un clic pour l'imagerie */
var intertrial = function(img) {
  if (img) {
    var delai = document.querySelector('#delai').value*1000;
    /* on soustrait la duree du feedback au délai */
    var to = setTimeout(gonext, delai - 1000, 'timeout');
    console.log(`setTimeout(gonext,${delai - 1000},timeout) = ${to}`);
    if (delai > 2000) {
      // Si le délai est assez long on peut cliquer pour passer au suivant sans attendre la fin du délai
      var skipTimeout = function() {
        clearTimeout(to);
        console.log(`cleartimeout(${to})`)
        gonext('skip');
      };
      document.getElementById('cibles').addEventListener('click', skipTimeout, {'once': true});
      // Il faut retirer cet event listener sur click un peu avant la fin du délai
      setTimeout(_ => {
        document.getElementById('cibles').removeEventListener('click', skipTimeout, { 'once': true });
      }, delai - 1500);
    }
  } else {
    gonext('direct');
  }
};
/* Feedback selon distance à la cible */
var feedback_cible = function(evt) {
  if ( (currentTest > 0) && !listeTests[currentTest].hasOwnProperty('fin')) {
    listeTests[currentTest].fin = new Date();
    listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
  }
  var c = document.getElementById('centre_cible');
  var cx = c.getAttribute('cx');
  var cy = c.getAttribute('cy');
  var r = c.getAttribute('r');
  var img = document.getElementById('type_session_imagerie').checked;
  var delai = document.querySelector('#delai').value*1000;
  var x1 = img ? cx : evt.clientX;
  var y1 = img ? cy : evt.clientY;
  var d = Math.round(Math.sqrt((x1 - cx)**2 + (y1 - cy)**2));
  listeTests[currentTest].distance = Math.max(d-r, 0);
  listeTests[currentTest].cx = cx;
  listeTests[currentTest].cy = cy;
  listeTests[currentTest].x1 = x1;
  listeTests[currentTest].y1 = y1;
  document.querySelector('#cibles h2').innerHTML='d = ' + Math.max(d-r, 0) +' px';
  if (d <= c.getAttribute('r')) {
    c.setAttribute('fill','#009f00');
  } else {
    c.setAttribute('r', d);
    if (d <= document.querySelector('#distance_vert').value) {
      c.setAttribute('fill', '#009f00');
    } else if (d <= document.querySelector('#distance_orange').value) {
      c.setAttribute('fill', '#ffaf00');
    } else if (d <= document.querySelector('#distance_rouge').value) {
      c.setAttribute('fill', '#ff0000');
    } else {
      c.setAttribute('fill','#000');
      document.querySelector('#bg_cibles').setAttribute('fill', '#000a');
    }
  }
  /* Au moins 1s de feedback */
  setTimeout(intertrial, 1000, img);
};

/* Modification aleatoire de la cible */
var nouvelle_cible = function() {
  var c = document.getElementById('centre_cible');
  var vb = c.parentElement.getAttribute('viewBox');
  var w = Number(vb.split(' ')[2]); // width
  var h = Number(vb.split(' ')[3]); // height
  var x0 = Number(c.getAttribute('cx')); // x initial
  var y0 = Number(c.getAttribute('cy')); // y initial
  var r = document.querySelector('#diametre_cible').value/2;
  // r <= x <= w - r et r <= y <= h - r pour éviter de déborder
  // et aussi abs(x0 - x1)>= r et abs(y0 - y1)>=r pour bouger
  var x1 = r + (x0 + Math.floor(Math.random()*(w-4*r))) % (w-2*r) ;
  var y1 = r + (y0 + Math.floor(Math.random()*(h-4*r))) % (h-2*r) ;
  
  listeTests[currentTest].x0 = x0;
  listeTests[currentTest].y0 = y0;
  
  c.setAttribute( 'fill','#000');
  c.setAttribute('cx', x1);
  c.setAttribute('cy', y1);
  c.setAttribute('r', r);
  document.querySelector('#bg_cibles').setAttribute('fill', '#0000');
  document.querySelector('#cibles h2').innerHTML="&nbsp;";
  listeTests[currentTest].debut=new Date();
  document.getElementById('cibles').addEventListener('mousedown', feedback_cible, {'once': true});
  
};
var prepare_trial_cible = function() {
  var n = listeTests[currentTest].n || 1;
  if (n == 1) {
    /* Première cible : attendre le premier toucher */
    document.getElementById('cibles').addEventListener('mousedown', recale_centre_cible, {'once': true});
    document.getElementById('cibles').addEventListener('mouseup', nouvelle_cible, {'once': true});
  } else {
    nouvelle_cible();
  }
};
// définition de la fonction pour aller au test suivant : gonext
var gonext = function(e) {
  if ( (currentTest > 0) && !listeTests[currentTest].hasOwnProperty('fin')) {
    listeTests[currentTest].fin = new Date();
    listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
  }
  console.log("gonext : " + currentTest +  ' ' + (e ? (e.type || e) : ''));
  currentTest = currentTest+1;
  if (currentTest >= listeTests.length) {
    // c'est fini
    document.getElementById("tab_title").hidden = false;
    document.getElementById("cibles").hidden = true;
    endTest();
  } else {
    // phase cibles
    var trialcible = (currentTest < listeTests.length) && (listeTests[currentTest].question.indexOf("cible")==0);
    document.getElementById("tab_title").hidden = trialcible;
    document.getElementById("infosuj").hidden = trialcible;
    document.getElementById("cibles").hidden = !trialcible;
    if (trialcible) {
      prepare_trial_cible();
    } else  {
      // phase paramètres 
      var targetElement = document.getElementById(listeTests[currentTest].question);
      // Activer chaque fieldset parent sauf s'il est à faire plus tard
      p = targetElement.parentElement;
      while (p) {
        if (p.type && (p.type === 'fieldset')) {
          p.disabled = (p.className === 'dolater')
        }
        p = p.parentElement;
      }
      // Surveiller les modifications des input qui descendent de ce fieldset sauf 
      //  - si on le fait déjà
      if ( !listeTests[currentTest].debut ) {
        surveilleModifications(targetElement.id);
      }
      
      // c'est parti
      listeTests[currentTest].debut=new Date();
      targetElement.focus();
      targetElement.scrollIntoView();
      
      // vérifier si c'est pas déjà valide
      testValide(true);
      if (listeTests[currentTest].valid) {
        gonext();
      }
    } 
  }
};

var do_print = function() {
  window.print()
}
// gestion de l'orientation de l'ipad : afficher une consigne si une rotation est détectée
var gestionOrientation = function(evt) {
  document.querySelectorAll('#cibles svg').forEach(e => {
    var ovb = e.getAttribute('viewBox');
    var ovw = Number(ovb.split(' ')[2]);
    var ovh = Number(ovb.split(' ')[3]);
    if ((ovw != window.innerWidth) && (ovh != window.innerHeight)){
      // l'orientation a changé et modifié la viewBox du svg
      document.querySelector('#cibles h2').innerHTML += '<br>Verrouiller l\'orientation :<br>' + 
        '(tirez le coin en haut à droite vers le centre, cliquez sur le cadenas)';
    }
  });
};
// feedback paramétrage cible
var change_diametre = function(evt) {
  var table_id_svgelt = {
    'diametre_cible': 'modele_centre_cible',
    'distance_vert': 'modele_rond_vert',
    'distance_orange': 'modele_rond_orange',
    'distance_rouge': 'modele_rond_rouge'
  };
  if(evt && evt.target && evt.target.id) {
    var r = evt.target.value;
    if (evt.target.id == 'diametre_cible') {
      r = r/2;
    }
    document.getElementById(table_id_svgelt[evt.target.id]).setAttribute('r', r);
    evt.target.setCustomValidity('');
    // ajuster les min et max des cercles plus petits et plus larges si on est valide ou forcé
    if(evt.target.validity.valid || evt.force) {
      var l = Object.keys(table_id_svgelt).indexOf(evt.target.id);
      var smaller = Object.keys(table_id_svgelt)[l-1];
      var larger =  Object.keys(table_id_svgelt)[l+1];
      if (smaller) {
        var smaller_max = (smaller == 'diametre_cible') ? 2*r : r;
        var smaller_validity = document.getElementById(smaller).validationMessage.replace(" max ","");
        if (Number(document.getElementById(smaller).value) > Number(smaller_max)) {
          smaller_validity = smaller_validity + " max ";
          evt.target.setCustomValidity(' min ');
        } 
        document.getElementById(smaller).setCustomValidity(smaller_validity);
      }
      if (larger) {
        var larger_min = smaller ? r : 2*r;
        var larger_validity = document.getElementById(larger).validationMessage.replace(" min ","");
        if (Number(document.getElementById(larger).value) < Number(larger_min)) {
          larger_validity = larger_validity + " min ";
          evt.target.setCustomValidity(evt.target.validationMessage + ' max ');
        } 
        document.getElementById(larger).setCustomValidity(larger_validity);
      }
      if (evt.force && !evt.target.validity.valid) {
        // accepter les valeurs forcées
        evt.target.setCustomValidity('');
        visibleError('vérifier les diamètres');
      }
    }
  } else {
    /* tout ajuster */    
    for (var p in table_id_svgelt) { 
      change_diametre({'target': document.getElementById(p), 'force': true});
    }
  }
};
var checkvalidation = function(evt) {
  var v = document.querySelector('#validation');
  if (v.checked && evt.type == 'click') {
    v.click();
  }
};
// lire le code participant et commencer l'essai
var commencer = function() {
  listeTests.forEach(x => x.participant = document.getElementById("code_participant").value.toUpperCase());
  console.log(listeTests[0].participant);
  // masquer le clavier
  document.activeElement.blur();
  // bouton imprimer
  document.querySelector('#printbtn').addEventListener('click', do_print);
  // boutons download : adapter le nom avec le test
  document.querySelectorAll('a[download]').forEach(e => e.download = e.download.replace('testdata', document.title.replaceAll(/[^a-zA-Z]/g,'')));
  // bouton valider élargi (case à cocher déguisée en bouton)
  document.querySelector('#validation').parentElement.addEventListener('click', checkvalidation);
  // gestion de l'orientation de l'ipad
  window.addEventListener("deviceorientation", gestionOrientation, true);
  window.addEventListener("click", DeviceOrientationEvent.requestPermission, {'once': true});
  // feedback paramétrage cible
  document.querySelector('#diametre_cible').addEventListener('input',change_diametre);
  document.querySelector('#distance_vert').addEventListener('input',change_diametre);
  document.querySelector('#distance_orange').addEventListener('input',change_diametre);
  document.querySelector('#distance_rouge').addEventListener('input',change_diametre);
  change_diametre();
  // recentrer après masquage du clavier pour que tout le formulaire soit visible
  document.querySelectorAll('#infosuj input')
    .forEach(e => e.addEventListener('blur', 
      _ => document.querySelector('#infosuj').scrollIntoView()));
  // premier trial
  gonext();
};
/*
 * Erreur qui s'affiche sous le titre sans bloquer
 */
var visibleError = function(msg) {
  if (typeof(msg)!='string') {
    msg = JSON.stringify(msg);
  }
  if (!msg.match('La connexion Internet semble interrompue') && 
      !msg.match('error: TypeError: Load failed')) {
    var already_triggered = false;
    document.querySelectorAll('.error').forEach(p => {
      if (p.innerText == msg) {
        if (p.previousSibling && p.previousSibling.className == 'count') {
          var count = Number(p.previousSibling.innerText) + 1;
          p.previousSibling.innerText = count;
        } else {
          p.insertAdjacentHTML('beforebegin', '<span class="count">2</span>');
        }

      }
      already_triggered = already_triggered || (p.innerText == msg)
    });
    if (!already_triggered) {
      document.getElementById("title").insertAdjacentHTML('afterend', '<p><span class="error">' + msg + '</span></p>');
    }
  }
  /* Enregistrement de l'erreur dans cjt */
  var now = new Date();
  var info_version = (document.getElementById('version_info').innerText || 'unknown').replace(/^version: */,'');
  var cjt = getCjtStorage();
  if (!cjt.log) {
    cjt.log = [];
  }
  cjt.log.push({'error': msg, 'when': now, 'session' : currentSession, 'version': info_version });
  setCjtStorage(cjt);
};

/*
 * Version : affichage des informations
 */
var testeAdressSousTest = function(pathname, searchstring) {
    document.title = "Cible"; 
    /* icone en http pour cause de certificat autosigne non accepte */
    document.querySelector('link[rel="apple-touch-icon"]').href = 
      document.querySelector('link[rel="apple-touch-icon"]').href.replace('https:','http:');
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        // demander la version
        navigator.serviceWorker.controller.postMessage('version');
    } else {
        visibleError("Absence de contrôle du cache");
    }
};

/*
 * Tests infos codees dans l'adresse et le protocole
 */
var testeAdress = function() {
    var protocol=document.location.protocol;
    var pathname=document.location.host + document.location.pathname;
    var searchstring=document.location.search;
    if (protocol != 'https:') {
      visibleError('Protocole incompatible avec les Service workers : ' + protocol);
    }
    testeAdressSousTest(pathname, searchstring);
};

// Callback de déverrouillage du code participant 
var unlock_participant = function() {
  document.getElementById("code_participant").disabled = false;
  document.getElementById("last_participant").hidden = true;
};

// Callback pour le changement du code participant
var change_participant = function(e) {
  var cjt = getCjtStorage();
  var parcode = document.getElementById("code_participant");
  // Si on est conforme au gabarit, enregistrer pour le futur
  if (parcode.value.match(parcode.pattern)) {
    cjt.lastParticipant = parcode.value.toUpperCase();
    listeTests.forEach(x => x.participant = cjt.lastParticipant);
    setCjtStorage(cjt);
    parcode.className = "stored";
    document.getElementById("last_participant").innerText = cjt.lastParticipant;
    document.getElementById("last_participant").hidden = false;
    // restaurer les autres paramètres à partir de l'historique de ce participant
    restaure_depuis_historique(cjt);
    // Si ce n'est fait, activer les questionnaires suivants
    if (currentTest < 0) {
      commencer()
    } else {
      // Sinon fermer le clavier
      parcode.blur()
    }
  } else {
    // Si on a perdu le gabarit, voir s'il faut passer en mode texte
    parcode.className = ""
    if (parcode.value.match(/^[0-9]{3}/)) {
      parcode.inputMode = "text"
    } else {
      parcode.inputMode = "numeric"
    }
  }
};
// Reprendre (apres interruption prolongee)
var reprendre = function() {
  currentTest = currentTest - 1;
  document.getElementById("pausescreen").hidden = true;
  document.getElementById("cibles").hidden = false;
  document.getElementById("terminer").removeEventListener('click', endTest, {once: true, capture: true});
  gonext();
};

// Mettre en pause (si interruption prolongee)
var pause = function() {
  document.getElementById("reprendre").addEventListener('click', reprendre, {once: true, capture: true});
  document.getElementById("terminer").addEventListener('click', endTest, {once: true, capture: true});
  document.getElementById("cibles").hidden = true;
  document.getElementById("pausescreen").hidden = false;
};
// Si le participant quitte l'application, gérer la reprise
var onVisibilityChange = function(e) {
  var now = new Date();
  var cjt = getCjtStorage();
  if (document.visibilityState === 'hidden') {
    if (currentSession !== -1) {
      // Le participant a commencé à répondre, logger la pause
      if (!cjt.log) {
        cjt.log = [];
      }
      cjt.log.push({'pause': now, 'session' : currentSession});
    }
  } else {
    // VisibilityState != hidden : on reprend
    if (currentSession !== -1) {
       // Le participant a commencé à répondre, logger la reprise
      if (!cjt.log) {
        cjt.log = [];
      }
      cjt.log.push({'reprise': now, 'session' : currentSession});
      // focus sur la prochaine question
      if(listeTests[currentTest] && document.getElementById(listeTests[currentTest].question)) {
        q = document.getElementById(listeTests[currentTest].question);
        q.focus();
        q.scrollIntoView();
      } else if(listeTests[currentTest] && listeTests[currentTest].question.indexOf("cible") == 0) {
        pause();
      }

    }
  }
  // Enregistrer
  setCjtStorage(cjt);
}
// Mode debug
var enableDebug5sec = function() {
  // double clic sur version puis icone en moins de 5s
  document.querySelector('#title_icon').addEventListener('dblclick', toggleDebug);
  // si endscreen est toujours caché au bout de 5s, ignorer à nouveau le double clic
  setInterval(() => {
    document.querySelector('#endscreen').hidden && 
      document.querySelector('#title_icon').removeEventListener('dblclick', toggleDebug)
  }, 5000);
};
var toggleDebug = function() {
  if (document.querySelector('#endscreen').hidden) {
    // Passer en mode debug
    document.querySelector('#endscreen').hidden=false;
    document.querySelector('#infosuj').hidden=true;
    ajouteInfoFd();
    document.querySelector('#recap').hidden = (currentTest <= listeEtapes.indexOf('validation'))
    document.querySelector('#trialtable').hidden = (currentTest <= listeEtapes.indexOf('validation'))
    var cjt = getCjtStorage();
    document.querySelector('#cjtJSON').href = 'data:application/json;charset=utf-8,' + encodeURI(JSON.stringify(cjt) + '\n');
    // timestamp
    var now = new Date();
    var timestamp = now.toISOString().replaceAll(/[^0-9]/g,"").substring(2,14);
    document.querySelector('#cjtJSON').download = document.querySelector('#cjtJSON').download.replace(/^[^a-zA-Z]*/, timestamp + '_');
    document.querySelector('#allCSV').download = document.querySelector('#allCSV').download.replace(/^[^a-zA-Z]*/, timestamp + '_');
  } else {
    // Passer en mode normal et désactiver le toggle sur double clic
    document.querySelector('#title_icon').removeEventListener('dblclick', toggleDebug)
    document.querySelector('#endscreen').hidden=true;
    document.querySelector('#infosuj').hidden=false;
    document.querySelector('#cjtJSON').href = 'data:application/json;charset=utf-8,';
    document.querySelector('#allCSV').href = 'data:text/plain;charset=utf-8,%EF%BB%BF';
  }
}

// Réduire les diamètres au fil des sessions :
// sessions 1 à 5 : cibles grosses
// sessions 6 à 10 : cibles 10% plus petites
// sessions 11 à 15 : cibles 30% plus petites
// sessions 16 à 20 : cibles 50% plus petites
var ajuste_diametres_sessions = function(fdsp) {
  var reduc = { '6': 0.9, '11': 0.7/0.9, '16': 0.5/(0.7/0.9)};
  if (reduc[fdsp.get('session')])
  for (k of ['diametre_cible', 'distance_vert', 'distance_orange']) {
    fdsp.set(k, Math.round(reduc[fdsp.get('session')]*fdsp.get(k)));
  }
  return(fdsp);
};
// restaurer les paramètres à partir de l'historique
var restaure_depuis_historique = function(cjt) {
  var parcode = document.querySelector('#code_participant').value.toUpperCase();
  // dernière session n°1 pretest validée si on n'a pas le participant
  var fd = cjt.formdata
              .filter(e => e && e.match('validation=on') && e.match('session=1&') && e.match('pretest'))
              .reduce((a,b) => b, false);
  if (document.querySelector('#code_participant').validity.valid) {
    // ou dernière session validée du participant si on l'a
    fd = cjt.formdata
            .filter(e => e && e.match('validation=on') && e.match('code_participant=' + parcode))
            .reduce((a,b) => b, false) || fd;
  } 
  if(fd) {
    var fdsp = new URLSearchParams(fd);
    fdsp.delete('validation');
    fdsp.delete('prevent_submit');
    fdsp.delete('code_participant');
    // passer à la session ou au type de session suivant si même participant
    if (fd.match('code_participant=' + parcode)) {
      if (fdsp.get('type_session') == 'pretest') {
        fdsp.set('type_session','imagerie');
      } else if (fdsp.get('type_session') == 'imagerie') {
        fdsp.set('type_session','posttest');
      } else {
        fdsp.set('type_session','pretest');
        fdsp.set('session', Number(fdsp.get('session')) + 1);
        fdsp = ajuste_diametres_sessions(fdsp);
      }
    }
    for (var p of fdsp) {
      var e = document.querySelector('#' + p[0]) || document.querySelector('input[name="' + p[0] + '"][value="' + p[1] + '"]')
      if(e && ['textarea', 'text', 'number', 'hidden', 'select-one'].indexOf(e.type)>=0) {
        e.value = p[1];
      } else if (e && ['radio', 'checkbox'].indexOf(e.type)>=0) {
        e.checked = true;
      } 
    }
    change_diametre();
  }
};
// s'il n'y a pas de mise a jour, charger le test
var onCacheOK = function() {
  var cjt = getCjtStorage();
  // Indiquer l'heure de démarrage du journal et démarrer la session
  var now = new Date();
  cjt.sessions.push(document.location.href + '_' + now.toLocaleString());
  setCjtStorage(cjt);
  currentSession = cjt.sessions.length - 1;
  // Verifier s'il y a un participant enregistre
  var parcode = document.getElementById("code_participant");
  if (cjt.lastParticipant ) {
    parcode.value = cjt.lastParticipant;
    if (parcode.value.match(parcode.pattern)) {
      parcode.disabled = true;
      listeTests.forEach(x => x.participant = cjt.lastParticipant);
      document.getElementById("last_participant").innerText = cjt.lastParticipant;
      document.getElementById("last_participant").hidden = false;
      // permettre le reset sur simple clic du parent
      parcode.parentElement.addEventListener('click', unlock_participant);
      // restaurer les autres paramètres à partir de l'historique
      restaure_depuis_historique(cjt);
    } else {
      parcode.value=''
    }
  }
  // Si le participant quitte l'application, faire le ménage
  document.addEventListener("visibilitychange", onVisibilityChange);
  // Callback pour l'edition du code participant
  parcode.addEventListener('input', change_participant);
  // si le sous-test est specifie, adapter la liste des tests
  testeAdress();
  // debug sur double clic sur l'icone si double-clic sur version il y a moins de 5s
  document.querySelector('#version_info').addEventListener('dblclick', enableDebug5sec);
  // si le participant est renseigné et désactivé, commencer les questionnaires
  if (parcode.disabled) {
    testValide();
    commencer();
  } 
}
// log message from serviceWorker
var logMsg = function(evt) {
  console.log(evt);
  if (evt.data) {
    if (evt.data.indexOf('version:')==0) {
      document.getElementById("version_info").innerHTML = evt.data;
    } else {
      visibleError(evt.data);
    }
  } else if (evt.type == "controllerchange") {
    if (navigator.serviceWorker.controller) {
       // demander la version
      navigator.serviceWorker.controller.postMessage('version');
    } else {
      visibleError("Un changement de contrôleur est intervenu, mais le contrôleur n'est pas défini.");
    }
    // en cas de changement de contrôleur, s'il n'y a pas un test en cours, mieux vaut recharger la page
    if (currentTest <0) {
      document.getElementById("infosuj").hidden = true;
      endTest(evt);
    }   
  } else {
    visibleError("! ! ! ! ! "+ JSON.stringify(evt) + " ! ! ! ! !");
  }
};


// cette fonction (window.onload) s'exécute lorsque la page est chargée
window.onload = function() {
  // Mettre a jour l'adresse pour nextsuj
  document.getElementById("nextsuj").href = document.location.href;
  // gestion du cache
  if (("serviceWorker" in navigator) & (document.location.protocol === 'https:')) {
    navigator.serviceWorker.addEventListener('message', logMsg);
    navigator.serviceWorker.addEventListener('error', logMsg);
    navigator.serviceWorker.addEventListener('controllerchange', logMsg);
    // skip le cache HTTP du navigateur, c'est le sw qui gerera le cache
    navigator.serviceWorker.register('sw.js',{updateViaCache: 'none'}).then(onCacheOK);
  } else {
    if (document.location.protocol !== 'https:') {
      visibleError('Protocole incompatible avec les service Workers :' + document.location.protocol)
    }
    if (!("serviceWorker" in navigator)) {
      visibleError('Navigateur incompatible avec les service Workers');
    }
    visibleError("! ! ! ! ! Pas d'utilisation hors ligne possible ! ! ! ! !");
  }
};
