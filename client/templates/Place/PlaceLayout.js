Template.PlaceLayout.onCreated(function(){
  this.num_reviews = new ReactiveVar(0);
});


Template.PlaceLayout.helpers({

  num_reviews: function(id){
    var instance = Template.instance();
      Meteor.call('num_reviews', id, function(error, result){
        if(result!= null && result!= undefined)
          
        instance.num_reviews.set(result);
      });
      return Template.instance().num_reviews.get();
    //  
  },
  rating: function(id){
      Meteor.call('avg_rating', id, function(error, result){       
          return result;
      });
  },
  shorter: function(description){
    if(description.length > 50){
      return '"' + description.substring(0, 50) + '..."';
    }
    else{
      return '"' +  description + '"';
    }
  },
  icon: function(type){
    switch(type){
      case 'hotel':
        return '/images/hotel_0star.png'
      break;
      case 'restaurant':
        return '/images/restaurant.png'
      break;

    }
  }
});