Template.PlansListLayout.onCreated(function(){




 	if(!navigator.onLine && Meteor.isCordova && Session.get('open-map')){


 		JSON.stringify(listDir(cordova.file.dataDirectory + "offlineplans/"));



 			function listDir(path){
  window.resolveLocalFileSystemURL(path,
    function (fileSystem) {
      var reader = fileSystem.createReader();
      reader.readEntries(
        function (entries) {
          console.log(entries);
          //return entries;
		var fileData;
          for(var i = 0; i<entries.length; i++){
          	console.log('Try to read file "' + entries[i]);
          	readFromFile(entries[i].nativeURL, function (data) {
		fileData = data;
		//alert(JSON.stringify(fileData));
		OfflinePlans.insert(fileData);
		}); 
          }
        },
        function (err) {
          console.log(err);
        }
      );
    }, function (err) {
      console.log(err);
    }
  );
}
      /*  var fileData;
        console.log('Try to read file "' + id + '.json' + '" completed.');
		readFromFile("offlineplans/" + id + ".json", function (data) {
		fileData = data;
		alert(JSON.stringify(fileData));
		OfflinePlans.insert(fileData);
		}); */

	


    }
    else{
			//subscrubujemo se za public planove
	//this.subscribe('public-plans');

	//subscrujbujemo se za nase planove
	this.subscribe('my-plans', Session.get('userdata')._id);

	//subscrujbujemo se na nama sharovane planove
	this.subscribe('shared-plans', Session.get('userdata')._id);

	//subscribujemo se na savovane planove - Plans
	this.subscribe('saved-plans', Session.get('userdata')._id);

	//subscribujemo se na savovane planove - SavedPlans
	this.subscribe('saved-plans-meta', Session.get('userdata')._id);

var instance = this;
Session.set('search-filter', "All");
this.autorun(function(){
	if(Session.get('search-term')){
	instance.subscribe('searched-plans', [Session.get('search-term'), Session.get('search-filter')]);
}
});
	

    }





});

Template.PlansListLayout.onRendered(function(){
	$(".js-input-search").keyup(function (e) {
		e.preventDefault();
	    if (e.keyCode == 13) {
	        alert("hello");
	    }
	});

	//var instance = this;

	$(".js-button-search").on('click', function(e){
		e.preventDefault();
		alert("hello");

		Session.set('search-term', $("#js-input-search").val());
		Session.set('search-filter', $(".js-filter-select").val());
	});
});




Template.PlansListLayout.helpers({
	my_plans:function(){
		return Plans.find({user_id : Session.get('userdata')._id});
	},
	shared_plans:function(){
	var sharedplans = SharedPlans.find().fetch();
	var plans_ids = [];
	for(var i = 0; i<sharedplans.length; i++){
		plans_ids.push(sharedplans[i].plan_id);
	}	
	return Plans.find({_id: {$in : plans_ids}});
	},
	public_plans:function(){
		return Plans.find({option: 'public', user_id : {$ne : Session.get('userdata')._id}});
	},
	saved_plans:function(){
		var savedplans = SavedPlans.find().fetch();
	var plans_ids = [];
	for(var i = 0; i<savedplans.length; i++){
		plans_ids.push(savedplans[i].plan_id);
	}	
	return Plans.find({_id: {$in : plans_ids}});
	},
	online:function(){
		return navigator.onLine;
	},
	offline_plans:function(){
		return OfflinePlans.find({city : Session.get('open-map')});
	},
	searched_plans:function(){
		if(Session.get('search-term')){
		return Plans.find({option: 'public', user_id : {$ne : Session.get('userdata')._id},
	     name: {$regex : Session.get('search-term'), $options: 'i'}});
	}
	else return [];
		
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


    function readFromFile(fileName, cb) {
        //var pathToFile = cordova.file.dataDirectory + fileName;
        var pathToFile = fileName;
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    cb(JSON.parse(this.result));
                };

                reader.readAsText(file);
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }



