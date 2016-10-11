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
        case "amphitheater":
      return '/images/amphitheater-2.png'
      break;
        case "museum":
      return '/images/art-museum-2.png'
      break;
        case "fortress":
      return '/images/tvrdjava.png'
      break;
        case "library":
      return '/images/book.png'
      break;
        case "cinema":
      return '/images/cinema.png'
      break;
        case "fountain":
      return '/images/fountain-2.png'
      break;
        case "gallery":
      return '/images/museum-paintings.png'
      break;
        case "music":
      return '/images/music_live.png'
      break;
        case "planetarium":
      return '/images/planetarium-2.png'
      break;
        case "monument":
      return '/images/statue-2.png'
      break;
        case "church":
      return '/images/church.png'
      break;
        case "theater":
      return '/images/theater.png'
      break;   


    }
  }
});