
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

         var image1 = $("#image1").attr('src');
         var image2 = $("#image2").attr('src');
         var image3 = $("#image3").attr('src');

          

          $(".js-title").val("");
          $(".js-content").val("");

          $(".js-choose-picture-1").css("display", 'inline-block');
         $(".js-take-picture-1").css("display", 'inline-block');
         $("#image1").attr("src", "");

         $(".js-choose-picture-2").css("display", 'inline-block');
         $(".js-take-picture-2").css("display", 'inline-block');
         $("#image2").attr("src", "");

         $(".js-choose-picture-3").css("display", 'inline-block');
         $(".js-take-picture-3").css("display", 'inline-block');
         $("#image3").attr("src", "");

        //  Meteor.call("insertComment", [title, content, grade, place_id, author, user_id]);




          if(Meteor.isCordova){
          if(navigator.connection.type != Connection.NONE){//ako smo online samo saljemo na server

          Meteor.call("insertComment", [title, content, grade, place_id, author, user_id, image1, image2, image3]);

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

 txn.executeSql('CREATE TABLE IF NOT EXISTS pendingcomments (title TEXT, content TEXT, grade INTEGER, placeid TEXT, author TEXT, userid TEXT, date TEXT, image1 TEXT, image2 TEXT, image3 TEXT);', [], function (tx, res) {
    console.log("Created database pendingcomments if not exist"); // {"answer": 42} 
  });

//for(var i=0; i < new_places.length; i++){
  txn.executeSql("INSERT INTO pendingcomments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [ title, content, grade, place.mid, author, user_id, date_string, image1, image2, image3], function (tx, res) {
    console.log("Inserted values in SQLite (pendingcomments) for comment " + title + " " + content + " " + grade + " " + place.mid); // {"answer": 42} 

      var comment = new Object();
  comment.title = title;
  comment.content = content;
  comment.grade = grade;
  comment.placeid = place.mid;
  comment.author = author;
  comment.userid = user_id;
  comment.date = new Date();
  comment.image1 = image1;
  comment.image2 = image2;
  comment.image3 = image3;

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
 Meteor.call("insertComment", [title, content, grade, place_id, author, user_id, image1, image2, image3]);
}
  },
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  },
  'click .js-take-picture': function(){
    var cameraOptions = {  
    quality: 50
}

      MeteorCamera.getPicture(function(error, data){
         // alert(JSON.stringify(data));
         $("#image").attr("src", data);
      });
  },
  'click .js-choose-picture': function(){
     var cameraOptions = {  
    quality: 50,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
}

MeteorCamera.getPicture(cameraOptions, function(error, data){
    // do stuff
    $("#image").attr("src", data);
});

  },

  'click .js-take-picture-1':function(){
      var cameraOptions = {  
    quality: 50
    }

      MeteorCamera.getPicture(cameraOptions, function(error, data){

         $(".js-choose-picture-1").css("display", 'none');
         $(".js-take-picture-1").css("display", 'none');
         $("#image1").attr("src", data);


      });

  },
  'click .js-take-picture-2':function(){
      var cameraOptions = {  
    quality: 50
    }

      MeteorCamera.getPicture(cameraOptions, function(error, data){
           $(".js-choose-picture-2").css("display", 'none');
         $(".js-take-picture-2").css("display", 'none');
         $("#image2").attr("src", data);
      });

  },
  'click .js-take-picture-3':function(){

      var cameraOptions = {  
    quality: 50
    }

      MeteorCamera.getPicture(function(error, data){
         // alert(JSON.stringify(data));
          $(".js-choose-picture-3").css("display", 'none');
         $(".js-take-picture-3").css("display", 'none');
         $("#image3").attr("src", data);
      });

  },
  'click .js-choose-picture-1':function(){
      var cameraOptions = {  
    quality: 50,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
}

MeteorCamera.getPicture(cameraOptions, function(error, data){
    // do stuff
     $(".js-choose-picture-1").css("display", 'none');
         $(".js-take-picture-1").css("display", 'none');
         $("#image1").attr("src", data);
});

  },
  'click .js-choose-picture-2':function(){
      var cameraOptions = {  
    quality: 50,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
}

MeteorCamera.getPicture(cameraOptions, function(error, data){
    // do stuff
      $(".js-choose-picture-2").css("display", 'none');
         $(".js-take-picture-2").css("display", 'none');
         $("#image2").attr("src", data);
});

  },
  'click .js-choose-picture-3':function(){
    var cameraOptions = {  
    quality: 50,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
}

MeteorCamera.getPicture(cameraOptions, function(error, data){
    // do stuff
       $(".js-choose-picture-3").css("display", 'none');
         $(".js-take-picture-3").css("display", 'none');
         $("#image3").attr("src", data);
});

  },
  'click #image1':function(){
      //alert("Hey");
      $("#image-in-popup").attr('src', $("#image1").attr("src"));
      $("#popup-for-image").bPopup();
  },
  'click #image2':function(){
      $("#image-in-popup").attr('src', $("#image2").attr("src"));
      $("#popup-for-image").bPopup();
  },
  'click #image3':function(){
      $("#image-in-popup").attr('src', $("#image3").attr("src"));
      $("#popup-for-image").bPopup();
  }


});






Template.AddNewCommentLayout.onCreated(function(){
  var comments = Comments.find().fetch();
  for(var i = 0; i < comments.length; i++){

    $('#image1_' + comments[i]._id).on('click', function(){
        //alert("Hey");
        $("#image-in-popup").attr('src', $("#image1"  + comments[i]._id).attr("src"));
        $("#popup-for-image").bPopup();
    });
    $('#image2_' + comments[i]._id).on('click', function(){
        $("#image-in-popup").attr('src', $("#image2"  + comments[i]._id).attr("src"));
        $("#popup-for-image").bPopup();
    });
    $('#image3_' + comments[i]._id).on('click', function(){
        $("#image-in-popup").attr('src', $("#image3_" + comments[i]._id).attr("src"));
        $("#popup-for-image").bPopup();
    });
  }


  });