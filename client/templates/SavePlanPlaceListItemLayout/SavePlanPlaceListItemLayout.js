Template.SavePlanPlaceListItemLayout.helpers({

  icon: function(type){
    switch(type){
      case 'hotel':
        return '/images/hotel_0star.png'
      break;
      case 'restaurant':
        return '/images/restaurant.png'
      break;

    }
  },
  shorter: function(description){
    if(description.length > 50){
      return '"' + description.substring(0, 50) + '..."';
    }
    else{
      return '"' +  description + '"';
    }
  }

});

Template.SavePlanPlaceListItemLayout.events({

  'click .js-buttom-up':function(){
     // var instance = Template.instance(); 
      PlanPlaces.update({pos: this.pos - 1}, {$set : {pos: this.pos}});
      PlanPlaces.update({_id: this._id}, {$set : {pos: this.pos - 1}});


  },
  'click .js-buttom-down':function(){
     // var instance = Template.instance(); 
      PlanPlaces.update({pos: this.pos + 1}, {$set : {pos: this.pos}});
      PlanPlaces.update({_id: this._id}, {$set : {pos: this.pos + 1}});


  }

});