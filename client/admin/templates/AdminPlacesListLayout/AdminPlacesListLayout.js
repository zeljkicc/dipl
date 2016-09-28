Template.AdminPlacesListLayout.onCreated(function(){
	this.subscribe('places');
});

Template.AdminPlacesListLayout.helpers({
	users:function(){
		return Places.find();
	}
});
Template.AdminPlacesListLayout.events({
	'click .addnewplace-button': function(){
			$("#pop-up-form-place").bPopup();
	}
});
