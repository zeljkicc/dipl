Template.CommentsListItemLayout.helpers({
  show_date: function(date){
    var date = new Date(date);
    return date.getDate()  + ". " + (date.getMonth() + 1) + ". " + date.getFullYear() + ".";
  },
  grades: function(grade){
    var ret = [];

    for(var i =0; i<5; i++){
     // ret[i] = new Object();
      ret[i] = false;
    }
    for(var i = 0; i<grade; i++){
      ret[i]= true;
    }

    return ret;
  }
});

Template.CommentsListItemLayout.onRendered(function(){

});




Template.CommentsListItemLayout.events({
  'click #image1':function(e){
      alert(e.target.id);
      $("#image-in-popup").attr('src', $("#image1_").attr("src"));
      $("#popup-for-image").bPopup();
  },
  'click #image2':function(e){
      $("#image-in-popup").attr('src', $("#image2").attr("src"));
      $("#popup-for-image").bPopup();
  },
  'click #image3':function(e){
      $("#image-in-popup").attr('src', $("#image3").attr("src"));
      $("#popup-for-image").bPopup();
  }
});
