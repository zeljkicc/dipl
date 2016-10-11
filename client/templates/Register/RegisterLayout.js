Template.RegisterLayout.events({
        'click .back': function(event) {
            event.preventDefault();
            console.log("Back submitted.");
            FlowRouter.go('login');

        },
   

 });

Template.RegisterLayout.onRendered(function(){
  $(".button-register").on("click", function(event){
          event.preventDefault();
          console.log("Register submitted.");
          // FlowRouter.go('register');

          var username = $(".js-username").val();
          var password = $(".js-password").val();
          var firstname = $(".js-firstname").val();
          var lastname = $(".js-lastname").val();
          var telephone = $(".js-telephone").val();

          var image = $("#image").attr('src');

        /*  Users.insert({
            'username': username,
            'password': password,
            'firstname': firstname,
            'lastname': lastname,
            'telephone': telephone
          }); */

          Meteor.call('register', [username, password, firstname, lastname, telephone, image],
           function(error, result){
              if(result == true){
              alert("Registered successfully. Please login to verify.")
            FlowRouter.go('login');
          }
          else alert("Not registered. Try Again.")
          });

          
        });

  $(".button-back").on("click", function(event){
    event.preventDefault();
    FlowRouter.go('login');
  });







   $(".js-take-picture").on("click", function(event){
 event.preventDefault();
      var cameraOptions = {  
    quality: 50
    }

      MeteorCamera.getPicture(function(error, data){
         // alert(JSON.stringify(data));
          //$(".js-choose-picture-3").css("display", 'none');
         //$(".js-take-picture-3").css("display", 'none');
         $("#image").attr("src", data);
      });

  });
  $(".js-choose-picture").on("click", function(event){
     event.preventDefault();
      var cameraOptions = {  
    quality: 50,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
}

MeteorCamera.getPicture(cameraOptions, function(error, data){
    // do stuff
     //$(".js-choose-picture-1").css("display", 'none');
         //$(".js-take-picture-1").css("display", 'none');
         $("#image").attr("src", data);
});
    });
      });