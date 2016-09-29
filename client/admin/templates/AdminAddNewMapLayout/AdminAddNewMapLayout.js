Template.AdminAddNewMapLayout.onRendered(function(){
	$('.js-add-map').on('click', function(event){
		event.preventDefault();

		//FlowRouter.go('main');
		alert(centerLatLng);

 var city = $(".js-city").val();
 var size = $(".js-size").val();
 var state = $(".js-state").val();
 var bounds = $(".js-bounds").val();
 var uri = $(".js-uri").val();

console.log("dodavanje mape client");

Meteor.call('addMap', [city, state, size, bounds, uri, centerLatLng], function(errror, result){
		//alert(result);

		$("#pop-up-form").bPopup().close();
		$(".js-city").val("");
$(".js-size").val("");
$(".js-state").val("");
$(".js-bounds").val("");
$(".js-uri").val("");
	});
});





	//postavljanje leaflet mape///////////////////////////////////////////////////////////
	 L.Icon.Default.imagePath = '/images';
	
            var centerLatLng = null;

		 	var map = L.map('add-new-map');

		 		map = map.invalidateSize();

		 		var marker = null;

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);



	  

 		map.on('locationfound', onLocationFound);
 
 		map.on('locationerror', onLocationError);

 		 map.on('click', function(e){
    if(marker!=null){
	      map.removeLayer(marker);
	       }
	   
	      marker = new L.marker(e.latlng).addTo(map);

	      centerLatLng = e.latlng;

    });
		

		map.locate({setView: true, maxZoom: 17});

		function onLocationFound(e) {
    var radius = e.accuracy / 2;

    marker = L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

          marker.dragging.enable();
        

    var myCircle = L.circle(e.latlng, radius).addTo(map);

    

  //  setPlaces();
}

function onLocationError(e) {
    alert(e.message);
}




		
	

});


Template.AdminAddNewMapLayout.events({

});

