Template.AdminAddNewPlaceLayout.onRendered(function(){
	$(".js-add-place").on("click", function(event){
		event.preventDefault();
		alert("hello");
	})
});


Template.AdminAddNewPlaceLayout.events({
	'click .js-add-place': function(event){
		
	}
})