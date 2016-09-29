
Template.AddNewCommentLayout.events({
  'click .js-add-comment': function(event){
          event.preventDefault();

          var userdata = Session.get("userdata");

          var title = $(".js-title").val();
          var content = $(".js-content").val();
          var grade =  $('#rating').data('userrating');
          var place_id = FlowRouter.getParam('id');
          var user_id = userdata._id;
          var author = userdata.firstname + " " + userdata.lastname;

          $(".js-title").val("");
          $(".js-content").val("");

        //  Meteor.call("insertComment", [title, content, grade, place_id, author, user_id]);




          if(Meteor.isCordova){
          if(navigator.connection.type != Connection.NONE){//ako smo online samo saljemo na server

          Meteor.call("insertComment", [title, content, grade, place_id, author, user_id]);

        }else {

            //var db = sqlitePlugin.openDatabase('userdata.db');
             var db = dbUserdata;

            db.transaction(function (txn) {

 txn.executeSql('CREATE TABLE IF NOT EXISTS pendingcomments (title TEXT, content TEXT, grade INTEGER, placeid TEXT, author TEXT, userid TEXT);', [], function (tx, res) {
    console.log("Created database pendingcomments if not exist"); // {"answer": 42} 
  });

//for(var i=0; i < new_places.length; i++){
  txn.executeSql("INSERT INTO pendingcomments VALUES (?, ?, ?, ?, ?, ?);", [ title, content, grade, place_id, author, user_id], function (tx, res) {
    console.log("Inserted values in SQLite for comment " + title + " " + content + " " + grade ); // {"answer": 42} 
  });

  


});
        }



      }//end isCordova
      else{
 Meteor.call("insertComment", [title, content, grade, place_id, date, author, user_id]);
}
  },
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  }
});
