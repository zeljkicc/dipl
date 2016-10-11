Template.UsersListLayout.onCreated(function(){

	var instance = this;
	this.autorun(function(){
		instance.subscribe('search-users', Session.get('search-terms'), function(){

		});
	});
	

});

Template.UsersListLayout.helpers({
	friends: function(){
		//treba da vrati prijatelje
		return Users.find();
	}
});