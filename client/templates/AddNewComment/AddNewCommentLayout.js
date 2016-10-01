
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

          var sqlite_tmp_id = FlowRouter.getParam('id');

          var place = OfflinePlaces.findOne({_id : sqlite_tmp_id});



            //var db = sqlitePlugin.openDatabase('userdata.db');
             var db = dbUserdata;

             var date = new Date();
             var date_string = date.toISOString();

             console.log(date_string);

            db.transaction(function (txn) {

  /*txn.executeSql('DROP TABLE IF EXISTS pendingcomments;', [], function (tx, res) {
    console.log("Droped database pendingcomments if not exist"); // {"answer": 42} 
  });            */ 

 txn.executeSql('CREATE TABLE IF NOT EXISTS pendingcomments (title TEXT, content TEXT, grade INTEGER, placeid TEXT, author TEXT, userid TEXT, date TEXT);', [], function (tx, res) {
    console.log("Created database pendingcomments if not exist"); // {"answer": 42} 
  });

//for(var i=0; i < new_places.length; i++){
  txn.executeSql("INSERT INTO pendingcomments VALUES (?, ?, ?, ?, ?, ?, ?);", [ title, content, grade, place.mid, author, user_id, date_string], function (tx, res) {
    console.log("Inserted values in SQLite for comment " + title + " " + content + " " + grade + " " + place.mid); // {"answer": 42} 

      var comment = new Object();
  comment.title = title;
  comment.content = content;
  comment.grade = grade;
  comment.placeid = place.mid;
  comment.author = author;
  comment.userid = user_id;
  comment.date = new Date();
  OfflineComments.insert(comment);

  }, function(error) {
    console.log('Transaction ERROR: ' + error.message);
  });

    txn.executeSql("SELECT * FROM pendingcomments;", [], function (tx, res) {
    console.log("Pending comments first line in SQLite for comment " + res.rows.item(0).title + " " + res.rows.item(0).content + " " + res.rows.item(0).grade + " " + res.rows.item(0).placeid ); // {"answer": 42} 
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
