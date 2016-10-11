Template.DownloadedMapsLayout.onRendered(function(){

//prebaceno u main Template
  /*
	var db2 = null;
	if(dbMapdata == null){
//db2 = sqlitePlugin.openDatabase('mymaps.db');
db2 = sqlitePlugin.openDatabase({name: 'mymaps.db', location:'default'});
}
else{
db2 = dbMapdata;
}
db2.transaction(function (txn) {

  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("Mapdata helper: " + JSON.stringify(res.rows.length)); // {"answer": 42}
    var array = [];
    for(var i =0; i<res.rows.length; i++){
    	array.push(res.rows.item(i));
    }

Session.set('myMaps', array);
    //return  res.rows._array;
  }); 


}); */



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