Template.LoginLayout.onCreated(function(){
	localStorage.timestamp = new Date("2016-09-24T17:24:54.579Z");
});

Template.LoginLayout.onRendered(function(){

//deo jquery-mobile biblioteke, samo deo za touch evente importovan, da bi se 
//navigation-drawer otvarao/zatvarao priikom swipa
$("body").on("swiperight",function(){
    if(!$(".mdl-layout__drawer").hasClass("is-visible")) {
            $(".mdl-layout__drawer-button").click();                      
         }  
    });

$("body").on("swipeleft",function(){
            if($(".mdl-layout__drawer").hasClass("is-visible")) {
            $(".mdl-layout__drawer-button").click();   
            }                    
        
    });



});


Template.LoginLayout.events({
        'click .js-login': function(event) {
            event.preventDefault();
            console.log("Login submitted.");

            var username = $(".js-username").val();
            var password = $(".js-password").val();



            if(Meteor.isCordova){//ako je cordovina aplikacija
              if(navigator.connection.type == Connection.NONE){//ako je offline vratimo ga nazad
                alert("Please connect to Internet!");
                return;
              }              
            }

            Meteor.call('login', [username, password], 
              function(error, result){

                var user = result;
                if(user!=undefined){
              console.log("Login success. " + user.username);

              Session.set("userdata", user);
              

              //perzistiranje u sqlite bazi
if(Meteor.isCordova){
       // var db = sqlitePlugin.openDatabase('userdata.db');
       var db = dbUserdata;
db.transaction(function (txn) {

  txn.executeSql('DROP TABLE IF EXISTS data;', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  }); 

  txn.executeSql('CREATE TABLE IF NOT EXISTS data (id TEXT,username TEXT, password TEXT, firstname TEXT, lastname TEXT, telephone TEXT);', [], function (tx, res) {
    console.log("Created database if not exist"); // {"answer": 42} 
  });

  txn.executeSql("INSERT INTO data VALUES (?, ?, ?, ?, ?, ?);", [user._id, user.username, user.password, user.firstname, user.lastname, user.telephone], function (tx, res) {
    console.log("Inserted values"); // {"answer": 42} 
  });


});
//db.close();
 } //end isCordova


FlowRouter.go('home');


            }
            else{
              console.log("Login failed.");
            } 


//proba


            });       

            

        },
        'click .js-register': function(event){
        	event.preventDefault();
        	console.log("Register submitted.");
        	FlowRouter.go('register');
        }
    });
