Template.AdminMapListLayout.onCreated(function(){
	this.subscribe('maps');
});

Template.AdminMapListLayout.helpers({
	maps:function(){
		return Maps.find();
	}
});
Template.AdminMapListLayout.events({
	'click .addnewmap-button':function(event){
			$("#pop-up-form").bPopup();
	}
});




