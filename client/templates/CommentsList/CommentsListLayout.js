Template.CommentsListLayout.onCreated(function(){
  var id = FlowRouter.getParam('id');
  //this.subscribe('place-comments', id);

  //kako da uzmemo za koji je place? sesija?

    	if(!navigator.onLine && Session.get('open-map')){
    			var db = dbUserdata;

var place = OfflinePlaces.findOne({_id:id});

            db.transaction(function (txn) {

            	

				txn.executeSql("SELECT * FROM offlinecomments WHERE placeid = ?;", [place.mid], function (tx, res) {
				    console.log("Offline comments for " + Session.get('open-map') + " :" + JSON.stringify(res.rows.length) + " " + JSON.stringify(res.rows.length)); // {"answer": 42} 

			//	var array = [];
				for(var i = 0; i< res.rows.length; i++){
				  //array.push(res.rows.item(i));
				  OfflineComments.insert(res.rows.item(i));
				}	     



				  });			 

		    });

          var db1 = dbUserdata;
                   //ako smo offline, dodamo komentar, zatvorimo place details, pa ponovo otvorimo, da bi i taj
        //komentar koji "ceka" sinhronizaciju sa bazom bio prikazan
            db1.transaction(function (txn) {
        txn.executeSql("SELECT * FROM pendingcomments WHERE placeid = ?;", [place.mid], function (tx, result) {
            console.log("Offline comments for " + Session.get('open-map') + " :" + JSON.stringify(result.rows.length) + " " + JSON.stringify(result.rows.length)); // {"answer": 42} 

      //  var array = [];
        for(var i = 0; i< result.rows.length; i++){
          //array.push(res.rows.item(i));
          OfflineComments.insert(result.rows.item(i));
        }      



          });



 });

    }
    else{
		this.subscribe('place-comments', id, function(){
        var comments = Comments.find().fetch();
  for(var i = 0; i < comments.length; i++){

    $('#image1_' + comments[i]._id).on('click', function(){
        //alert("Hey");
        $("#image-in-popup2").attr('src', $("#"+this.id).attr("src"));
        $("#popup-for-image2").bPopup();
    });
    $('#image2_' + comments[i]._id).on('click', function(){
        $("#image-in-popup2").attr('src', $("#"+this.id).attr("src"));
        $("#popup-for-image2").bPopup();
    });
    $('#image3_' + comments[i]._id).on('click', function(){
        $("#image-in-popup2").attr('src', $("#"+this.id).attr("src"));
        $("#popup-for-image2").bPopup();
    });
  }
    });
    }


});


Template.CommentsListLayout.helpers({
  comments: function(){
   // var id = FlowRouter.getParam('id');
   // return Comments.find({}, {sort: {date: -1}});

    if(!navigator.onLine && Session.get('open-map')){
		return OfflineComments.find({}, {sort: {date: -1}});
    	
    }
    else{
		 return Comments.find({}, {sort: {date: -1}});
    }
  }
}); 



Template.CommentsListLayout.onDestroyed(function(){
	OfflineComments.remove({});
});

Template.CommentsListLayout.onRendered(function(){



  });