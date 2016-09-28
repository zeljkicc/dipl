Template.AdminMapItemLayout.events({
	'click .js-delete-button':function(event){
		event.preventDefault();

		Meteor.call('deleteMap', this._id, function(error, result){
			alert(result);
		});
	}
});


Template.AdminMapItemLayout.helpers({
  show_date: function(date){
    var date = new Date(date);
    return date.getDate()  + ". " + (date.getMonth() + 1) + ". " + date.getFullYear() + ".";
  }
});