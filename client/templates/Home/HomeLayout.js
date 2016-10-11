Template.HomeLayout.onCreated(function(){
 //this.showRadius = new ReactiveVar(false);

 if(Session.get('radius')==undefined){
   Session.set('radius', 1);
 }
 if(Session.get('showRadius') == undefined){
  Session.set('showRadius', true);
 }



});

Template.HomeLayout.onRendered(function(){
   $('.js-save-plan').on('click', function(){

      FlowRouter.go('/saveplan');
    
 });
    $('.js-plans').on('click', function(){

      FlowRouter.go('/plans');
    
 });
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
  },
  plan_places: function(){
      return PlanPlaces.find().count();
  },
  shared_plans: function(){
      return SharedPlans.find().count();
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

