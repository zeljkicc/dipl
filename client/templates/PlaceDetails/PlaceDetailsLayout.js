Template.PlaceDetailsLayout.helpers({
  'place': function(){
    var id = FlowRouter.getParam('id');
    return Places.findOne({_id: id});
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
