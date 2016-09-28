Template.AdminAddNewMapLayout.onRendered(function(){
	$('.js-add-map').on('click', function(event){
		event.preventDefault();

		//FlowRouter.go('main');

 var city = $(".js-city").val();
 var size = $(".js-size").val();
 var state = $(".js-state").val();
 var bounds = $(".js-bounds").val();
 var uri = $(".js-uri").val();

console.log("dodavanje mape client");

Meteor.call('addMap', [city, state, size, bounds, uri], function(errror, result){
		//alert(result);

		$("#pop-up-form").bPopup().close();
		$(".js-city").val("");
$(".js-size").val("");
$(".js-state").val("");
$(".js-bounds").val("");
$(".js-uri").val("");
	});
});
});


Template.AdminAddNewMapLayout.events({

});