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