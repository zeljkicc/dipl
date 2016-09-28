Meteor.publish('near-places', function(data){
Meteor._sleepForMs(2000);
	console.log("Server " + JSON.stringify(data) + " " + data[0].lat + " " +  data[0].lng + " " + data[1]);
	 if(data) {

	 	
	return Places.find({ loc: { $geoWithin: { $centerSphere: [ [data[0].lng, data[0].lat] ,
                                                     data[1] / 6378.15214 ] } } });
}
});

Meteor.publish('global-places', function(){
	return Places.find({limit: 10});
});



Meteor.publish('places-within-box', function(bounds){

	console.log("Server " + bounds.southWest.reverse() + " " + bounds.northEast.reverse());


	 if(bounds && bounds.southWest && bounds.northEast) {

	 	console.log(Places.find({ loc: { $geoWithin: { $box: [bounds.southWest.reverse(), bounds.northEast.reverse()] } }}).fetch());
	return Places.find({ loc: { $geoWithin: { $box: [bounds.southWest.reverse(), bounds.northEast.reverse()] } }});


};

});


Meteor.publish('place-details', function(id){
	console.log("id " + id);
	if(id){
		return Places.find({_id: id});
	}
});


Meteor.publish('place-comments', function(id){
//	console.log("Place-id: " + data[0] + " " + "Limit: " + data[1]);
	if(id){
		return Comments.find({place_id: id});
		}
});

Meteor.publish('maps', function(){
	return Maps.find({}, {limit: 10});
});

Meteor.publish('new-places', function(timestamp){
	console.log('Timestamp za publish near places' + timestamp);
	console.log(Places.find({timestamp:{$gt: new Date(timestamp)}}).fetch());
	return Places.find({timestamp:{$gt: new Date(timestamp)}});
});