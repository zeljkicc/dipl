
Template.AddNewCommentLayout.events({
  'click .js-add-comment': function(event){
          event.preventDefault();

          var userdata = Session.get("userdata");

          var title = $(".js-title").val();
          var content = $(".js-content").val();
          var grade =  $('#rating').data('userrating');
          var place_id = FlowRouter.getParam('id');
          var user_id = userdata._id;
          var date = new Date();
          var author = userdata.firstname + " " + userdata.lastname;

          $(".js-title").val("");
          $(".js-content").val("");

          Meteor.call("insertComment", [title, content, grade, place_id, date, author, user_id]);
  },
  'click .js-my-back-arrow': function(){
    FlowRouter.go("home");
  }
});
