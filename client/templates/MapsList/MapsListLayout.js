Template.MapsListLayout.onCreated(function(){  
  this.subscribe('maps');
});

Template.MapsListLayout.helpers({
  maps: function(){
    return Maps.find();
  } 

});

Template.MapsListLayout.events({
  'click .js-my-back-arrow': function(){
    FlowRouter.go("downloadedmaps");
  },

});