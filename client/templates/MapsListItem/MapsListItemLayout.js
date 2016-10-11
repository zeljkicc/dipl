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
'click .js-download-map-button':function(){
    //alert(this._id);

    var instance = this;
    var map = Maps.findOne({_id:this._id});


    var fileTransfer = new FileTransfer();


    cordova.plugin.pDialog.init({
        progressStyle : 'HORIZONTAL', 
        title: 'Please Wait...', 
        message : 'Downloading map...'});


    //za prikaz progresa download-a
    fileTransfer.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            //statusDom.innerHTML = perc + "% loaded...";
            cordova.plugin.pDialog.setProgress(perc);
            

        } else {//ako ne uspe da izracuna procente, prikazace ispord
            if(statusDom.innerHTML == "") {
                statusDom.innerHTML = "Loading";
                cordova.plugin.pDialog.setMessage("Loading");
            } else {
                //statusDom.innerHTML += ".";
                cordova.plugin.pDialog.setMessage("Loading . . .");
            }
        }
    };


//var uri = encodeURI("http://some.server.com/download.php");
//var uri = encodeURI("http://www.akademija.uns.ac.rs/wp-content/uploads/2012/03/slika2011.jpg");//map.uri
var uri = encodeURI("http://192.168.1.102/" + instance.city.toLowerCase() + ".db");


var destinationDirectory = null;
cordova.file.applicationStorageDirectory + "databases/"

 window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function(destinationDirectory) {
        console.log("got main dir",destinationDirectory);

        fileTransfer.download(
    uri,
    destinationDirectory.nativeURL + "databases/" + instance.city.toLowerCase() + ".db",
    function(entry) {
        console.log("download complete: " + entry.toURL());
        cordova.plugin.pDialog.setMessage("Download complete");


//dodavanje u sqlite bazu mapdata, da bi mogli da vidimo koje smo sve mape skinuli
        var db = dbMapdata;
db.transaction(function (txn) {

  txn.executeSql('CREATE TABLE IF NOT EXISTS data (city TEXT, state TEXT, size REAL, lat REAL, lng REAL);', [], function (tx, res) {
    console.log("Created database pocetak AAAAAAAAAa if not exist"); // {"answer": 42} 
  });

    txn.executeSql("INSERT INTO data VALUES (?, ?, ?, ?, ?);", [instance.city, instance.state, parseFloat(instance.size), instance.center.lat, instance.center.lng], function (tx, res) {
    console.log("Inserted values for new map Downloaded AAAA"); // {"answer": 42} ////RADILLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

    //preuzimanje objekata za preuzetu mapu
    Meteor.call('downloadPlaces', instance.city, function(error, result){
        //smestiti u SQLite
        if(Meteor.isCordova){  //////////

  //var db = sqlitePlugin.openDatabase('userdata.db');

    var db = dbUserdata;
    if(db==null){

        db = sqlitePlugin.openDatabase('userdata.db');
        dbUserdata = db;
    }

    var new_places = result;
            db.transaction(function (txn) {


                


 txn.executeSql('CREATE TABLE IF NOT EXISTS offlineplaces (name TEXT, description TEXT, type TEXT, lat TEXT, lng TEXT, userid TEXT, city TEXT, mid TEXT);', [], function (tx, res) {
    console.log("Created database offlineplaces if not exist"); // {"answer": 42} 
  });

 txn.executeSql("SELECT * FROM offlineplaces;", [], function (tx, res) {
    //console.log("Inserted values in SQLite for place " + new_places[i].name + " " + new_places[i].description + " " + new_places[i].loc.coordinates[0]  + " " + new_places[i].city); // {"answer": 42} 
    console.log("After download map - Procitalo iz baze offlineplaces pre svega\n\n: " + JSON.stringify(res.rows));
  });

for(var i=0; i < new_places.length; i++){
    var place = new_places[i];
    var lat = place.loc.coordinates[0];
    var lng = place.loc.coordinates[1];
  txn.executeSql("INSERT INTO offlineplaces VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [ place.name, place.description, place.type, lng, lat, place.user_id, place.city, place._id ], function (tx, res) {
    console.log("After download map - Inserted values in SQLite for place " + place.name + " " + place.description + " " + lng  + " " + place.city); // {"answer": 42} 
  });
  }

   txn.executeSql("SELECT * FROM offlineplaces;", [], function (tx, res) {
    //console.log("Inserted values in SQLite for place " + new_places[i].name + " " + new_places[i].description + " " + new_places[i].loc.coordinates[0]  + " " + new_places[i].city); // {"answer": 42} 
    console.log("After download map - Procitalo iz baze offlineplaces: " + JSON.stringify(res.rows));
  });

 

    });


    
        }

        //postaviti timestamp
        var nDate = new Date();
        localStorage.timestamp = nDate;
        Session.set("timestamp", nDate);


        //postaviti da je preuzeta nova mapa
        var newMap = new Object();
        newMap.city = instance.city;
        newMap.state = instance.state;
        newMap.size = parseFloat(instance.size);
        newMap.lat = instance.center.lat;
        newMap.lng = instance.center.lng;
        var array1 = Session.get('myMaps');
        array1.push(newMap);
        Session.set('myMaps', array1);



    });

  }); 


  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("After downlaod -> mapdata: " + JSON.stringify(res.rows)); // {"answer": 42} 
  });

});
///////////////////////////////end dodavanje u mapdata



/////////////pokusaj otvaranja skinute baze

    },
    function(error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("upload error code" + error.code);
    },
    true,
    {
    }
);






    });


},

'click .js-open-map-button': function(){

    //smestamo u sesiju koja mapa treba da se otvori
    Session.set("open-map", this.city);
    FlowRouter.go('home');
}
});