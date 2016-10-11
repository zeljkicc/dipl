Template.FriendsListLayout.onCreated(function(){
	var userdata = Session.get('userdata');
var instance = this;      //promenjiva sesije resubscribe - reaktivni izvor
this.autorun(function(){
	instance.subscribe('friends', [userdata._id, Session.get('resubscribe')]);
})
	
});

Template.FriendsListLayout.helpers({
	friends: function(){
		//treba da vrati prijatelje
		return Users.find();
	}
});