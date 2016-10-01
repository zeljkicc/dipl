Template.PlaceDetailsLayout.helpers({
  'place': function(){
    var id = FlowRouter.getParam('id');
    //return Places.findOne({_id: id});

    	if(!navigator.onLine && Session.get('open-map')){
        return OfflinePlaces.findOne({_id: id});//_id iz SQLite dodeljuje se novi prilikom uzimanja iz baze
    }
    else{
		return Places.findOne({_id: id});//_id - Mongov id
    }
  }
});

Template.PlaceDetailsLayout.onCreated(function(){
  var id = FlowRouter.getParam('id');
  this.subscribe('place-details', id);
});

Template.PlaceDetailsLayout.events({
  'click .js-my-back-arrow': function(){
    FlowRouter.go('home');
  }
});
