Template.AdminCommentsListLayout.onCreated(function(){
	this.subscribe('comments');
});

Template.AdminCommentsListLayout.helpers({
	comments:function(){
		return Comments.find();
	}
});
Template.AdminCommentsListLayout.events({

});
