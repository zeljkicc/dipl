
//zezaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa oko timestampa
//ispravitiiiiiiiiiiiiii!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!






Template.MainLayout.onCreated(function(){
	var template = this;

	//alert(localStorage.timestamp);
	//localStorage.timestamp = "2016-09-24T17:24:54.579Z";
	Session.set('timestamp', localStorage.timestamp);
	//kod unutar autoruna (reaktivno izracunavanje) ce se izvrsiti ponovo, ako se promeni vrednost
	//reaktivnog izvora unutar to izracunavanja (u ovom slucaju sesije)
	this.autorun(function() {//dodajemo u SQLite sve objekte koji su dodati dok smo bili offline
		var new_places = null;
  template.subscribe('new-places', Session.get('timestamp'), function(){
		new_places = Places.find({timestamp:{$gt: new Date(localStorage.timestamp)}}).fetch();


		/*for(var i=0; i < new_places.length; i++){
			alert(new_places[i].name);
		}*/

		//dodamo u bazu new_places!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

if(Meteor.isCordova){  //////////

  //var db = sqlitePlugin.openDatabase('userdata.db');

  	var db = dbUserdata;
  	if(db==null){

  		db = sqlitePlugin.openDatabase('userdata.db');
  		dbUserdata = db;
  	}

            db.transaction(function (txn) {

            	


 txn.executeSql('CREATE TABLE IF NOT EXISTS offlineplaces (name TEXT, description TEXT, type TEXT, lat TEXT, lng TEXT, userid TEXT, city TEXT, mid TEXT);', [], function (tx, res) {
    console.log("Created database offlineplaces if not exist"); // {"answer": 42} 
  });

 txn.executeSql("SELECT * FROM offlineplaces;", [], function (tx, res) {
    //console.log("Inserted values in SQLite for place " + new_places[i].name + " " + new_places[i].description + " " + new_places[i].loc.coordinates[0]  + " " + new_places[i].city); // {"answer": 42} 
    console.log("Procitalo iz baze offlineplaces pre svega\n\n: " + JSON.stringify(res.rows));
  });

for(var i=0; i < new_places.length; i++){
	var place = new_places[i];
	var lat = place.loc.coordinates[0];
	var lng = place.loc.coordinates[1];
  txn.executeSql("INSERT INTO offlineplaces VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [ place.name, place.description, place.type, lng, lat, place.user_id, place.city, place._id ], function (tx, res) {
    console.log("Inserted values in SQLite for place " + place.name + " " + place.description + " " + lng  + " " + place.city); // {"answer": 42} 
  });
  }

   txn.executeSql("SELECT * FROM offlineplaces;", [], function (tx, res) {
    //console.log("Inserted values in SQLite for place " + new_places[i].name + " " + new_places[i].description + " " + new_places[i].loc.coordinates[0]  + " " + new_places[i].city); // {"answer": 42} 
    console.log("Procitalo iz baze offlineplaces: " + JSON.stringify(res.rows));
  });

 

	});


	
        }

localStorage.timestamp = new Date();





  });
  //ubacivanje u SQLite bazu new_places

});//////////proveravati kada je povezan sa Meteor serverom a ne samo online !!!!!!!!!!!!!!!!!!!!!!!!!!!1

	//localStorage.timestamp = new Date();


//ubacili smo sve objekte do trenutnog logovanja, postavimo vreme sinhronizacije
	/*var date = new Date();
			localStorage.timestamp = date;
			Session.set('timestamp', date); */



//osluskujemo na dalje da li dok smo online se doda novi objekat
     Places.find({timestamp:{$gt: new Date()}}).observe({
     	added: function(object) {
       // This code runs when a new object "object" was added to collection.
    

     		 //ubacivanje u SQLite bazu novog place-a!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


     		 if(Meteor.isCordova){  //////////

  	//var db = sqlitePlugin.openDatabase('userdata.db');
  	var db = dbUserdata;

            db.transaction(function (txn) {

 txn.executeSql('CREATE TABLE IF NOT EXISTS offlineplaces (name TEXT, description TEXT, type TEXT, lat TEXT, lng TEXT, userid TEXT, city TEXT, mid TEXT);', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  });

for(var i=0; i < new_places.length; i++){
  txn.executeSql("INSERT INTO offlineplaces VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [object.name, object.description, object.type, object.loc.coordinates[1], object.loc.coordinates[0], object.user_id, object.city, object._id], function (tx, res) {
    console.log("Inserted values in SQLite for place " + object.name + " " + object.description + " " + object.loc.coordinates[0]  + " " + object.city); // {"answer": 42} 
  });
  }

 

	});


	
        }


     		alert(object);

     		var date = new Date();
			localStorage.timestamp = date;
			Session.set('timestamp', date);
     	}
     });


	//this.subscribe('new-places', localStorage.timestamp);
//});




//
if(Meteor.isCordova){  //////////
if(navigator.connection.type != Connection.NONE){
  	//var db = sqlitePlugin.openDatabase('userdata.db');
  	var db = dbUserdata;

            db.transaction(function (txn) {

txn.executeSql("SELECT * FROM pendingplaces;", [], function (tx, res) {
    console.log("Pending places: " + JSON.stringify(res.rows._array) + " " + JSON.stringify(res.rows.length)); // {"answer": 42} 
Meteor.call('insertPlaces', res.rows._array, function(error, result){
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

});