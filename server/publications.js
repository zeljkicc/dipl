Meteor.publish('near-places', function(data){
//Meteor._sleepForMs(2000);
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

Meteor.publish('new-places', function(data){
	var maps = data[1];
	var cities = [];
	if(data[0] && data[1]){
	for(var i = 0; i < maps.length; i++){
		cities.push(maps[i].city);
	}
	console.log('Timestamp za publish near places' + data[0]);
	console.log('Prosledjeni gradovi' + JSON.stringify(cities));
	console.log(Places.find({ $and: [{timestamp:{$gt: new Date(data[0])}, city: { $in: cities }}]}).fetch());
	return Places.find({ $and: [{timestamp:{$gt: new Date(data[0])}, city: { $in: cities }}]});
}
else{
	console.log("Nije dobro");
}
});

Meteor.publish('new-comments', function(timestamp){
	console.log('Timestamp za publish near comments' + timestamp);
	console.log(Comments.find({date:{$gt: new Date(timestamp)}}).fetch());
	return Comments.find({date:{$gt: new Date(timestamp)}});
});

Meteor.publish('friends', function(data){
	//treba da vrati prijatelje
	var user = Users.findOne({_id: data[0]});


	return Users.find({_id: {$in : user.friends}});
});

Meteor.publish('search-users', function(terms){
	//treba da vrati prijatelje
	//return Users.find({});

	var mongoDbArr = [];
terms.forEach(function(term) {
    mongoDbArr.push({ 'username':{'$regex':term} });
    mongoDbArr.push({ 'firstname':{'$regex':term} });
    mongoDbArr.push({ 'lastname':{'$regex':term} });
});

console.log(JSON.stringify(mongoDbArr));
console.log(JSON.stringify(Users.find({'$or' : mongoDbArr})));
	return Users.find({'$or' : mongoDbArr});
});

Meteor.publish('plans', function(){
	return Plans.find();
});

Meteor.publish('plan', function(data){
	return Plans.find({_id:data[0]});
});

Meteor.publish('sharedplans', function(id){
	console.log("publish shared plans");
	//var sharedplans = SharedPlans.find({shared_to: id}).fetch();
	/*var plans_ids = [];
	for(var i = 0; i<sharedplans.length; i++){
		plans_ids.push(sharedplans[i].plan_id);
	}	

console.log("publish shared plans" + JSON.stringify(plans_ids)); */

	return SharedPlans.find({shared_to: id});
});

Meteor.publish('public-plans', function(){
	return Plans.find({option: "public"});
});

Meteor.publish('my-plans', function(id){

	return Plans.find({user_id: id});
});

Meteor.publish('my-saved-plans', function(id){
	var user = Users.findOne({_id : id});
	return Plans.find({_id: {$in : user.saved_plans}});
});

Meteor.publish('shared-plans', function(id){

	var sharedplans = SharedPlans.find({shared_to: id}).fetch();
	var plans_ids = [];
	for(var i = 0; i<sharedplans.length; i++){
		plans_ids.push(sharedplans[i].plan_id);
	}	

console.log("publish shared plans" + JSON.stringify(plans_ids)); 

	//return SharedPlans.find({shared_to: id});

	return Plans.find({_id: {$in : plans_ids}});
});

Meteor.publish('saved-plans', function(id){

	var savedplans = SavedPlans.find({saved_by: id}).fetch();
	var plans_ids = [];
	for(var i = 0; i<savedplans.length; i++){
		plans_ids.push(savedplans[i].plan_id);
	}	

console.log("publish saved plans" + JSON.stringify(plans_ids)); 

	//return SharedPlans.find({shared_to: id});

	return Plans.find({_id: {$in : plans_ids}});
});

Meteor.publish('saved-plans-meta', function(id){
	console.log("publish saved plans");

	return SavedPlans.find({saved_by: id});
});

Meteor.publish('searched-plans', function(data){
	console.log("publish searched plans");


if(data[1] == "All" && data[0] == ""){
	console.log("ovde smo na serveru - prvo");
	return Plans.find({option: "public"}, {limit : 10});

}else if(data[1] != "All" && data[0]){
	return Plans.find({
		name: {$regex : data[0], $options: '-i'},
		city: data[1],
		option: "public"
	});
}else if(data[1] == "All" &&  data[0]){
	return Plans.find({
		name: {$regex : data[0], $options: '-i'},
		option: "public"
	});
}

});



