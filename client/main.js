import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


/////////kada se startuje uredjaj, za inicijalizaciju koja zavisi od cordove
var db = null;
 
document.addEventListener('deviceready', function() {
  //db = window.sqlitePlugin.openDatabase({name: "krusevac.db", createFromLocation: 1});
   // db = window.sqlitePlugin.openDatabase({name: "krusevac.db", location: 'default'});

//window.plugins.sqlDB.remove("krusevac.mbtiles", 0, successDelete, errorDelete);

//location = 0; // It will copy the database in the default SQLite Database directory.
// This is the default location for database
  // window.plugins.sqlDB.copy("krusevac.mbtiles", 0, success, error);

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
}


copyDatabaseFile('krusevac.db').then(function () {
  // success! :)
   console.log("Success in copying database");
  db = sqlitePlugin.openDatabase({name: 'krusevac.db'});

   db.readTransaction(function (txn) {
        txn.executeSql('SELECT * FROM metadata', [], function (tx, res) {
          console.log('Successfully read from pre-populated DB:');
          console.log(JSON.stringify(res.rows.item(0)));
        });
      });

/*db.readTransaction(function (txn) {
        txn.executeSql("SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?;", [16, 36652, 23936], function (tx, res) {
          console.log('Successfully read from pre-populated DB:');
          console.log(JSON.stringify(res.rows.item.tile_data));
        });
      });*/

 

}).catch(function (err) {
  // error! :(
  console.log(err);
  console.log("Error in copying database");
});




/*copyDatabaseFile('downloadedmaps.db').then(function () {
  // success! :)
   console.log("Success in copying database downloadedmaps.db");

   var db1 = sqlitePlugin.openDatabase({name: 'downloadedmaps.db'});

   db1.readTransaction(function (txn) {
        txn.executeSql('SELECT * FROM metadata', [], function (tx, res) {
          //console.log('Successfully read from pre-populated DB:');
           console.log('Successfully read from pre-populated DB downloadedmaps.db:');
          console.log("Mapdata: " + JSON.stringify(res.rows));
          //return JSON.stringify(res.rows.item(0));
        });
      });





}).catch(function (err) {
  // error! :(
  console.log(err);
  console.log("Error in copying database downloadedmaps.db");
}); */


var db = sqlitePlugin.openDatabase('mymaps.db');
db.transaction(function (txn) {

  txn.executeSql('DROP TABLE IF EXISTS data;', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  });

  txn.executeSql('CREATE TABLE IF NOT EXISTS data (city TEXT, state TEXT, size INTEGER);', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  });

  txn.executeSql("INSERT INTO data VALUES ('Krusevac', 'Serbia', 13.5);", [], function (tx, res) {
    console.log("Inserted values"); // {"answer": 42} 
  });

   txn.executeSql("INSERT INTO data VALUES ('Nis', 'Serbia', 16.5);", [], function (tx, res) {
    console.log("Inserted values num 2"); // {"answer": 42} 
  });


  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("Mapdata: " + JSON.stringify(res.rows)); // {"answer": 42} 
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


/*
Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

*/


Template.LoginLayout.events({
        'click .js-login': function(event) {
            event.preventDefault();
            console.log("Login submitted.");

           var username = $(".js-username").val();
            var password = $(".js-password").val();

            var user = Users.findOne({
              "username": username,
              "password": password
            });

            if(user!=undefined){
              console.log("Login success. " + user.username);
              FlowRouter.go('placeslist');
            }
            else{
              console.log("Login failed.");
            } 

        },
        'click .js-register': function(event){
        	event.preventDefault();
        	console.log("Register submitted.");
        	FlowRouter.go('register');
        }
    });


Template.RegisterLayout.events({
        'click .back': function(event) {
            event.preventDefault();
            console.log("Back submitted.");
            FlowRouter.go('login');

        },
        'click .register': function(event){
        	event.preventDefault();
        	console.log("Register submitted.");
        	// FlowRouter.go('register');

          var username = $(".js-username").val();
          var password = $(".js-password").val();
          var firstname = $(".js-firstname").val();
          var lastname = $(".js-lastname").val();
          var telephone = $(".js-telephone").val();

          Users.insert({
            'username': username,
            'password': password,
            'firstname': firstname,
            'lastname': lastname,
            'telephone': telephone
          });

          FlowRouter.go('login');
        }
    });


Template.AddNewLayout.events({
  'click .js-add': function(event){
    event.preventDefault();
    console.log("Add new place submitted.");

          var name = $(".js-name").val();
          var description = $(".js-description").val();
          var type =  $(".js-type-select").val();

          var latlng = newPlaceMarker.getLatLng();

          Places.insert({
            'name': name,
            'description': description,
            'type':    type,
            'loc': {
                    'type':"Point",
                    'coordinates': [latlng.lng, latlng.lat] }
          });
  }
});

Template.PlacesListLayout.helpers({
  'places': function(){  
        return Places.find(); 
        //FlowRouter.go('placedetails');    
  }
});




Template.PlaceDetailsLayout.helpers({
  'place': function(){
    var id = FlowRouter.getParam('id');
    return Places.findOne({_id: id});
  }
});


Template.MapsListLayout.helpers({
  maps: function(){
    return Maps.find();
  } 

});

Template.DownloadedMapsLayout.onRendered(function(){
var db2 = sqlitePlugin.openDatabase('mymaps.db');
db2.transaction(function (txn) {

  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("Mapdata helper: " + JSON.stringify(res.rows._array)); // {"answer": 42}

Session.set('myMaps', res.rows._array);
    //return  res.rows._array;
  }); 


});



  });

Template.DownloadedMapsLayout.helpers({
 maps: function(){
  return Session.get('myMaps');

} 
});


Template.MapsListItemLayout.helpers({
  downloaded: function(city){
    var mymaps = Session.get('myMaps');
    for(var i =0; i<mymaps.length; i++){
      if(mymaps[i].city == city)
      return true;
    }
    return false;
  }
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








//potrebna inicijalizacija
/*$(document).ready(function() {
    // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
  $('.button-collapse').sideNav({
      menuWidth: screen.width*0.8, // Default is 240
     // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  ); */



Template.LoginLayout.onRendered(function(){

//deo jquery-mobile biblioteke, samo deo za touch evente importovan, da bi se 
//navigation-drawer otvarao/zatvarao priikom swipa
$("body").on("swiperight",function(){
    if(!$(".mdl-layout__drawer").hasClass("is-visible")) {
            $(".mdl-layout__drawer-button").click();                      
         }  
    });

$("body").on("swipeleft",function(){
            if($(".mdl-layout__drawer").hasClass("is-visible")) {
            $(".mdl-layout__drawer-button").click();   
            }                    
        
    });



}); 

//za mape
var map;
var myMarker, newPlaceMarker;
var myCircle;
 Template.MapLayout.onRendered(function(){

  L.Icon.Default.imagePath = '/images';
//za mapu

/*var southWest = L.latLng(43.5685895010909, 21.3165588762259),
    northEast = L.latLng(43.5885196684833, 21.344376078598),
    bounds1 = L.latLngBounds(southWest, northEast);*/



if(!Meteor.isCordova){ //ako nije cordova (za sada, trebalo bi ako je online)
map = L.map('map', {
    center: new L.LatLng(43.5780017910967, 21.3275634837577),
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


}
else{//ako je Cordova cita iz baze (za sada, trebalo bi ako je offline i izabere mapu)
var bounds1 = null;
db.readTransaction(function (txn) {
        txn.executeSql('SELECT bounds FROM metadata', [], function (tx, res) {
          var bounds = res.rows.item(0).split(",");

          var southWest = L.latLng(bounds[1], bounds[0]),
    northEast = L.latLng(bounds[3], bounds[2]);
    bounds1 = L.latLngBounds(southWest, northEast); 
        });
      });

map = L.map('map', {
    minZoom:14, //da se ubaci metadata u baza za minZoom
    maxZoom:18,
    maxNativeZoom:18,
    maxBounds: bounds1
  });  

 var layerInstance = new L.TileLayer.MBTiles('', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

         bounds : bounds1,
         minZoom : 14, //da se ubaci metadata u baza za minZoom
       maxZoom : 18,
                
    }, db);


 map.addLayer(layerInstance); 
 

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
});


//var h = $(window).height() - $(".mdl-layout__header").height();
//$("#map").height("300");

map.invalidateSize();

map.locate({setView: true, maxZoom: 16});

/*L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup(); */



 map.on('locationfound', onLocationFound);
 
 map.on('locationerror', onLocationError);

if(FlowRouter.getRouteName() == "addnew"){
   map.on('click', function(e){
    if(newPlaceMarker!=undefined){
      map.removeLayer(newPlaceMarker);
       }
      map.removeLayer(myMarker);
      map.removeLayer(myCircle);

   
      newPlaceMarker = new L.marker(e.latlng).addTo(map);
    });
 }


//postavljanje markera za places
var places = Places.find().fetch();


for (i = 0; i < places.length; i++) { //da se ubaci switch case??
  if(places[i].type == "hotel"){
    L.marker(places[i].loc.coordinates.reverse(), {icon: hotelIcon}).addTo(map);
  }
  else if(places[i].type == "restaurant"){
    L.marker(places[i].loc.coordinates.reverse(), {icon: restaurantIcon}).addTo(map);
  }
  else{
    L.marker(places[i].loc.coordinates.reverse()).addTo(map);
  }
}
   






}); 

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    myMarker = L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

        if(FlowRouter.getRouteName() == "addnew"){
          myMarker.dragging.enable();
        }

    myCircle = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}



Template.AddNewLayout.onRendered(function(){

});









//myMarker.getLatLng()


//za ikonice markera
var PlaceIcon = L.Icon.extend({
    options: {
      shadowUrl: 'images/marker-shadow.png',
      iconSize:     [32, 37], // size of the icon
      shadowSize:   [41, 41], // size of the shadow
      iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
      shadowAnchor: [13, 40]  // the same for the shadow
    }
});

var hotelIcon = new PlaceIcon({iconUrl: 'images/hotel_0star.png'}),
    restaurantIcon = new PlaceIcon({iconUrl: 'images/restaurant.png'});

