import { Meteor } from 'meteor/meteor';



//import sqlitetomongo from "sqlitetomongo";

/*import 'sqlite-to-mongo';

import sqlite3 from "sqlite3"*/

Meteor.startup(() => {
Places._ensureIndex({ "loc" : "2dsphere" });

console.log(Places.find({ loc: { $geoWithin: { $centerSphere: [ [ 21.338348, 43.577473 ] ,
                                                     0.5 / 6378.15214 ] } } }).fetch());//500 m




  });	




//metode na serveru koje se pozivaju sa klijenta prilikom inserta, updeta
Meteor.methods({
	login: function(data){
			check(data[0], String);//username
   			check(data[1], String);//password
   			

   			var user = Users.findOne({username:data[0], password:data[1]});

   			console.log(user);
   			//if (/* you want to throw an error */) {
     // throw new Meteor.Error("pants-not-found", "Can't find my pants");
 	//}

     return user;
    },

    insertPlace: function(data){

//trebala bi provera da se ubaci
    	/*check(data[0], String);
    	check(data[1], String);
    	check(data[2], String);
    	check(data[3].lat, Number);
    	check(data[3].lng, Number);
    	check(data[4].lng, String); */
    		
  Places.insert({
            'name': data[0], //name
            'description': data[1],//description
            'type':    data[2],//type
            'loc': {
                    'type':"Point",
                    'coordinates': [data[3].lng, data[3].lat] }, //latlng
              'user_id': data[4],//user id
               'timestamp': new Date(),
               'city': data[5]
          });
    },

    insertPlaces: function(array){
      for(var i=0; i<array.length; i++){
          Places.insert({
            'name': array[i].name, //name
            'description': array[i].description,//description
            'type':    array[i].type,//type
            'loc': {
                    'type':"Point",
                    'coordinates': [parseFloat(array[i].lng), parseFloat(array[i].lat)] }, //latlng
              'user_id': array[i].user_id,//user id
               'timestamp': new Date(),
               'city': array[i].city
          }, function(error, result){
            if(result==null){
              return false;
            }
          });
      } //name TEXT, description TEXT, type TEXT, lat TEXT, lng TEXT, user_id TEXT

      return true;
    },

    insertComment: function(data){
    	Comments.insert({
            'title': data[0],
            'content': data[1],
            'grade':    data[2],
            'place_id': data[3],
            'date': data[4],
            'author': data[5],
            'user_id': data[6]
          });
    },

    num_reviews: function(id){
      console.log("Id eventa: " + id);
      console.log("Count eventa: " + Comments.find({event_id:id}).count());
      return Comments.find({event_id:id}).count();
  },
  avg_rating: function(id){
           return 3;
  },





  //////////admin deo/////////////////////////

  //mape
  addMap: function(data){
    console.log("dodavanje mape server");
     return Maps.insert({
        city: data[0],
        state: data[1],
        size: data[2],
        bounds: data[3],
        uri: data[4],
        timestamp: new Date()

      });
  },
  deleteMap: function(id){
    console.log("brisanje mape server");
    return Maps.remove({
        _id: id
      });
  },
  deletePlace: function(id){
    console.log("brisanje place-a server");
    return Places.remove({
        _id: id
      });
  },
    deleteUser: function(id){
    console.log("brisanje place-a server");
    return Users.remove({
        _id: id
      });
  },
    deleteComment: function(id){
       console.log("brisanje review-a server");
       return Comments.remove({
        _id: id
      });
    }
      
    
	
}); //pucaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!!!!!!!!!!!!!!








