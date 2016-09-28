Template.CommentsListLayout.onCreated(function(){
  var id = FlowRouter.getParam('id');
  this.subscribe('place-comments', id);
});


Template.CommentsListLayout.helpers({
  comments: function(){
   // var id = FlowRouter.getParam('id');
    return Comments.find({}, {sort: {date: -1}});
  }
}); 

