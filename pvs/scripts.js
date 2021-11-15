// Liste des tests (pages html sur le même modèle)
var listeTests = [
  // Test 1
  {"title":"Test 1 : longueur 1/12","topimg":"stim/longueur1.svg","goodimg":"stim/longueur1.svg","badimg":"stim/longueur1alt.svg","good":"bottomright","bad":"bottomleft","type":"longueur_50"},
  {"title":"Test 1 : longueur 2/12","topimg":"stim/longueur2.svg","goodimg":"stim/longueur2.svg","badimg":"stim/longueur2alt.svg","good":"bottomleft","bad":"bottomright","type":"longueur_50"},
  {"title":"Test 1 : longueur 3/12","topimg":"stim/longueur3.svg","goodimg":"stim/longueur3.svg","badimg":"stim/longueur3alt.svg","good":"bottomright","bad":"bottomleft","type":"longueur_35"},
  {"title":"Test 1 : longueur 4/12","topimg":"stim/longueur4.svg","goodimg":"stim/longueur4.svg","badimg":"stim/longueur4alt.svg","good":"bottomright","bad":"bottomleft","type":"longueur_35"},
  {"title":"Test 1 : longueur 5/12","topimg":"stim/longueur5.svg","goodimg":"stim/longueur5.svg","badimg":"stim/longueur5alt.svg","good":"bottomleft","bad":"bottomright","type":"longueur_20"},
  {"title":"Test 1 : longueur 6/12","topimg":"stim/longueur6.svg","goodimg":"stim/longueur6.svg","badimg":"stim/longueur6alt.svg","good":"bottomleft","bad":"bottomright","type":"longueur_20"},
  {"title":"Test 1 : longueur 7/12","topimg":"stim/longueur1.svg","goodimg":"stim/longueur1.svg","badimg":"stim/longueur1alt.svg","good":"bottomleft","bad":"bottomright","type":"longueur_50"},
  {"title":"Test 1 : longueur 8/12","topimg":"stim/longueur2.svg","goodimg":"stim/longueur2.svg","badimg":"stim/longueur2alt.svg","good":"bottomright","bad":"bottomleft","type":"longueur_50"},
  {"title":"Test 1 : longueur 9/12","topimg":"stim/longueur3.svg","goodimg":"stim/longueur3.svg","badimg":"stim/longueur3alt.svg","good":"bottomleft","bad":"bottomright","type":"longueur_35"},
  {"title":"Test 1 : longueur 10/12","topimg":"stim/longueur4.svg","goodimg":"stim/longueur4.svg","badimg":"stim/longueur4alt.svg","good":"bottomleft","bad":"bottomright","type":"longueur_35"},
  {"title":"Test 1 : longueur 11/12","topimg":"stim/longueur5.svg","goodimg":"stim/longueur5.svg","badimg":"stim/longueur5alt.svg","good":"bottomright","bad":"bottomleft","type":"longueur_20"},
  {"title":"Test 1 : longueur 12/12","topimg":"stim/longueur6.svg","goodimg":"stim/longueur6.svg","badimg":"stim/longueur6alt.svg","good":"bottomright","bad":"bottomleft","type":"longueur_20"},
  {"title":"Test 2 : taille 1/12","topimg":"stim/taille1.svg","goodimg":"stim/taille1.svg","badimg":"stim/taille1alt.svg","good":"bottomright","bad":"bottomleft","type":"taille_50"}, 
  {"title":"Test 2 : taille 2/12","topimg":"stim/taille2.svg","goodimg":"stim/taille2.svg","badimg":"stim/taille2alt.svg","good":"bottomleft","bad":"bottomright","type":"taille_50"}, 
  {"title":"Test 2 : taille 3/12","topimg":"stim/taille3.svg","goodimg":"stim/taille3.svg","badimg":"stim/taille3alt.svg","good":"bottomleft","bad":"bottomright","type":"taille_35"}, 
  {"title":"Test 2 : taille 4/12","topimg":"stim/taille4.svg","goodimg":"stim/taille4.svg","badimg":"stim/taille4alt.svg","good":"bottomright","bad":"bottomleft","type":"taille_35"}, 
  {"title":"Test 2 : taille 5/12","topimg":"stim/taille5.svg","goodimg":"stim/taille5.svg","badimg":"stim/taille5alt.svg","good":"bottomright","bad":"bottomleft","type":"taille_20"}, 
  {"title":"Test 2 : taille 6/12","topimg":"stim/taille6.svg","goodimg":"stim/taille6.svg","badimg":"stim/taille6alt.svg","good":"bottomleft","bad":"bottomright","type":"taille_20"}, 
  {"title":"Test 2 : taille 7/12","topimg":"stim/taille1.svg","goodimg":"stim/taille1.svg","badimg":"stim/taille1alt.svg","good":"bottomleft","bad":"bottomright","type":"taille_50"}, 
  {"title":"Test 2 : taille 8/12","topimg":"stim/taille2.svg","goodimg":"stim/taille2.svg","badimg":"stim/taille2alt.svg","good":"bottomright","bad":"bottomleft","type":"taille_50"}, 
  {"title":"Test 2 : taille 9/12","topimg":"stim/taille3.svg","goodimg":"stim/taille3.svg","badimg":"stim/taille3alt.svg","good":"bottomright","bad":"bottomleft","type":"taille_35"}, 
  {"title":"Test 2 : taille 10/12","topimg":"stim/taille4.svg","goodimg":"stim/taille4.svg","badimg":"stim/taille4alt.svg","good":"bottomleft","bad":"bottomright","type":"taille_35"}, 
  {"title":"Test 2 : taille 11/12","topimg":"stim/taille5.svg","goodimg":"stim/taille5.svg","badimg":"stim/taille5alt.svg","good":"bottomleft","bad":"bottomright","type":"taille_20"}, 
  {"title":"Test 2 : taille 12/12","topimg":"stim/taille6.svg","goodimg":"stim/taille6.svg","badimg":"stim/taille6alt.svg","good":"bottomright","bad":"bottomleft","type":"taille_20"},
  { "title": "Test 3 : angle 1/12", "topimg": "stim/angle.svg", "goodimg": "stim/angle.svg", "badimg": "stim/angle1alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"angle_7°"},
  { "title": "Test 3 : angle 2/12", "topimg": "stim/angle2alt.svg", "goodimg": "stim/angle2alt.svg", "badimg": "stim/angle.svg", "good":"bottomright", "bad":"bottomleft", "type":"angle_7°"},
  { "title": "Test 3 : angle 3/12", "topimg": "stim/angle.svg", "goodimg": "stim/angle.svg", "badimg": "stim/angle3alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"angle_4°"},
  { "title": "Test 3 : angle 4/12", "topimg": "stim/angle4alt.svg", "goodimg": "stim/angle4alt.svg", "badimg": "stim/angle.svg", "good":"bottomright", "bad":"bottomleft", "type":"angle_4°"},
  { "title": "Test 3 : angle 5/12", "topimg": "stim/angle5alt.svg", "goodimg": "stim/angle5alt.svg", "badimg": "stim/angle.svg", "good":"bottomleft", "bad":"bottomright", "type":"angle_2°"},
  { "title": "Test 3 : angle 6/12", "topimg": "stim/angle.svg", "goodimg": "stim/angle.svg", "badimg": "stim/angle6alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"angle_2°"},
  { "title": "Test 3 : angle 7/12", "topimg": "stim/angle1alt.svg", "goodimg": "stim/angle1alt.svg", "badimg": "stim/angle.svg", "good":"bottomright", "bad":"bottomleft", "type":"angle_7°"},
  { "title": "Test 3 : angle 8/12", "topimg": "stim/angle.svg", "goodimg": "stim/angle.svg", "badimg": "stim/angle2alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"angle_7°"},
  { "title": "Test 3 : angle 9/12", "topimg": "stim/angle3alt.svg", "goodimg": "stim/angle3alt.svg", "badimg": "stim/angle.svg", "good":"bottomright", "bad":"bottomleft", "type":"angle_4°"},
  { "title": "Test 3 : angle 10/12", "topimg": "stim/angle.svg", "goodimg": "stim/angle.svg", "badimg": "stim/angle4alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"angle_4°"},
  { "title": "Test 3 : angle 11/12", "topimg": "stim/angle.svg", "goodimg": "stim/angle.svg", "badimg": "stim/angle5alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"angle_2°"},
  { "title": "Test 3 : angle 12/12", "topimg": "stim/angle6alt.svg", "goodimg": "stim/angle6alt.svg", "badimg": "stim/angle.svg", "good":"bottomleft", "bad":"bottomright", "type":"angle_2°"},
  { "title": "Test 4 : milieu 1/12", "topimg": "stim/milieu.svg?i=1", "goodimg": "stim/milieu.svg?i=1", "badimg": "stim/milieu1alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"milieu_9"},
  { "title": "Test 4 : milieu 2/12", "topimg": "stim/milieu.svg?i=2", "goodimg": "stim/milieu.svg?i=2", "badimg": "stim/milieu2alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"milieu_9"},
  { "title": "Test 4 : milieu 3/12", "topimg": "stim/milieu.svg?i=3", "goodimg": "stim/milieu.svg?i=3", "badimg": "stim/milieu3alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"milieu_6"},
  { "title": "Test 4 : milieu 4/12", "topimg": "stim/milieu.svg?i=4", "goodimg": "stim/milieu.svg?i=4", "badimg": "stim/milieu4alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"milieu_6"},
  { "title": "Test 4 : milieu 5/12", "topimg": "stim/milieu.svg?i=5", "goodimg": "stim/milieu.svg?i=5", "badimg": "stim/milieu5alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"milieu_3"},
  { "title": "Test 4 : milieu 6/12", "topimg": "stim/milieu.svg?i=6", "goodimg": "stim/milieu.svg?i=6", "badimg": "stim/milieu6alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"milieu_3"},  
  { "title": "Test 4 : milieu 7/12", "topimg": "stim/milieu.svg?i=7", "goodimg": "stim/milieu.svg?i=7", "badimg": "stim/milieu1alt.svg?i=2", "good":"bottomright", "bad":"bottomleft", "type":"milieu_9"},
  { "title": "Test 4 : milieu 8/12", "topimg": "stim/milieu.svg?i=8", "goodimg": "stim/milieu.svg?i=8", "badimg": "stim/milieu2alt.svg?i=2", "good":"bottomleft", "bad":"bottomright", "type":"milieu_9"},
  { "title": "Test 4 : milieu 9/12", "topimg": "stim/milieu.svg?i=9", "goodimg": "stim/milieu.svg?i=9", "badimg": "stim/milieu3alt.svg?i=2", "good":"bottomright", "bad":"bottomleft", "type":"milieu_6"},
  { "title": "Test 4 : milieu 10/12", "topimg": "stim/milieu.svg?i=10", "goodimg": "stim/milieu.svg?i=10", "badimg": "stim/milieu4alt.svg?i=2", "good":"bottomright", "bad":"bottomleft", "type":"milieu_6"},
  { "title": "Test 4 : milieu 11/12", "topimg": "stim/milieu.svg?i=11", "goodimg": "stim/milieu.svg?i=11", "badimg": "stim/milieu5alt.svg?i=2", "good":"bottomleft", "bad":"bottomright", "type":"milieu_3"},
  { "title": "Test 4 : milieu 12/12", "topimg": "stim/milieu.svg?i=12", "goodimg": "stim/milieu.svg?i=12", "badimg": "stim/milieu6alt.svg?i=2", "good":"bottomleft", "bad":"bottomright", "type":"milieu_3"},
  { "title": "Test 5 : position relative 1/12", "topimg": "stim/posrel1.svg", "goodimg": "stim/posrel1.svg", "badimg": "stim/posrel1alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_miroir"},
  { "title": "Test 5 : position relative 2/12", "topimg": "stim/posrel2.svg", "goodimg": "stim/posrel2.svg", "badimg": "stim/posrel2alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_miroir"},
  { "title": "Test 5 : position relative 3/12", "topimg": "stim/posrel3.svg", "goodimg": "stim/posrel3.svg", "badimg": "stim/posrel3alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_10"},
  { "title": "Test 5 : position relative 4/12", "topimg": "stim/posrel4.svg", "goodimg": "stim/posrel4.svg", "badimg": "stim/posrel4alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_10"},
  { "title": "Test 5 : position relative 5/12", "topimg": "stim/posrel5.svg", "goodimg": "stim/posrel5.svg", "badimg": "stim/posrel5alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_7.5"},
  { "title": "Test 5 : position relative 6/12", "topimg": "stim/posrel6.svg", "goodimg": "stim/posrel6.svg", "badimg": "stim/posrel6alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_7.5"},
  { "title": "Test 5 : position relative 7/12", "topimg": "stim/posrel1.svg", "goodimg": "stim/posrel1.svg", "badimg": "stim/posrel1alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_miroir"},
  { "title": "Test 5 : position relative 8/12", "topimg": "stim/posrel2.svg", "goodimg": "stim/posrel2.svg", "badimg": "stim/posrel2alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_miroir"},
  { "title": "Test 5 : position relative 9/12", "topimg": "stim/posrel3.svg", "goodimg": "stim/posrel3.svg", "badimg": "stim/posrel3alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_10"},
  { "title": "Test 5 : position relative 10/12", "topimg": "stim/posrel4.svg", "goodimg": "stim/posrel4.svg", "badimg": "stim/posrel4alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_10"},
  { "title": "Test 5 : position relative 11/12", "topimg": "stim/posrel5.svg", "goodimg": "stim/posrel5.svg", "badimg": "stim/posrel5alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_7.5"},
  { "title": "Test 5 : position relative 12/12", "topimg": "stim/posrel6.svg", "goodimg": "stim/posrel6.svg", "badimg": "stim/posrel6alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_7.5"},
  { "title": "Test 6 : position relative 1/12", "topimg": "stim/posrel_3cm_1.svg", "goodimg": "stim/posrel_3cm_1.svg", "badimg": "stim/posrel_3cm_1alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_miroir"},
  { "title": "Test 6 : position relative 2/12", "topimg": "stim/posrel_3cm_2.svg", "goodimg": "stim/posrel_3cm_2.svg", "badimg": "stim/posrel_3cm_2alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_miroir"},
  { "title": "Test 6 : position relative 3/12", "topimg": "stim/posrel_3cm_3.svg", "goodimg": "stim/posrel_3cm_3.svg", "badimg": "stim/posrel_3cm_3alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_10"},
  { "title": "Test 6 : position relative 4/12", "topimg": "stim/posrel_3cm_4.svg", "goodimg": "stim/posrel_3cm_4.svg", "badimg": "stim/posrel_3cm_4alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_10"},
  { "title": "Test 6 : position relative 5/12", "topimg": "stim/posrel_3cm_5.svg", "goodimg": "stim/posrel_3cm_5.svg", "badimg": "stim/posrel_3cm_5alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_7.5"},
  { "title": "Test 6 : position relative 6/12", "topimg": "stim/posrel_3cm_6.svg", "goodimg": "stim/posrel_3cm_6.svg", "badimg": "stim/posrel_3cm_6alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_7.5"},
  { "title": "Test 6 : position relative 7/12", "topimg": "stim/posrel_3cm_1.svg", "goodimg": "stim/posrel_3cm_1.svg", "badimg": "stim/posrel_3cm_1alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_miroir"},
  { "title": "Test 6 : position relative 8/12", "topimg": "stim/posrel_3cm_2.svg", "goodimg": "stim/posrel_3cm_2.svg", "badimg": "stim/posrel_3cm_2alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_miroir"},
  { "title": "Test 6 : position relative 9/12", "topimg": "stim/posrel_3cm_3.svg", "goodimg": "stim/posrel_3cm_3.svg", "badimg": "stim/posrel_3cm_3alt.svg", "good":"bottomright", "bad":"bottomleft", "type":"position_10"},
  { "title": "Test 6 : position relative 10/12", "topimg": "stim/posrel_3cm_4.svg", "goodimg": "stim/posrel_3cm_4.svg", "badimg": "stim/posrel_3cm_4alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_10"},
  { "title": "Test 6 : position relative 11/12", "topimg": "stim/posrel_3cm_5.svg", "goodimg": "stim/posrel_3cm_5.svg", "badimg": "stim/posrel_3cm_5alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_7.5"},
  { "title": "Test 6 : position relative 12/12", "topimg": "stim/posrel_3cm_6.svg", "goodimg": "stim/posrel_3cm_6.svg", "badimg": "stim/posrel_3cm_6alt.svg", "good":"bottomleft", "bad":"bottomright", "type":"position_7.5"}
];

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
        listeTests[currentTest].response = (e.currentTarget.id == "gooditem");
        listeTests[currentTest].fin = new Date();
        listeTests[currentTest].RT = listeTests[currentTest].fin.getTime() - listeTests[currentTest].debut.getTime();
        // feedback puis lorsque l'animation sera finie passer au trial suivant
        if (e.currentTarget.id == "gooditem") {
          // score
          score = score + 1;
          document.getElementById("good").addEventListener('endEvent', gonext, {once: true, capture: true});document.getElementById("good").beginElement();
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
  document.getElementById("endscreen").hidden=false;
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
var gonext;
    gonext = function(e) {
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
      if (window.applicationCache && nload>0) {
        nload=1;
        checkAllLoaded();
      }
    }, 100);
  } else {
    // c'est fini
    endTest();
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
  // premier trial
  gonext();
  // renvoyer false pour eviter le rechargement de la page a la soumission du formulaire
  return(false); 
};

/*
 * Teste si un sous-test est demandé dans l'adresse
 */
var testeAdressSousTest = function(adress) {
    if (adress && (adress.indexOf("test=1")>0)) {
      listeTests = listeTests.filter(x => x.title.match(/Test 1/));
      document.title = "PVS1";
    } else if (adress && (adress.indexOf("test=2")>0)) {
      listeTests = listeTests.filter(x => x.title.match(/Test 2/));
      document.title = "PVS2";
    } else if (adress && (adress.indexOf("test=3")>0)) {
      listeTests = listeTests.filter(x => x.title.match(/Test 3/));
      document.title = "PVS3";
    } else if (adress && (adress.indexOf("test=4")>0)) {
      listeTests = listeTests.filter(x => x.title.match(/Test 4/));
      document.title = "PVS4";
    } else if (adress && (adress.indexOf("test=5")>0)) {
      listeTests = listeTests.filter(x => x.title.match(/Test 5/));
      document.title = "PVS5";
    } else if (adress && (adress.indexOf("test=6")>0)) {
      listeTests = listeTests.filter(x => x.title.match(/Test 6/));
      document.title = "PVS5_3cm_";
    } else {
      listeTests = listeTests.filter(x => x.title.match(/Test [1-5]/));
      document.title = "PVS";
    }
    document.getElementById("title").innerHTML = listeTests[0].title;
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
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      // demander la version
      navigator.serviceWorker.controller.postMessage('version');
  } else {
    document.getElementById("title").insertAdjacentText("afterend", "Absence de contrôle du cache\n");
  }
};
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


