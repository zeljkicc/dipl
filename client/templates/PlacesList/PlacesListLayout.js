Template.PlacesListLayout.onCreated(function(){


      //razmotriti za buduce opcije :)
      //this.subscribe('near-places', [Session.get('location'), Session.get('radius')]);

this.subscribe('places-within-box', Session.get("map-bounds"), function(){

  });



  });


Template.PlacesListLayout.helpers({
  'places': function(){  
  	if(!navigator.onLine && Session.get('open-map')){
        return OfflinePlaces.find();
    }
    else{
		return Places.find(); 
    }
        //FlowRouter.go('placedetails');    
    }
  
});

Template.PlacesListLayout.events({
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  }
});
