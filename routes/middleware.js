/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');
var express = require('express');
var session = require('express-session');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {

	var locals = res.locals;

	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: 'Blog',		key: 'blog',		href: '/blog' },
		{ label: 'Gallery',		key: 'gallery',		href: '/gallery' },
		{ label: 'Contact',		key: 'contact',		href: '/contact' }
	];

	locals.user = req.user;

	next();

};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;

	next();

};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {

	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

exports.checkAuth = function(req, res, next) {

	if (!req.session.logged || req.session.logged == false)
	{
		console.log('redirecting...');
		res.redirect('/login');
	}
	else
		next();
}

exports.testmiddle = function (req, res, next)
{
	if (req.session)
	{

		res.locals.sess = req.session;
/*
		console.log("REQ SESSION OK");
		if (req.session.userClass == 'student')
		{
			console.log("USERCLASS OK");
			res.locals.userClass = 'student';
			console.log(res.locals.userClass);
		}
		else if (req.session.userClass == 'staff')
		{
			console.log("USERCLASS OK");
			res.locals.userClass = 'staff';
			console.log(res.locals.userClass);
		}
		else if (req.session.userClass == 'bocal')
		{
			res.locals.userCLass = 'bocal';
		}
*/
	}
	next();
}

/*
exports.forkByUserClass = function(req, res, next)
{
	if (req.session)
	{
		if (req.session.route)
		{
			if (req.session.userClass != 'student')
			{
				req.session.route = '/admin_' + req.session.route;
				res.redirect(req.session.route);
			}
		}
	}
}
*/
