import { Meteor } from 'meteor/meteor';



//import sqlitetomongo from "sqlitetomongo";

/*import 'sqlite-to-mongo';

import sqlite3 from "sqlite3"*/

Meteor.startup(() => {
   //Places._dropIndex("search_index_loc");
   // Plans._dropIndex("search_index_plan");
Places._ensureIndex({ "loc" : "2dsphere" }, {name : "search_index_loc"});
Plans._ensureIndex( { name: "text" } , {name : "search_index_plan"});

console.log(Places.find({ loc: { $geoWithin: { $centerSphere: [ [ 21.338348, 43.577473 ] ,
                                                     5 / 6378.15214 ] } } }).fetch());//500 m




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
  register: function(data){
    var user = null;
    user = Users.findOne({username:data[0], password:data[1]});
    if(user == null){

            var tmp = null;
             tmp = Users.insert({
            'username': data[0],
            'password': data[1],
            'firstname': data[2],
            'lastname': data[3],
            'telephone': data[4],
            'image': data[5]
          }); 

            if(tmp != null){
              return true;
            }
            else{
              return false;
            }
          }
          else{
            return false;
          }
  },

    insertPlace: function(data){

//trebala bi provera da se ubaci
    	/*check(data[0], String);
    	check(data[1], String);
    	check(data[2], String);
    	check(data[3].lat, Number);
    	check(data[3].lng, Number);
    	check(data[4].lng, String); */
    //  var newDate = new Date();
     // newDate.setHours(newDate.getHours() + 2);
    		
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
            'date': new Date(),
            'author': data[4],
            'user_id': data[5],
            'image1': data[6],
            'image2': data[7],
            'image3': data[8]
          });
    },

    insertComments: function(array){
      for(var i=0; i<array.length; i++){
          Comments.insert({
            'title': array[i].title,
            'content': array[i].content,
            'grade':    array[i].grade,
            'place_id': array[i].placeid,
            'date': new Date(),
            'author': array[i].author,
            'user_id': array[i].userid,
            'image1': array[i].image1,
            'image2': array[i].image2,
            'image3': array[i].image3
          }, function(error, result){
            if(result==null){
              return false;
            }
          });
      } //name TEXT, description TEXT, type TEXT, lat TEXT, lng TEXT, user_id TEXT

      return true;
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
        timestamp: new Date(),
        center: data[5]

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
    },

    downloadPlaces: function(city){
      console.log("preuzimanje svih place-ova za downloadovani grad - server");

      return Places.find({city: city}).fetch();
    },

    downloadComments: function(city){//implementirati na klijentu, da li je dobro ovako?
      console.log("preuzimanje svih place-ova za downloadovani grad - server");

      return Comments.find({city: city}).fetch();
    },

    addFriend: function(data){ //data[0] //id usera koji je dodao
      console.log("dodavanje prijatelja"); //data[1] username korisnika koji je dodan
        var user = Users.findOne({username: data[1]});
        Users.update({_id: data[0]}, { $addToSet: {friends: user._id }});
        Users.update({_id: user._id}, { $addToSet: {friends: data[0] }});

    },

    addPlan: function(data){
      console.log("dodavanje plana");
      var places = data[0];
      var name = data[1];
      var option = data[2];

      return Plans.insert({
                    places: places,
                    name: name,
                    option: option,
                    user_id: data[3], 
                    date_aded: data[4], 
                    all_waypoints: data[5],
                    creator_name: data[6],
                    city: data[7]
      });
    },
    updatePlanOption: function(data){
      console.log("Update Plan Options "  + JSON.stringify(data));
      return Plans.update({_id: data[0]}, {$set: {option: data[1]}});
    },
    'sharePlan': function(data){//[nas_id, plan, izabrane prijatelje]
      for(var i =0; i<data[2].length; i++)
      {
       SharedPlans.insert({
          shared_by: data[0],
          shared_to: data[2][i],
          plan_id: data[1]
        });
      }

    },
    'removeSharedPlan' : function(data){
      return SharedPlans.remove({plan_id: data[0], shared_to:data[1]});
    },
    'addToSavedPlans' : function(data){

      SharedPlans.remove({plan_id: data[0], shared_to:data[1]});
      
      return SavedPlans.insert({
        saved_by : data[1],
        plan_id : data[0]
      });
    }
    
	
}); //pucaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!!!!!!!!!!!!!!








