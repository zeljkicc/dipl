import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


//Meteor.subscribe('near-places');



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

            Meteor.call('login', [username, password], 
              function(error, result){

                var user = result;
                if(user!=undefined){
              console.log("Login success. " + user.username);

              Session.set("userdata", user);
              

              //perzistiranje u sqlite bazi
if(Meteor.isCordova){
        var db = sqlitePlugin.openDatabase('userdata.db');
db.transaction(function (txn) {

  txn.executeSql('DROP TABLE IF EXISTS data;', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  }); 

  txn.executeSql('CREATE TABLE IF NOT EXISTS data (id TEXT,username TEXT, password TEXT, firstname TEXT, lastname TEXT, telephone TEXT);', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  });

  txn.executeSql("INSERT INTO data VALUES (?, ?, ?, ?, ?, ?);", [user._id, user.username, user.password, user.firstname, user.lastname, user.telephone], function (tx, res) {
    console.log("Inserted values"); // {"answer": 42} 
  });



  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("Userdata: " + JSON.stringify(res.rows)); // {"answer": 42} 
    var userdata = new Object();
     userdata._id = res.rows.item(0).id;
  userdata.username = res.rows.item(0).username;
  userdata.password = res.rows.item(0).password;
  userdata.firstname = res.rows.item(0).firstname;
  userdata.lastname = res.rows.item(0).lastname;
  userdata.telephone = res.rows.item(0).telephone;

  
  });





});

 }

FlowRouter.go('home');


            }
            else{
              console.log("Login failed.");
            } 


            });       

            

            

        },
        'click .js-register': function(event){
        	event.preventDefault();
        	console.log("Register submitted.");
        	FlowRouter.go('register');
        }
    });

Template.HomeLayout.onCreated(function(){
 //this.showRadius = new ReactiveVar(false);

 if(Session.get('radius')==undefined){
   Session.set('radius', 1);
 }
 if(Session.get('showRadius') == undefined){
  Session.set('showRadius', true);
 }
});


Template.HomeLayout.helpers({
  userdata: function(){
      return Session.get("userdata");
  },
  radius_val: function(){
      return Session.get('radius');
  },
  showRadius: function(){
      return Session.get('showRadius');
  }
});

Template.HomeLayout.events({
  'click .js-radius-switch-input':function(event){
    Session.set('showRadius', !Session.get('showRadius'));
  },
  'change .js-radius-slider':function(event){
    Session.set('radius', e.target.value);
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

          Meteor.call('insertPlace', [name, description, type, latlng, (Session.get('userdata'))._id]);

        
  },
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  }
});

Template.PlacesListLayout.onCreated(function(){


      this.subscribe('near-places', [Session.get('location'), Session.get('radius')]);

  });


Template.PlacesListLayout.helpers({
  'places': function(){  
        return Places.find(); 
        //FlowRouter.go('placedetails');    
  },
});

Template.PlacesListLayout.events({
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  }
});





Template.PlaceDetailsLayout.helpers({
  'place': function(){
    var id = FlowRouter.getParam('id');
    return Places.findOne({_id: id});
  }
});

Template.PlaceDetailsLayout.onCreated(function(){
  var id = FlowRouter.getParam('id');
  this.subscribe('place-details', id);
});

Template.PlaceDetailsLayout.events({
  'click .js-my-back-arrow': function(){
    FlowRouter.go('home');
  }
})


Template.MapsListLayout.onCreated(function(){  
  this.subscribe('maps');
});

Template.MapsListLayout.helpers({
  maps: function(){
    return Maps.find();
  } 

});

Template.MapsListLayout.events({
  'click .js-my-back-arrow': function(){
    FlowRouter.go("downloadedmaps");
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

Template.DownloadedMapsLayout.events({
 'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
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


Template.MapsListItemLayout.events({
'click .js-map-list-item': function(){
  if(Meteor.isCordova){

//za download fajla sa servera na uredjaj
    var fileTransfer = new FileTransfer();
var uri = encodeURI("http://some.server.com/download.php");

fileTransfer.download(
    uri,
    fileURL,
    function(entry) {
        console.log("download complete: " + entry.toURL());
    },
    function(error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
    },
    false,
    {
        headers: {
            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        }
    }
);


  }
}
});

Template.AddNewCommentLayout.events({
  'click .js-add-comment': function(event){
          event.preventDefault();

          var userdata = Session.get("userdata");

          var title = $(".js-title").val();
          var content = $(".js-content").val();
          var grade =  $('#rating').data('userrating');
          var place_id = FlowRouter.getParam('id');
          var user_id = userdata._id;
          var date = new Date();
          var author = userdata.firstname + " " + userdata.lastname;

          $(".js-title").val("");
          $(".js-content").val("");

          Meteor.call("insertComment", [title, content, grade, place_id, date, author, user_id]);
  },
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  }
})


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

Template.PlaceLayout.onCreated(function(){
  this.num_reviews = new ReactiveVar(0);
});


Template.PlaceLayout.helpers({

  num_reviews: function(id){
    var instance = Template.instance();
      Meteor.call('num_reviews', id, function(error, result){
        if(result!= null && result!= undefined)
          
        instance.num_reviews.set(result);
      });
      return Template.instance().num_reviews.get();
    //  
  },
  rating: function(id){
      Meteor.call('avg_rating', id, function(error, result){       
          return result;
      });
  }
})





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

Template.CommentsListLayout.onCreated(function(){
  var id = FlowRouter.getParam('id');
  this.subscribe('place-comments', id);
})


Template.CommentsListLayout.helpers({
  comments: function(){
   // var id = FlowRouter.getParam('id');
    return Comments.find({}, {sort: {date: -1}});
  }
}) 

Template.CommentsListItemLayout.helpers({
  show_date: function(date){
    var date = new Date(date);
    return date.getDate()  + ". " + (date.getMonth() + 1) + ". " + date.getFullYear() + ".";
  },
  grades: function(grade){
    var ret = [];

    for(var i =0; i<5; i++){
     // ret[i] = new Object();
      ret[i] = false;
    }
    for(var i = 0; i<grade; i++){
      ret[i]= true;
    }

    return ret;
  }
})




Template.MapLayout.events({
  'click .js-button-locate':function(e){
    e.preventDefault();

    //map.locate({setView: true, maxZoom: 16});

    map.panTo(Session.get('location'));
    //map.setZoom(16);

    //console.log(Session.get('location'));
  }
});



//za mape
var map;
var myMarker, newPlaceMarker;
var myCircle;
var markersPlaces = [];
var layerGroupMarkers = new L.LayerGroup();

 Template.MapLayout.onRendered(function(){
layerGroupMarkers = new L.LayerGroup();
  var template =  this;
  this.autorun(function() {
  template.subscribe('places-within-box', Session.get("map-bounds"), function(){
     //Set the reactive session as true to indicate that the data have been loaded
     layerGroupMarkers = new L.LayerGroup();
      setPlaces();
  });
});

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
var db1 = sqlitePlugin.openDatabase({name: 'krusevac.db'});
db1.readTransaction(function (txn) {
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

    myCircle = L.circle(e.latlng, radius).addTo(map);

     L.circle(e.latlng, 1*1000).addTo(map); //radius krug

   
    Session.set("location", e.latlng);
    Session.set('radius', 1);//1 km
  //  setPlaces();
}

function onLocationError(e) {
    alert(e.message);
}


function setPlaces(){
  
if(layerGroupMarkers!=null){ //ne uklanja layer !!!!!!!!!!!!!!!!!!!!!!!!!!!1
  layerGroupMarkers.clearLayers();
  map.removeLayer(layerGroupMarkers);
}
var loc = Session.get("location");
//postavljanje markera za places
var places = Places.find().fetch();
//ubaciti radius
//markersPlaces = null;

for (i = 0; i < places.length; i++) { //da se ubaci switch case??
  if(places[i].type == "hotel"){
    layerGroupMarkers.addLayer(L.marker(places[i].loc.coordinates.reverse(), {icon: hotelIcon, id: places[i]._id}).on('click', onClickMarker));
    
    
  }
  else if(places[i].type == "restaurant"){
    layerGroupMarkers.addLayer(L.marker(places[i].loc.coordinates.reverse(), {icon: restaurantIcon}).on('click', onClickMarker));
  }
  else{
    layerGroupMarkers.addLayer(L.marker(places[i].loc.coordinates.reverse()).on('click', onClickMarker));
  }
}


console.log(layerGroupMarkers);
map.addLayer(layerGroupMarkers);
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


//cordova plugin - offline, online
document.addEventListener("offline", onOffline, false);
document.addEventListener("online", onOnline, false);
 
function onOffline() {
    console.log("Went offline :(");
}

function onOnline() {
    console.log("Went online :)");
}