import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


//Meteor.subscribe('near-places');



/////////kada se startuje uredjaj, za inicijalizaciju koja zavisi od cordove
var db = null;

dbUserdata = null; 
dbMapdata = null;
dbPlans = null;






 
document.addEventListener('deviceready', function() {












if(dbUserdata==null){
//dbUserdata = sqlitePlugin.openDatabase('userdata.db');
dbUserdata = window.sqlitePlugin.openDatabase({name: "userdata.db", location: 'default'});
}




  function copyDatabaseFile(dbName) {
  var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
  var targetDirName = cordova.file.dataDirectory;
  return Promise.all([
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(sourceFileName, resolve, reject);
    }),
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(targetDirName, resolve, reject);
    })
  ]).then(function (files) {
    var sourceFile = files[0];
    var targetDir = files[1];
    return new Promise(function (resolve, reject) {
      targetDir.getFile(dbName, {}, resolve, reject);
    }).then(function () {
      console.log("file already copied");
    }).catch(function () {
      console.log("file doesn't exist, copying it");
      return new Promise(function (resolve, reject) {
        sourceFile.copyTo(targetDir, dbName, resolve, reject);
      }).then(function () {
        console.log("database file copied");
      });
    });
  });
};

/*  var db = sqlitePlugin.openDatabase({name: "krusevac.db", location: 'default', createFromLocation: 1});
  
  db.transaction(function(tx) {
    tx.executeSql('select quote(tile_data) as tile_data from tiles where zoom_level = ? and tile_column = ? and tile_row = ?;', [0,0,0], function(tx, rs) {
      console.log('Procitano iz baze :) : ' + JSON.stringify(rs.rows.item(0)));
    }, function(tx, error) {
      console.log('SELECT error: ' + error.message);
    });
  }); */


/*copyDatabaseFile('krusevac.db').then(function () {
  // success! :)
   console.log("Success in copying database");
  db = sqlitePlugin.openDatabase({name: 'krusevac.db'});

  Session.set("mapDB", db);

   db.readTransaction(function (txn) {
        txn.executeSql('SELECT * FROM metadata', [], function (tx, res) {
          console.log('Successfully read from pre-populated DB:');
          console.log(JSON.stringify(res.rows.item(0)));
        });
      });
 

}).catch(function (err) {
  // error! :(
  console.log(err);
  console.log("Error in copying database");
});

*/

//dbMapdata = sqlitePlugin.openDatabase('mymaps.db');
dbMapdata = sqlitePlugin.openDatabase({name: 'mymaps.db', location:'default'});

var db = dbMapdata;



db.transaction(function (txn) {



  /*txn.executeSql('DROP TABLE IF EXISTS data;', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  }); */

 txn.executeSql('CREATE TABLE IF NOT EXISTS data (city TEXT, state TEXT, size REAL, lat REAL, lng REAL);', [], function (tx, res) {
    console.log("Created database pocetak AAAAAAAAAa if not exist"); // {"answer": 42} 
  });

 /*  txn.executeSql("INSERT INTO data VALUES (?, ?, ?, ?, ?);", ["Krusevac", "Serbia", 13, 43.546515, 21.1512121], function (tx, res) {
    console.log("Inserted values for new map ////RADILOOOOOOOOOOOOOOOOOOOOoo"); // {"answer": 42} ////RADILLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
  }); */

  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("Provera, na startovanju telefona: Mapdata: " + JSON.stringify(res.rows.length)); // {"answer": 42} 
  }); 


});





function successcb(){
    console.log("Success in opening database");
   //db = window.sqlitePlugin.openDatabase({name: "krusevac.mbtiles"});
 }

 function errorcb(e){
    console.log("Failure in opening database " + JSON.stringify(e));
   //db = window.sqlitePlugin.openDatabase({name: "krusevac.mbtiles"});
 }

   function success(){
    console.log("Success in copying database");
   db = window.sqlitePlugin.openDatabase({name: "krusevac.mbtiles"});
 }

 function error(e){
    console.log("Failure in copying database " + JSON.stringify(e));   
 }


 function successDelete(){
    console.log("Success in deleting database");
  // db = window.sqlitePlugin.openDatabase({name: "krusevac.mbtiles", createFromLocation: 1, location:"default"});
 }

 function errorDelete(e){
    console.log("Failure in deleting database " + JSON.stringify(e));   
 }

});
////////////////////////////////////////////////////////////////////////////


//importovanje skripte sa delom jquery-mobile biblioteke
$.getScript( "jquery.mobile.custom.min.js", function( data, textStatus, jqxhr ) {
  console.log( data ); // Data returned
  console.log( textStatus ); // Success
  console.log( jqxhr.status ); // 200
  console.log( "Load was performed." );
});  






























/*Template.MapsListItemLayout.onRendered(function(){
var db2 = sqlitePlugin.openDatabase('mymaps.db');
db2.transaction(function (txn) {

  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("Mapdata helper: " + JSON.stringify(res.rows._array)); // {"answer": 42}

Session.set('myMaps', res.rows._array);
    //return  res.rows._array;
  }); 


});

}); */















//myMarker.getLatLng()





//cordova plugin - offline, online
document.addEventListener("offline", onOffline, false);
document.addEventListener("online", onOnline, false);
 
function onOffline() {
    console.log("Went offline :(");
}

function onOnline() {
    console.log("Went online :)");

    //brisanje svih offline planova iz Minimonga - da li je dobro mesto
    OfflinePlans.remove({});

//da li je dobro mesto
    Session.set('open-map', undefined);
   delete Session.keys.open-map;


//za pending review-e
    if(Meteor.isCordova){
if(navigator.connection.type != Connection.NONE){
  //  var db = sqlitePlugin.openDatabase('userdata.db');
   var db = dbUserdata;


      var db1 = null;
  if(dbPlans == null){
//db2 = sqlitePlugin.openDatabase('mymaps.db');
    db1 = sqlitePlugin.openDatabase({name:'plans.db', location:'default'});
    dbPlans = db1;

}
else{
db1 = dbPlans;
}

  db1.transaction(function (txn) {

                   txn.executeSql("SELECT * FROM offlineplans;", [], function (tx, res) {
    console.log("Na pocetku ctanje  : Offline plans first line in SQLite for plan " + res.rows.item(0).name + " " + res.rows.item(0).city + " " + res.rows.item(0).creatorname + " " + JSON.parse(res.rows.item(0).places)  + " waypoints: " + JSON.parse(res.rows.item(0).allwaypoints)); // {"answer": 42} 
  }, function(error){console.log("Error " + error.message);});

});
            db.transaction(function (txn) {





txn.executeSql("SELECT * FROM pendingplaces;", [], function (tx, res) {
    console.log("Pending places: " + JSON.stringify(res.rows.length) + " " + JSON.stringify(res.rows.length)); // {"answer": 42} 
var array = [];
for(var i = 0; i < res.rows.length; i++){
  array.push(res.rows.item(i));
}
Meteor.call('insertPlaces', array, function(error, result){
  console.log("Callback za insertPlaces " + result);
  if(result == true){//ako je oke ubaceno u bazu, brizemo iz sqlite
    db.transaction(function (txn) {
    txn.executeSql("DROP TABLE IF EXISTS pendingplaces;", [], function (tx, res) {
        console.log("Droped table pendingplaces: " + res);

    });   
  });




  }
});


  });

 

  });


  }
        }





///za pending komentare

        if(Meteor.isCordova){
if(navigator.connection.type != Connection.NONE){
  //  var db = sqlitePlugin.openDatabase('userdata.db');
   var db = dbUserdata;

            db.transaction(function (txn) {

txn.executeSql("SELECT * FROM pendingcomments;", [], function (tx, res) {
    console.log("Pending comments: " + JSON.stringify(res.rows.length) + " " + JSON.stringify(res.rows.length)); // {"answer": 42} 
var array = [];
for(var i = 0; i < res.rows.length; i++){
  array.push(res.rows.item(i));
}

Meteor.call('insertComments', array, function(error, result){
  console.log("Callback za insertComments " + result);
  if(result == true){//ako je oke ubaceno u bazu, brizemo iz sqlite
    db.transaction(function (txn) {
    txn.executeSql("DROP TABLE IF EXISTS pendingcomments;", [], function (tx, res) {
        console.log("Droped table pendingcomments: " + res);

    });   
  });




  }
});


  });


  

 

  });


  }
        }





Session.set('timestamp', Session.get('timestamp'));
















        
}



















////MapLayout
Template.MapLayout.events({
  'click .js-button-locate':function(e){
    e.preventDefault();

    //map.locate({setView: true, maxZoom: 16});
    
    //map.panTo(Session.get('location'));
    //map.setZoom(16, {animate:true});

     map.setView(Session.get('location'), 16, {animation: true});
 

    //console.log(Session.get('location'));
  }
});



//za mape
var map;
var myMarker, newPlaceMarker;
var myCircle;
var markersPlaces = [];
var layerGroupMarkers = new L.LayerGroup();

var _dep = new Deps.Dependency();
polyline = undefined;
control = undefined;
all_waypoints = undefined;
var start_point;
var end_point;

//za smestanje kreiranih markera, da bi kasnije mogli da promenimo popup
var dictionary = {};

 Template.MapLayout.onRendered(function(){

   L.Icon.Default.imagePath = '/images';
layerGroupMarkers = new L.LayerGroup();
  var template =  this;


  this.autorun(function(){
      _dep.depend();
        if(start_point){
        map.removeLayer(start_point);
        //polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
      }
      if(end_point){
        map.removeLayer(end_point);
      }

      if(FlowRouter.getRouteName() == "plandetails"){
            var id = FlowRouter.getParam("id");
            var plan;
            if(navigator.onLine)
            plan = Plans.findOne({_id: id});
        	else if(Meteor.isCordova){plan = OfflinePlans.findOne({_id: id});}
        	else alert("Offline. Please reconect.");

        if(map){
           //L.Routing.line({waypoints: plan.all_waypoints}).addTo(map);
           if(plan.all_waypoints){
           polyline = L.polyline(plan.all_waypoints, {color: 'red'}).addTo(map);
           map.fitBounds(polyline.getBounds());
         }

            if(plan.all_waypoints[0] && map)
            start_point = L.circle( plan.all_waypoints[0], 50, {color:'blue'} ).addTo(map);
          if(plan.all_waypoints[plan.all_waypoints.length-1] && map)
      end_point = L.circle( plan.all_waypoints[plan.all_waypoints.length-1], 50, {color:'red'} ).addTo(map);
        }

      }
      else{
      var places = PlanPlaces.find({}, {sort: {pos: 1}}).fetch();
      var latlngs = [];
      for(var i =0; i<places.length; i++){
        latlngs.push((places[i].loc.coordinates).reverse());
      }
      if(map){
        //map.locate({setView: true, maxZoom: 16});
        if(control){
        //map.removeControl(control);
        control.setWaypoints([]);
        if(polyline){
      map.removeLayer(polyline);
    }
      }
    

      if(navigator.onLine){
      control =  L.Routing.control({
            waypoints: latlngs,
            router: L.Routing.mapbox('pk.eyJ1IjoicGV0cmljODc4IiwiYSI6ImNpdHhkamRudDAwMzkyeXAxa3MyeTV5aWwifQ.EKdOGxKq8BzE_5IYtXLPBQ', 
            {        
            profile: 'mapbox/walking'
        }),
            show: false,
            createMarker: function() {}

          }).addTo(map);
    }
    else if(Meteor.isCordova){

       //all_waypoints = route.coordinates;

    if(map)
    polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);


    }
    else{
      alert("You are offline");
    }
   

if(latlngs[0] && map)
      start_point = L.circle( latlngs[0], 50, {color:'blue'} ).addTo(map);
if(latlngs[latlngs.length-1] && map)
      end_point = L.circle( latlngs[latlngs.length-1], 50, {color:'red'} ).addTo(map);



      control.on('routeselected', function(e) {
    var route = e.route;
    // Do something with the route here
    all_waypoints = route.coordinates;
  /*  if(polyline){
      map.removeLayer(polyline);
    } */
    if(map)
    polyline = L.polyline(route.coordinates, {color: 'red'}).addTo(map);
  });

    }

        } //end of else

        

    });


  








 
//za mapu

/*var southWest = L.latLng(43.5685895010909, 21.3165588762259),
    northEast = L.latLng(43.5885196684833, 21.344376078598),
    bounds1 = L.latLngBounds(southWest, northEast);*/



if(!Meteor.isCordova || navigator.onLine){ //ako nije cordova (za sada, trebalo bi ako je online)
  //uzimamo tilove sa osm servera, i objekte iz glavne mongo baze
  this.autorun(function() {
  template.subscribe('places-within-box', Session.get("map-bounds"), function(){
     //Set the reactive session as true to indicate that the data have been loaded
     layerGroupMarkers = new L.LayerGroup();
      setPlaces();
  });
});

map = L.map('map', {
    //center: new L.LatLng(43.5780017910967, 21.3275634837577),
    minZoom:0,
    maxZoom:18,
    maxNativeZoom:18
  }); 

var layerInstance = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    //bounds: bounds1, https://github.com/ghybs/Leaflet.TileLayer.Fallback/tree/leaflet-0.7 !!!!!!!
     minZoom:0,
    maxZoom:18,

}).addTo(map); 

map.locate({setView: true, maxZoom: 16});

 map.on('locationfound', onLocationFound);
 
 map.on('locationerror', onLocationError);

 if(FlowRouter.getRouteName() == "addnew"){
   map.on('click', function(e){
    if(newPlaceMarker!=undefined){
      map.removeLayer(newPlaceMarker);
       }
       if(myMarker)
      map.removeLayer(myMarker);
  //  if(myCircle)
    //  map.removeLayer(myCircle);

   
      newPlaceMarker = new L.marker(e.latlng).addTo(map);

var latlng = e.latlng;
      Session.set("newPlaceMarkerLat", latlng.lat);
      Session.set("newPlaceMarkerLng", latlng.lng);
    });
 }


}
else if(Meteor.isCordova){//ako je Cordova cita iz baze (za sada, trebalo bi ako je offline i izabere mapu)
var bounds1 = null;
var city = Session.get("open-map").toLowerCase();
//var db1 = sqlitePlugin.openDatabase({name: city + '.db'});
var db1 = sqlitePlugin.openDatabase({name: city + '.db', location: 'default', androidDatabaseImplementation: 2});
//var db1 = sqlitePlugin.openDatabase({name: "krusevac" + '.db', location: 'default', createFromLocation: 1, androidDatabaseImplementation: 2});
console.log("Otvaranje offline mape (baze): " + city);

/*db1.transaction(function (txn) {
        txn.executeSql('SELECT bounds FROM metadata', [], function (tx, res) {
          var bounds = res.rows.item(0).split(",");

          var southWest = L.latLng(bounds[1], bounds[0]),
    northEast = L.latLng(bounds[3], bounds[2]);
    bounds1 = L.latLngBounds(southWest, northEast); 

    map.setMaxBounds(bounds1);

    console.log("Citanje iz offline mape (baze): " + JSON.stringify(res.rows));
        });
      }); */

db1.transaction(function(txn) {//vraca granice offline mape (4 tacke u obliku stringa
                              //izmedju kojih su zarezi)
      txn.executeSql("select value from metadata where name = 'bounds';", 
        [], 
        function (tx, res) {
  
     var bounds = res.rows.item(0).value.split(",");

          var southWest = L.latLng(bounds[1], bounds[0]),
    northEast = L.latLng(bounds[3], bounds[2]);
    bounds1 = L.latLngBounds(southWest, northEast); 

    map.setMaxBounds(bounds1);

    console.log("Citanje iz offline mape (baze): " + JSON.stringify(res.rows));
      },
      function(error){
        console.log(error);
      });
    }); 

map = L.map('map', {
    minZoom:14, //da se ubaci metadata u baza za minZoom
    maxZoom:18,
    maxNativeZoom:18,
    maxBounds: bounds1
  });  

//db = sqlitePlugin.openDatabase({name: 'krusevac.db'});
 var layerInstance = new L.TileLayer.MBTiles('', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

        // bounds : bounds1,
         minZoom : 14, //da se ubaci metadata u baza za minZoom
       maxZoom : 18,
                
    }, db1);


 map.addLayer(layerInstance); 

 if(FlowRouter.getRouteName() == "addnew"){
   map.on('click', function(e){
    if(newPlaceMarker!=undefined){
      map.removeLayer(newPlaceMarker);
       }
       if(myMarker)
      map.removeLayer(myMarker);
    //if(myCircle)
      //map.removeLayer(myCircle);

   
      newPlaceMarker = new L.marker(e.latlng).addTo(map);

var latlng = e.latlng;
      Session.set("newPlaceMarkerLat", latlng.lat);
      Session.set("newPlaceMarkerLng", latlng.lng);
    });
 }

//centar Nisa
 //map.setView(new L.LatLng(43.320857, 21.895122), 16);
 //map.fitBounds(bounds1);

//postavljanje centra prikazane mape
  var db2 = null;
  if(dbMapdata == null){
//db2 = sqlitePlugin.openDatabase('mymaps.db');
db2 = sqlitePlugin.openDatabase({name:'mymaps.db', location:'default'});

}
else{
db2 = dbMapdata;
}
db2.transaction(function (txn) {

  txn.executeSql("SELECT * FROM data WHERE city = ?;", [Session.get("open-map")], function (tx, res) {
    console.log("Mapdata helper: " + JSON.stringify(res.rows.length)); // {"answer": 42}

map.setView(new L.LatLng(res.rows.item(0).lat, res.rows.item(0).lng), 16);

console.log("Postavljen view mape lat:" + res.rows.item(0).lat + ", lng: " + res.rows.item(0).lng);
    //return  res.rows._array;
  }); 


});





  //map.setView(new L.LatLng(43.320857, 21.895122), 16);


//ako smo offline i ako je kordova, unutar setPlaces ispitujemo isto i izaberemo izvor
//odakle ucitamo objekte
setPlaces();


}
//map.invalidateSize();

layerInstance.on('loading', function (event) {
    console.log("loading map");

  //funkcija cordovinog plugina
  if(window.cordova!=undefined){
  /*  cordova.plugin.pDialog.init({
    title : 'Loading',
    message : 'Please wait until map is loaded'
  }); */
  } 

});


layerInstance.on('load', function (event) {
    console.log("loading map finished");
    if(window.cordova!=undefined){
  //  cordova.plugin.pDialog.dismiss();//puca!!!!!
  }
  //var instance = Template.instance();
  if(template.data.firsttime == true){
    _dep.changed();
    template.data.firsttime =false;
  } 
});






//postavljen listener za pomeranje mape
 map.on('moveend', function() { 
     console.log(map.getBounds());


     var bounds = map.getBounds()
     ,boundObject = { 
        southWest: [bounds._southWest.lat, bounds._southWest.lng],
        northEast: [bounds._northEast.lat, bounds._northEast.lng] 
      };

     Session.set("map-bounds", boundObject);
});
 






//var h = $(window).height() - $(".mdl-layout__header").height();
//$("#map").height("300");

map.invalidateSize();

if(navigator.onLine){
//map.locate({setView: true, maxZoom: 16});
}


if(Meteor.isCordova){
//za geolokaciju - cordovin geo plugin
var watchId = navigator.geolocation.watchPosition(geolocationSuccess,
                                                  geolocationError,
                                                  { timeout: 30000, enableHighAccuracy: true
                                                   });
 Session.set("watchId", watchId);
}

    // onSuccess Callback 
    //   This method accepts a `Position` object, which contains 
    //   the current GPS coordinates 
    // 
    function geolocationSuccess(position) {
      //  var element = document.getElementById('geolocation');
     /*   console.log( 'Latitude: '  + position.coords.latitude +
                            ' Longitude: ' + position.coords.longitude); */
if(map){
if(Session.get('viewSet')!= true){
if(navigator.onLine && Session.get('open-map')){
  //map.setView([position.coords.latitude, position.coords.longitude], 16);
    

    dbMapdata.transaction(function (txn) {

  txn.executeSql("SELECT * FROM data WHERE city = ?;", [Session.get("open-map")], function (tx, res) {
    console.log("Mapdata helper: " + JSON.stringify(res.rows.length)); // {"answer": 42}

map.setView(new L.LatLng(res.rows.item(0).lat, res.rows.item(0).lng), 16);

console.log("Postavljen view mape lat:" + res.rows.item(0).lat + ", lng: " + res.rows.item(0).lng);
    //return  res.rows._array;

    Session.set('viewSet', true);

  }); 


});

}
else if(navigator.onLine){
    map.setView([position.coords.latitude, position.coords.longitude], 16);
    Session.set('viewSet', true);
  }
}
         if(myMarker)
      map.removeLayer(myMarker);


    myMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map)
        .bindPopup("Your location");

//proveriti
        if(FlowRouter.getRouteName() == "addnew"){
          myMarker.dragging.enable();
        }

    //myCircle = L.circle(e.latlng, radius).addTo(map);

     //L.circle(e.latlng, 1*1000).addTo(map); //radius krug

   
    Session.set("location", [position.coords.latitude, position.coords.longitude]);
      }
    }
 
    // onError Callback receives a PositionError object 
    // 
    function geolocationError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }






/*L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup(); */



 //map.on('locationfound', onLocationFound);
 
 //map.on('locationerror', onLocationError);






   






}); 



  function onClickMarker(e){
      FlowRouter.go("/placedetails/" + e.target.options.id);
 }

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    myMarker = L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

        if(FlowRouter.getRouteName() == "addnew"){
          myMarker.dragging.enable();
        }

   // myCircle = L.circle(e.latlng, radius).addTo(map);

   //  L.circle(e.latlng, 1*1000).addTo(map); //radius krug

   
    Session.set("location", e.latlng);
    Session.set('radius', 1);//1 km
  //  setPlaces();
}

function onLocationError(e) {
    alert(e.message);
}


function setPlaces(){
  

var loc = Session.get("location");

//postavljanje markera za places
if(navigator.onLine){
var places = Places.find().fetch();

setMarkersMongo(places);
}
else if(Meteor.isCordova){


//citamo objekte iz baze, posto smo offline da bi prikazali za odgovarajucu mapu
      var db = dbUserdata;

            db.transaction(function (txn) {
OfflinePlaces.remove({});
//za offline places
txn.executeSql("SELECT * FROM offlineplaces WHERE city = ?;", [Session.get('open-map')], function (tx, res) {
    console.log("Offline places for " + Session.get('open-map') + " :" + JSON.stringify(res.rows.length) + " " + JSON.stringify(res.rows.length)); // {"answer": 42} 

var array = [];
//OfflinePlaces.remove({});
for(var i = 0; i< res.rows.length; i++){
  array.push(res.rows.item(i));
 // array[i]._id = res.rows.item(i)._id;

 OfflinePlaces.insert(res.rows.item(i));
}
      setMarkersSQLite(array);



  });


//za pending places
txn.executeSql("SELECT * FROM pendingplaces WHERE city = ?;", [Session.get('open-map')], function (tx, res) {
    console.log("Pending places for " + Session.get('open-map') + " :" + JSON.stringify(res.rows.length) + " " + JSON.stringify(res.rows.length)); // {"answer": 42} 

var array = [];
//OfflinePlaces.remove({});
for(var i = 0; i< res.rows.length; i++){
  array.push(res.rows.item(i));
 // array[i]._id = res.rows.item(i)._id;

 OfflinePlaces.insert(res.rows.item(i));
}
      setMarkersSQLite(array);



  });

 

  });

}
//ubaciti radius
//markersPlaces = null;


}


function setMarkersMongo(places){
  
/*if(layerGroupMarkers!=null){ //ne uklanja layer !!!!!!!!!!!!!!!!!!!!!!!!!!!1
      layerGroupMarkers.clearLayers();
      map.removeLayer(layerGroupMarkers);
    }*/

    for (i = 0; i < places.length; i++) { //da se ubaci switch case??

  //if(places[i].type == "hotel"){
    //layerGroupMarkers.addLayer(L.marker(places[i].loc.coordinates.reverse(), {icon: hotelIcon, id: places[i]._id}).on('click', onClickMarker));
   var marker = L.marker(places[i].loc.coordinates.reverse(), {icon: hotelIcon, id: places[i]._id});

   switch(places[i].type){
    case "hotel":
      marker.setIcon(hotelIcon);
      break;
    case "restaurant":
      marker.setIcon(restaurantIcon);
      break;
        case "amphitheater":
      marker.setIcon(amphitheaterIcon);
      break;
        case "museum":
      marker.setIcon(museumIcon);
      break;
        case "fortress":
      marker.setIcon(tvrdjavaIcon);
      break;
        case "library":
      marker.setIcon(libraryIcon);
      break;
        case "cinema":
      marker.setIcon(cinemaIcon);
      break;
        case "fountain":
      marker.setIcon(fountainIcon);
      break;
        case "gallery":
      marker.setIcon(galleryIcon);
      break;
        case "music":
      marker.setIcon(musicIcon);
      break;
        case "planetarium":
      marker.setIcon(planetariumIcon);
      break;
        case "monument":
      marker.setIcon(monumentIcon);
      break;
        case "church":
      marker.setIcon(churchIcon);
      break;
        case "theater":
      marker.setIcon(theaterIcon);
      break;   
        
    }

   map.addLayer(marker);
   
     
     dictionary[places[i]._id] = marker;
     if(PlanPlaces.findOne({_id:places[i]._id}) == undefined){

      var marker = marker.bindPopup('<h4>' + places[i].name + '</h4>' +
    '<div><a href="/placedetails/'+ places[i]._id + '"><button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" ><i class="material-icons" >remove_red_eye</i></button></a> ' +
    '<button id="add_' + places[i]._id + '" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored trigger" ><i class="material-icons">add</i></button>   </div>');

     $('#map').on('click', '#add_' + places[i]._id, function(e) {      

        var place = Places.findOne({_id: ($(this).attr('id')).substr(4)});
        //alert(place.name);
        console.log("Dodato u rutu " + place.name);

        place.pos = PlanPlaces.find().count() + 1;
        PlanPlaces.insert(place);
        setPlaces();
        _dep.changed();
      
      });



    }//end if ako je place dodat u PlanPlaces
    else{
       var marker = marker.bindPopup('<h4>' + places[i].name + '</h4>' +
    '<div><a href="/placedetails/'+ places[i]._id + '"><button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" ><i class="material-icons" >remove_red_eye</i></button></a> ' +
    '<button id="remove_' + places[i]._id + '" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored trigger" ><i class="material-icons">remove</i></button>   </div>');

      $('#map').on('click', '#remove_' + places[i]._id, function(e) {      

        var place1 = PlanPlaces.findOne({_id: ($(this).attr('id')).substr(7)});
        //alert(place.name);
        console.log("Izbaceno iz rute " + place1.name);

        for(var i = place1.pos; i < PlanPlaces.find().count() + 1; i++){
          PlanPlaces.find({pos: i + 1}).fetch().pos = i;
        }
        //place.pos = PlanPlaces.find().count() + 1;
        PlanPlaces.remove(place1);
         setPlaces();
         _dep.changed();

     
      });

    }

}

}






/*function setMarkersSQLite(places){



    for (i = 0; i < places.length; i++) { //da se ubaci switch case??
      var place = places[i]
      var place_id = OfflinePlaces.findOne({mid: place.mid})._id;

      var marker = L.marker([place.lat, place.lng], {icon: hotelIcon, id: place_id});


      dictionary[place_id] = marker;
 
     if(PlanPlaces.findOne({_id:place_id}) == undefined && PlanPlaces.findOne({name:place.name}) == undefined){

      var marker = marker.bindPopup('<h4>' + place.name + '</h4>' +
    '<div><a href="/placedetails/'+ place_id + '"><button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" ><i class="material-icons" >remove_red_eye</i></button></a> ' +
    '<button id="add_' + place_id + '" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored trigger" ><i class="material-icons">add</i></button>   </div>');

     $('#map').on('click', '#add_' + place_id, function(e) {      

       // var place = Places.findOne({_id: ($(this).attr('id')).substr(4)});
        //alert(place.name);
        console.log("Dodato u rutu " + place.name);

        place.pos = PlanPlaces.find().count() + 1;
        PlanPlaces.insert(place);
        setPlaces();
        _dep.changed();
      
      });



    }//end if ako je place dodat u PlanPlaces
    else{
       var marker = marker.bindPopup('<h4>' + place.name + '</h4>' +
    '<div><a href="/placedetails/'+ place_id + '"><button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" ><i class="material-icons" >remove_red_eye</i></button></a> ' +
    '<button id="remove_' + place_id + '" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored trigger" ><i class="material-icons">remove</i></button>   </div>');

      $('#map').on('click', '#remove_' + place_id, function(e) {      

        var place1 = PlanPlaces.findOne({_id: ($(this).attr('id')).substr(7)});
        //alert(place.name);
        console.log("Izbaceno iz rute " + place1.name);

        for(var i = place1.pos; i < PlanPlaces.find().count() + 1; i++){
          PlanPlaces.find({pos: i + 1}).fetch().pos = i;
        }
        //place.pos = PlanPlaces.find().count() + 1;
        PlanPlaces.remove(place1);
         setPlaces();
         _dep.changed();

     
      });

    }


    layerGroupMarkers.addLayer(marker);

      switch(place.type){
    case "hotel":
      marker.setIcon(hotelIcon);
      break;
    case "restaurant":
      marker.setIcon(restaurantIcon);
      break;
        case "amphitheater":
      marker.setIcon(amphitheaterIcon);
      break;
        case "museum":
      marker.setIcon(museumIcon);
      break;
        case "fortress":
      marker.setIcon(tvrdjavaIcon);
      break;
        case "library":
      marker.setIcon(libraryIcon);
      break;
        case "cinema":
      marker.setIcon(cinemaIcon);
      break;
        case "fountain":
      marker.setIcon(fountainIcon);
      break;
        case "gallery":
      marker.setIcon(galleryIcon);
      break;
        case "music":
      marker.setIcon(musicIcon);
      break;
        case "planetarium":
      marker.setIcon(planetariumIcon);
      break;
        case "monument":
      marker.setIcon(monumentIcon);
      break;
        case "church":
      marker.setIcon(churchIcon);
      break;
        case "theater":
      marker.setIcon(theaterIcon);
      break;   
        
    }
    
  
}


console.log(layerGroupMarkers);
map.addLayer(layerGroupMarkers);



} */




function setMarkersSQLite(places){
/*if(layerGroupMarkers!=null){ //ne uklanja layer !!!!!!!!!!!!!!!!!!!!!!!!!!!1
      layerGroupMarkers.clearLayers();
      map.removeLayer(layerGroupMarkers);
    }*/


    for (i = 0; i < places.length; i++) { //da se ubaci switch case??
      var place = places[i]
      var place_id = OfflinePlaces.findOne({mid: place.mid})._id;

      var marker = L.marker([place.lat, place.lng], {icon: hotelIcon, id: place_id}).on('click', onClickMarker)

    layerGroupMarkers.addLayer(marker);

      switch(place.type){
    case "hotel":
      marker.setIcon(hotelIcon);
      break;
    case "restaurant":
      marker.setIcon(restaurantIcon);
      break;
        case "amphitheater":
      marker.setIcon(amphitheaterIcon);
      break;
        case "museum":
      marker.setIcon(museumIcon);
      break;
        case "fortress":
      marker.setIcon(tvrdjavaIcon);
      break;
        case "library":
      marker.setIcon(libraryIcon);
      break;
        case "cinema":
      marker.setIcon(cinemaIcon);
      break;
        case "fountain":
      marker.setIcon(fountainIcon);
      break;
        case "gallery":
      marker.setIcon(galleryIcon);
      break;
        case "music":
      marker.setIcon(musicIcon);
      break;
        case "planetarium":
      marker.setIcon(planetariumIcon);
      break;
        case "monument":
      marker.setIcon(monumentIcon);
      break;
        case "church":
      marker.setIcon(churchIcon);
      break;
        case "theater":
      marker.setIcon(theaterIcon);
      break;   
        
    }
  }

  
console.log(layerGroupMarkers);
map.addLayer(layerGroupMarkers);
}



//za ikonice markera
var PlaceIcon = L.Icon.extend({
    options: {
      shadowUrl: '/images/marker-shadow.png',
      iconSize:     [32, 37], // size of the icon
      shadowSize:   [41, 41], // size of the shadow
      iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
      shadowAnchor: [13, 40]  // the same for the shadow
    }
});

var hotelIcon = new PlaceIcon({iconUrl: '/images/hotel_0star.png'}),
    restaurantIcon = new PlaceIcon({iconUrl: '/images/restaurant.png'}),
    amphitheaterIcon = new PlaceIcon({iconUrl: '/images/amphitheater-2.png'}),
    museumIcon = new PlaceIcon({iconUrl: '/images/art-museum-2.png'}),
    tvrdjavaIcon = new PlaceIcon({iconUrl: '/images/tvrdjava.png'}),
    libraryIcon = new PlaceIcon({iconUrl: '/images/book.png'}),
    cinemaIcon = new PlaceIcon({iconUrl: '/images/cinema.png'}),
    fountainIcon = new PlaceIcon({iconUrl: '/images/fountain-2.png'}),
    galleryIcon = new PlaceIcon({iconUrl: '/images/museum-paintings.png'}),
    musicIcon = new PlaceIcon({iconUrl: '/images/music_live.png'}),
    planetariumIcon = new PlaceIcon({iconUrl: '/images/planetarium-2.png'}),
    monumentIcon = new PlaceIcon({iconUrl: '/images/statue-2.png'}),
    churchIcon = new PlaceIcon({iconUrl: '/images/church.png'}),
    theaterIcon = new PlaceIcon({iconUrl: '/images/theater.png'});


    Template.MapLayout.onDestroyed(function(){
        navigator.geolocation.clearWatch(Session.get("watchID"));
        Session.set('viewSet', false);

      //  Session.set('open-map', undefined);
      //  delete Session.keys.open-map;
    });


    Template.MapLayout.onCreated(function(){
         this.data.firsttime = true;
    });

