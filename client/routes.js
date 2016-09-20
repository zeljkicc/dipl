FlowRouter.route('/', {
	name: 'main',
	action(){
		FlowRouter.go('login');
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
		BlazeLayout.render('MainLayout', {main: 'AddNewLayout'});
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

FlowRouter.route('/map', {
	name: 'map',
	action(){
		BlazeLayout.render('MainLayout', {main: 'MapLayout'});
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

