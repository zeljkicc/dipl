Template.AddNewLayout.events({
  'click .js-add': function(event){
    event.preventDefault();
    console.log("Add new place submitted.");

          var name = $(".js-name").val();
          var description = $(".js-description").val();
          var type =  $(".js-type-select").val();
          var city = $(".js-city").val();

          var lat = Session.get("newPlaceMarkerLat");
          var lng = Session.get("newPlaceMarkerLng");

if(Meteor.isCordova){
          if(navigator.connection.type != Connection.NONE){//ako smo online samo saljemo na server

          Meteor.call('insertPlace', [name, description, type, {lat:lat, lng:lng}, (Session.get('userdata'))._id, city]);

        }else {
            //var db = sqlitePlugin.openDatabase('userdata.db');
            var db = dbUserdata;
            db.transaction(function (txn) {

  txn.executeSql('CREATE TABLE IF NOT EXISTS pendingplaces (name TEXT, description TEXT, type TEXT, lat TEXT, lng TEXT, user_id TEXT, city TEXT);', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  });

  txn.executeSql("INSERT INTO pendingplaces VALUES (?, ?, ?, ?, ?, ?, ?);", [name, description, type, lat, lng, (Session.get('userdata'))._id, city], function (tx, res) {
    console.log("Inserted values in SQLite for place " + name + " " + description + " " + lat + " " + lng + " " + city); // {"answer": 42} 
  });


});
        }



      }//end isCordova
      else{
Meteor.call('insertPlace', [name, description, type, {lat:lat, lng:lng}, (Session.get('userdata'))._id, city]);
}
        
  },
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  }
});



