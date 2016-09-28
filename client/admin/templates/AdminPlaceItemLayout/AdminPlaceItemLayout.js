Template.AdminPlaceItemLayout.events({
	'click .js-delete-button':function(event){
		event.preventDefault();

		Meteor.call('deletePlace', this._id, function(error, result){
			alert(result);
		});
	}
});


Template.AdminPlaceItemLayout.helpers({
  show_date: function(date){
    var date = new Date(date);
    return date.getDate()  + ". " + (date.getMonth() + 1) + ". " + date.getFullYear() + ".";
  }
});