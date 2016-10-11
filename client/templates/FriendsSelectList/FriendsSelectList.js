Template.FriendsSelectListLayout.onCreated(function(){
	var userdata = Session.get('userdata');
var instance = this;
this.autorun(function(){
	instance.subscribe('friends', [userdata._id, Session.get('resubscribe')]);
})
	
});

Template.FriendsSelectListLayout.helpers({
	friends: function(){
		//treba da vrati prijatelje
		return Users.find();
	}
});

Template.FriendsSelectListLayout.events({
	'click .js-share-plan': function(event){
		//treba da sharujemo prijateljima
		event.preventDefault();
		var friends = Users.find().fetch();
		var selected_friends = [];
		for(var i =0; i< friends.length; i++){
			//if($().)
			if($("#" + friends[i]._id + "_friend_checkbox").is(":checked")){
				selected_friends.push(friends[i]._id);
			}
		}

		//var selected_friends

		//var plan = Plans.findOne({_id: FlowRouter.getParam('id')});
		Meteor.call('sharePlan', [Session.get('userdata')._id, FlowRouter.getParam('id'), selected_friends],function(error, result){
			alert(result);
		});
		//return Users.find();
	}
});
