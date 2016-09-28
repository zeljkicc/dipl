Template.AdminUsersLayout.onCreated(function(){
	this.subscribe('users');
});

Template.AdminUsersLayout.helpers({
	users:function(){
		return Users.find();
	}
});
Template.AdminUsersLayout.events({
	
})





