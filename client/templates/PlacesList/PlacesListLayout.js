Template.PlacesListLayout.onCreated(function(){


      this.subscribe('near-places', [Session.get('location'), Session.get('radius')]);




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
