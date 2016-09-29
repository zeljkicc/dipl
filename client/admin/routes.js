FlowRouter.route('/admin/', {
	name: 'admin',
	action(){
		BlazeLayout.render('AdminMainLayout', {main: 'AdminHomeLayout'});
	}
});

FlowRouter.route('/admin/users', {
	name: 'admin-users',
	action(){
		BlazeLayout.render('AdminMainLayout', {main: 'AdminUsersLayout'});
	}
});

FlowRouter.route('/admin/places', {
	name: 'admin-places',
	action(){
		BlazeLayout.render('AdminMainLayout', {main: 'AdminPlacesListLayout'});
	}
});



FlowRouter.route('/admin/places/:id', {
	name: 'admin-place-details',
	action(){
		BlazeLayout.render('AdminMainLayout', {main: 'AdminPlaceDetailsLayout'});
	}
});

FlowRouter.route('/admin/maps', {
	name: 'admin-maps',
	action(){
		BlazeLayout.render('AdminMainLayout', {main: 'AdminMapListLayout'});
	}
});



FlowRouter.route('/admin/comments', {
	name: 'admin-comments',
	action(){
		BlazeLayout.render('AdminMainLayout', {main: 'AdminCommentsListLayout'});
	}
});

FlowRouter.route('/admin/addnewmap', {
	name: 'admin-addnewmap',
	action(){
		BlazeLayout.render('AdminMainLayout', {main: 'AdminAddNewMapLayout'});
	}
});