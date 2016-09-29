FlowRouter.route('/', {
	name: 'main',
	action(){
		if(Meteor.isCordova){
//Meteor._sleepForMs(1000);

//var db = sqlitePlugin.openDatabase('userdata.db');
if(dbUserdata==null){
	dbUserdata = sqlitePlugin.openDatabase({name: 'userdata.db', location: 'default'});
}
var db = dbUserdata;

if(db){
		db.transaction(function (txn) {


  txn.executeSql("SELECT * FROM data;", [], function (tx, res) {
    console.log("Userdata: " + JSON.stringify(res.rows.length)); // {"answer": 42} 

    if(res.rows.length > 0){//ako smo se prethodno ulogovali postojace db
    	var userdata = new Object();
    	userdata._id = res.rows.item(0).id;
  		userdata.username = res.rows.item(0).username;
  		userdata.password = res.rows.item(0).password;
  		userdata.firstname = res.rows.item(0).firstname;
  		userdata.lastname = res.rows.item(0).lastname;
  		userdata.telephone = res.rows.item(0).telephone;
		Session.set("userdata", userdata);

    	FlowRouter.go('home');
    }
    else{
    	FlowRouter.go('login');
    }
  }, function(error){
  	FlowRouter.go('login');
  }); 

//FlowRouter.go('login');

});
	}
	else {FlowRouter.go('login');}

	//}//ako ne postoji db

//db.close();
	}///end isCordova
	else{//ako je web aplikacija
		FlowRouter.go('login');
	}
	}
	
});


FlowRouter.route('/login', {
	name: 'login',
	action(){
		 //FlowTransition.flow({main: "LoginLayout"});
		BlazeLayout.render('StartLayout', {main: 'LoginLayout'});
	}
});

FlowRouter.route('/register', {
	name: 'register',
	action(){
		BlazeLayout.render('StartLayout', {main: 'RegisterLayout'});
	}
});


FlowRouter.route('/addnew', {
	name: 'addnew',
	action(){
		if(!navigator.onLine && Session.get('open-map')==undefined){
			FlowRouter.go('downloadedmaps')
		}else{
		BlazeLayout.render('MainLayout', {main: 'AddNewLayout'});
	}
	}
});


FlowRouter.route('/placeslist', {
	name: 'placeslist',
	action(){
		BlazeLayout.render('MainLayout', {main: 'PlacesListLayout'});
	}
});

FlowRouter.route('/placedetails/:id', {
	name: 'placedetails',
	action(){
		BlazeLayout.render('MainLayout', {main: 'PlaceDetailsLayout'});
	}
});

FlowRouter.route('/home', {
	name: 'home',
	action(){
		if(!navigator.onLine && Session.get('open-map')==undefined){
			FlowRouter.go('downloadedmaps');
		
	}
	else{
		BlazeLayout.render('MainLayout', {main: 'HomeLayout'});
	}
	}
});


FlowRouter.route('/mapslist', {
	name: 'mapslist',
	action(){
		BlazeLayout.render('MainLayout', {main: 'MapsListLayout'});
	}
});


FlowRouter.route('/downloadedmaps', {
	name: 'downloadedmaps',
	action(){
		BlazeLayout.render('MainLayout', {main: 'DownloadedMapsLayout'});
	}
});

