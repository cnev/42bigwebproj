/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
//keystone.pre('routes', middleware.forkByUserClass);
keystone.pre('render', middleware.flashMessages);
keystone.pre('render', middleware.testmiddle);
//keystone.pre('routes', middleware.checkAuth);

/* Import Route Controllers
   var routes = {
views: importRoutes('./views')
};*/

// Setup Route Bindings
exports = module.exports = function(app) {


	/*	app.('/', routes.views.index);
		app.get('/blog/:category?', routes.views.blog);
		app.get('/blog/post/:post', routes.views.post);
		app.get('/gallery', routes.views.gallery);
		app.all('/contact', routes.views.contact);*/
	app.use('/login', require('./views/login'));
	app.use('/logout', require('./views/logout'));
	app.use('/', middleware.checkAuth, require('./views/index'));
	app.use('/pititest', middleware.checkAuth, require('./views/pititest'));
	app.use('/search', middleware.checkAuth, require('./views/search'));
	app.use('/ticket_test', middleware.checkAuth, require('./views/ticket_test'));
	app.use('/install', middleware.checkAuth, require('./views/install'));
	app.use('/test', middleware.checkAuth, require('./views/testRoute'));
	app.use('/activity', middleware.checkAuth, require('./views/activity'));
	app.use('/module', middleware.checkAuth, require('./views/module'));
	app.use('/forum', middleware.checkAuth, require('./views/forum'));
	app.use('/profile', middleware.checkAuth, require('./views/profile'));
	app.use('/peer_correction', middleware.checkAuth, require('./views/peer_correction'));
	app.use('/ticket', middleware.checkAuth, require('./views/ticket'));
	app.use('/schedule', middleware.checkAuth, require('./views/schedule'));
	app.use('/admin', middleware.checkAuth, middleware.requireAdmin, require('./views/admin'));
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
