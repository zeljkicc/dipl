Template.HomeLayout.onCreated(function(){
 //this.showRadius = new ReactiveVar(false);

 if(Session.get('radius')==undefined){
   Session.set('radius', 1);
 }
 if(Session.get('showRadius') == undefined){
  Session.set('showRadius', true);
 }
});


Template.HomeLayout.helpers({
  userdata: function(){
      return Session.get("userdata");
  },
  radius_val: function(){
      return Session.get('radius');
  },
  showRadius: function(){
      return Session.get('showRadius');
  }
});

Template.HomeLayout.events({
  'click .js-radius-switch-input':function(event){
    Session.set('showRadius', !Session.get('showRadius'));
  },
  'change .js-radius-slider':function(event){
    Session.set('radius', e.target.value);
  }
});