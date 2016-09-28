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
            

        } else {
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
var uri = encodeURI("http://192.168.1.100/" + instance.city.toLowerCase() + ".db");

var destinationDirectory = null;

 window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(destinationDirectory) {
        console.log("got main dir",destinationDirectory);

        fileTransfer.download(
    uri,
    destinationDirectory.nativeURL + instance.city.toLowerCase() + ".db",
    function(entry) {
        console.log("download complete: " + entry.toURL());
        cordova.plugin.pDialog.setMessage("Download complete");


//dodavanje u sqlite bazu mapdata, da bi mogli da vidimo koje smo sve mape skinuli
        var db = dbMapdata;
db.transaction(function (txn) {

  txn.executeSql('CREATE TABLE IF NOT EXISTS data (city TEXT, state TEXT, size INTEGER);', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  });

   txn.executeSql("INSERT INTO data VALUES (?, ?, ?);", [instance.city, instance.state, instance.size], function (tx, res) {
    console.log("Inserted values for new map " + instance.city); // {"answer": 42} 
  });


  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("After downlaod -> mapdata: " + JSON.stringify(res.rows)); // {"answer": 42} 
  });

});
///////////////////////////////end dodavanje u mapdata


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