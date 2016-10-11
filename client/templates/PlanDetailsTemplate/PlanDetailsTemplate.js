Template.PlanDetailsLayout.onCreated(function(){
	var id = FlowRouter.getParam('id');
	var instance = this;

	if(navigator.onLine){
		this.autorun(function(){
			instance.subscribe('plan', [id, Session.get('resubscribe')]);
		});
	}
	
});


Template.PlanDetailsLayout.events({
	'click .js-public':function(event){
		event.preventDefault();
		var id = FlowRouter.getParam('id');
		Meteor.call('updatePlanOption', [id, "public"], function(error, result){
			alert(result);
			Session.set('resubscribe', 1);
		});
	}, 
	'click .js-private':function(event){
		event.preventDefault();
		var id = FlowRouter.getParam('id');

		Meteor.call('updatePlanOption', [id, "private"], function(error, result){
			alert(result);
			Session.set('resubscribe', 1);
		});
	},
	
	 'click .js-share-plan': function(){
      $("#pop-up-friends-list").bPopup();
  },
  	'click .js-button-add-to-my-plans':function(){
  		var plan_id = FlowRouter.getParam('id');//plan id
  		var user_id = Session.get('userdata')._id;//user id
  		Meteor.call('addToSavedPlans', [plan_id, user_id], function(error, result){
  			alert(result);

  			var plan = Plans.findOne({_id:plan_id});

  			 writeToFile(plan_id + '.json', plan);

  		});
  	},
  	'click .js-button-dismiss':function(){
  		var plan_id = FlowRouter.getParam('id');//plan id
  		var user_id = Session.get('userdata')._id;//user id
  		Meteor.call('removeSharedPlan', [plan_id, user_id], function(error, result){
  			alert(result);
  		});
  	}
});



Template.PlanDetailsLayout.helpers({
	plan: function(){
		return Plans.findOne();
	},
	my: function(user_id){
		if(user_id == Session.get('userdata')._id){
			return true;
		}
		else return false;
	},
	option: function(option){
		var id = FlowRouter.getParam('id');
		var plan = Plans.findOne({_id: id});
		if(plan.option == option){
			return "checked";
		}
		else return "";
		
	},
  'shared_plan': function(){
    var plan_id = FlowRouter.getParam('id');
    //var shared_plans = SharedPlans.find().fetch();
    //var user_id = Session.get('userdata')._id;
    if(SharedPlans.findOne({plan_id : plan_id})){
      return true;
    }
    else{
      return false;
    }
  }

});



var errorHandler = function (fileName, e) {  
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + fileName + '): ' + msg);
}

 
    function writeToFile(fileName, data) {
        data = JSON.stringify(data, null, '\t');
        var id = data._id;
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
        		console.log("Da li je Direktorijum 1" + directoryEntry);

        	directoryEntry.getDirectory("offlineplans", {create: true}, function(directoryEntry2){


        				directoryEntry2.getFile(fileName, { create: true }, function (fileEntry) {
            	console.log("Da li je Direktorijum 2" + fileEntry);
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        console.log('Write of file "' + fileName + '" completed.');


                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));




        	}, function(){console.log("Error while creating directory offlineplans");});	


            
        }, errorHandler.bind(null, fileName));
    }

