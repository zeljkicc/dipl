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

