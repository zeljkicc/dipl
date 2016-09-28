Template.AdminUserItemLayout.onRendered(function(){

});

Template.AdminUserItemLayout.events({
	'click .js-delete-button':function(event){
		event.preventDefault();
		Meteor.call('deleteUser', this._id, function(error, result){
			alert(result);
		}); 
	}
});
