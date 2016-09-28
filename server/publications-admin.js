Meteor.publish('users', function(){
	return Users.find();
});

Meteor.publish('places', function(){
	return Places.find();
});

Meteor.publish('comments', function(){
	return Comments.find();
});