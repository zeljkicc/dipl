Template.AddNewFriendLayout.events({
	'click .js-addfriend-button': function(event){
		event.preventDefault();



		//alert($('.js-addfriend-input').val());

		var term = $('.js-addfriend-input').val();

		//Session.set('search-terms', array);

		Meteor.call('addFriend', [Session.get('userdata')._id, term], function(){
				Session.set('resubscribe', true);
				$('.js-addfriend-input').val(" ");
		});
	}
});


Template.AddNewFriendLayout.onCreated(function(){
	var userdata = Session.get('userdata');
var instance = this;      //promenjiva sesije resubscribe - reaktivni izvor
this.autorun(function(){
	instance.subscribe('friends', [userdata._id, Session.get('resubscribe')]);
})
	
});

Template.AddNewFriendLayout.helpers({
	friends: function(){
		//treba da vrati prijatelje
		return Users.find();
	}, 
	addnewfriend: function(){
		if(FlowRouter.getRouteName() == "addnewfriend")
			return false;
		else return true;
	}
});