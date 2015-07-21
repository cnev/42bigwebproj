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

/* Import Route Controllers
var routes = {
	views: importRoutes('./views')
};*/

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
/*	app.('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);*/
	app.use('/', require('./views/index'));
	app.use('/pititest', require('./views/pititest'));
	app.use('/login', require('./views/login'));
	app.use('/logout', require('./views/logout'));
	app.use('/search', require('./views/search'));
	app.use('/ticket_test', require('./views/ticket_test'));
	app.use('/prepare', require('./views/prepare'));
	app.use('/test', require('./views/testRoute'));
	app.use('/activity', require('./views/activity'));
	app.use('/profile', require('./views/profile'));
	app.use('/admin', require('./views/admin'));
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
