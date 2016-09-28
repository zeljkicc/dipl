Template.AdminPlaceDetailsLayout.onCreated(function(){
	var id = FlowRouter.getParam('id');
	this.subscribe('place-details',id);
});

Template.AdminPlaceDetailsLayout.onRendered(function(){


  L.Icon.Default.imagePath = '/images';
	

	this.autorun(function(){
		 var place = Places.findOne();
		 if(place){

		 	var map = L.map('admin-map').setView(place.loc.coordinates.reverse(), 17);

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

	//map.invalidateSize();

		var marker = L.marker(place.loc.coordinates);
		map.addLayer(marker);
		//map.setView(place.loc.coordinates.reverse());
		//map.setZoom(18);
		


	}
	});
//map.invalidateSize();
	
});

Template.AdminPlaceDetailsLayout.helpers({
	'place': function(){
	return Places.findOne();
	}
});