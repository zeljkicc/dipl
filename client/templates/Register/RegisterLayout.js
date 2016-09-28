Template.RegisterLayout.events({
        'click .back': function(event) {
            event.preventDefault();
            console.log("Back submitted.");
            FlowRouter.go('login');

        },
        'click .register': function(event){
        	event.preventDefault();
        	console.log("Register submitted.");
        	// FlowRouter.go('register');

          var username = $(".js-username").val();
          var password = $(".js-password").val();
          var firstname = $(".js-firstname").val();
          var lastname = $(".js-lastname").val();
          var telephone = $(".js-telephone").val();

          Users.insert({
            'username': username,
            'password': password,
            'firstname': firstname,
            'lastname': lastname,
            'telephone': telephone
          });

          FlowRouter.go('login');
        }
    });