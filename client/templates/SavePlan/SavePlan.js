Template.SavePlanLayout.onCreated(function(){

});

Template.SavePlanLayout.onRendered(function(){
	$('.js-button-saveplan').on('click', function(event){
	event.preventDefault();
	//alert("hello");
	//var spots = polyline.getPlan();
	//alert(JSON.stringify(spots));
	var places = PlanPlaces.find().fetch();
	var name = $('.js-planname').val();
	var city = $('.js-plancity').val();
	var option = $("input[name='options']:checked").val();
	var user_id = Session.get('userdata')._id;
	var date_added = new Date();
	var creator_name = Session.get('userdata').firstname + " " + Session.get('userdata').lastname;
		if(navigator.onLine){
		Meteor.call('addPlan', [places, name, option, user_id, date_added, all_waypoints, creator_name, city], function(error, result){
			if(result){

				alert("Plan saved. " + result);
//perzistiranje u sqlite - offlineplans
if(Meteor.isCordova){
	
/*			var db = null;
  if(dbPlans == null){
//db2 = sqlitePlugin.openDatabase('mymaps.db');
		db = sqlitePlugin.openDatabase({name:'plans.db', location:'default'});
		dbPlans = db;

}
else{
db = dbPlans;
}


            db.transaction(function (txn) {
 txn.executeSql('CREATE TABLE IF NOT EXISTS offlineplans (mid TEXT, name TEXT, city TEXT, userid INTEGER, creatorname TEXT, places TEXT);', [], function (tx, res) {
    console.log("Created database offlineplans if not exist"); // {"answer": 42} 
  });

//for(var i=0; i < new_places.length; i++){
  txn.executeSql("INSERT INTO offlineplans VALUES (?, ?, ?, ?, ?, ?);", [result, name, city, user_id, creator_name, JSON.stringify(places)], function (tx, res) {
    console.log("Inserted values in SQLite (offlineplans) for plan " + name + " " + city + " " + creatorname + " " + JSON.stringify(places)); // {"answer": 42} 


  });

    txn.executeSql("SELECT * FROM offlineplans;", [], function (tx, res) {
    console.log("Offline plans first line in SQLite for plan " + res.rows.item(0).name + " " + res.rows.item(0).city + " " + res.rows.item(0).creatorname + " " + JSON.parse(res.rows.item(0).places) ); // {"answer": 42} 
  }, function(error){"Error " + error.message}); 



});*/



 writeToFile(result + '.json', {
 	_id : result,
 	places : places,
 	name : name,
 	option : option,
 	user_id : user_id,
 	date_aded : date_added,
 	all_waypoints : all_waypoints,
 	creator_name : creator_name,
 	city : city
 });


}




			}
			else{
				alert("Try again.");
			}
		});
	}
		else if(Meteor.isCordova){
			//perzistiranje JSON-a u fajlu u folderu pendingplans

      alert ("Perzistiranje u folderu pendingplans u fajlu " + name + ".json");
		writeToFile(name + '.json', {//////!!!!!!!!!!!!!!!!!!!!!!!!!
  places : places,
  name : name,
  option : option,
  user_id : user_id,
  date_aded : date_added,
  all_waypoints : all_waypoints,
  creator_name : creator_name,
  city : city
 });


  OfflinePlans.insert({
  		name: name,
  		city: city,
  		user_id: user_id,
  		creator_name: creator_name,
  		places: places
  });

 






		}


		
	});
});

Template.SavePlanLayout.helpers({
	places: function(){
		return PlanPlaces.find({}, {sort : {pos: 1}});
	}
});

Template.SavePlanLayout.events({

});



   var errorHandler = function (fileName, e) {  
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + fileName + '): ' + msg);
}

 
    function writeToFile(fileName, data) {
        data = JSON.stringify(data, null, '\t');
        var id = data._id;
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
        		console.log("Da li je Direktorijum 1" + directoryEntry);

        	directoryEntry.getDirectory("offlineplans", {create: true}, function(directoryEntry2){


        				directoryEntry2.getFile(fileName, { create: true }, function (fileEntry) {
            	console.log("Da li je Direktorijum 2" + fileEntry);
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        console.log('Write of file "' + fileName + '" completed.');


                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));




        	}, function(){console.log("Error while creating directory offlineplans");});	


            
        }, errorHandler.bind(null, fileName));
    }






   
