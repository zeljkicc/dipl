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
})