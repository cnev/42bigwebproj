var moment = require('moment');
var _ = require('underscore');
var hbs = require('handlebars');
var keystone = require('keystone');
var cloudinary = require('cloudinary');
var express = require('express');
var session = require('express-session');
var dateForm = require("date-format-lite")
// Declare Constants
var CLOUDINARY_HOST = 'http://res.cloudinary.com';

// Collection of templates to interpolate
var linkTemplate = _.template('<a href="<%= url %>"><%= text %></a>');
var scriptTemplate = _.template('<script src="<%= src %>"></script>');
var cssLinkTemplate = _.template('<link href="<%= href %>" rel="stylesheet">');
var cloudinaryUrlLimit = _.template(CLOUDINARY_HOST + '/<%= cloudinaryUser %>/image/upload/c_limit,f_auto,h_<%= height %>,w_<%= width %>/<%= publicId %>.jpg');


module.exports = function() {

	var _helpers = {};

	/**
	 * Generic HBS Helpers
	 * ===================
	 */

	// standard hbs equality check, pass in two values from template
	// {{#ifeq keyToCheck data.myKey}} [requires an else blockin template regardless]
	_helpers.ifeq = function(a, b, options) {
		if (a == b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	/**
	 * Port of Ghost helpers to support cross-theming
	 * ==============================================
	 *
	 * Also used in the default keystonejs-hbs theme
	 */

	// ### Date Helper
	// A port of the Ghost Date formatter similar to the keystonejs - jade interface
	//
	//
	// *Usage example:*
	// `{{date format='MM YYYY}}`
	// `{{date publishedDate format='MM YYYY'`
	//
	// Returns a string formatted date
	// By default if no date passed into helper than then a current-timestamp is used
	//
	// Options is the formatting and context check this.publishedDate
	// If it exists then it is formated, otherwise current timestamp returned

	_helpers.date = function(context, options) {
		if (!options && context.hasOwnProperty('hash')) {
			options = context;
			context = undefined;

			if (this.publishedDate) {
				context = this.publishedDate;
			}
		}

		// ensure that context is undefined, not null, as that can cause errors
		context = context === null ? undefined : context;

		var f = options.hash.format || 'MMM Do, YYYY',
		    timeago = options.hash.timeago,
		    date;

		// if context is undefined and given to moment then current timestamp is given
		// nice if you just want the current year to define in a tmpl
		if (timeago) {
			date = moment(context).fromNow();
		} else {
			date = moment(context).format(f);
		}
		return date;
	};

	// ### Category Helper
	// Ghost uses Tags and Keystone uses Categories
	// Supports same interface, just different name/semantics
	//
	// *Usage example:*
	// `{{categoryList categories separator=' - ' prefix='Filed under '}}`
	//
	// Returns an html-string of the categories on the post.
	// By default, categories are separated by commas.
	// input. categories:['tech', 'js']
	// output. 'Filed Undder <a href="blog/tech">tech</a>, <a href="blog/js">js</a>'

	_helpers.categoryList = function(categories, options) {
		var autolink = _.isString(options.hash.autolink) && options.hash.autolink === "false" ? false : true,
		    separator = _.isString(options.hash.separator) ? options.hash.separator : ', ',
		    prefix = _.isString(options.hash.prefix) ? options.hash.prefix : '',
		    suffix = _.isString(options.hash.suffix) ? options.hash.suffix : '',
		    output = '';

		function createTagList(tags) {
			var tagNames = _.pluck(tags, 'name');

			if (autolink) {
				return _.map(tags, function(tag) {
						return linkTemplate({
url: ('/blog/' + tag.key),
text: _.escape(tag.name)
});
						}).join(separator);
}
return _.escape(tagNames.join(separator));
}

if (categories && categories.length) {
	output = prefix + createTagList(categories) + suffix;
}
return new hbs.SafeString(output);
};

/* To Implement [Ghost Helpers](http://docs.ghost.org/themes/#helpers)
 * The [source](https://github.com/TryGhost/Ghost/blob/master/core/server/helpers/index.js)
 *
 * * `Foreach` Extended Helper
 * * `Asset` Helper
 * * `Content` Helper
 * * `Excerpt` Helper
 * * `Has` Helper
 * * `Encode` Helper
 * * Pagination
 * * BodyClass
 * * PostClass
 * * meta_title
 * * meta_description
 * * ghost_[footer/header]
 *
 */

/**
 * KeystoneJS specific helpers
 * ===========================
 */

// block rendering for keystone admin css
_helpers.isAdminEditorCSS = function(user, options) {
	var output = '';
	if (typeof(user) !== 'undefined' && user.isAdmin) {
		output = cssLinkTemplate({
href: "/keystone/styles/content/editor.min.css"
});
}
return new hbs.SafeString(output);
};

// block rendering for keystone admin js
_helpers.isAdminEditorJS = function(user, options) {
	var output = '';
	if (typeof(user) !== 'undefined' && user.isAdmin) {
		output = scriptTemplate({
src: '/keystone/js/content/editor.js'
});
}
return new hbs.SafeString(output);
};

// Used to generate the link for the admin edit post button
_helpers.adminEditableUrl = function(user, options) {
	var rtn = keystone.app.locals.editable(user, {
			'list': 'Post',
			'id': options
			});
	return rtn;
};

// ### CloudinaryUrl Helper
// Direct support of the cloudinary.url method from Handlebars (see
// cloudinary package documentation for more details).
//
// *Usage examples:*
// `{{{cloudinaryUrl image width=640 height=480 crop='fill' gravity='north'}}}`
// `{{#each images}} {{cloudinaryUrl width=640 height=480}} {{/each}}`
//
// Returns an src-string for a cloudinary image

_helpers.cloudinaryUrl = function(context, options) {

	// if we dont pass in a context and just kwargs
	// then `this` refers to our default scope block and kwargs
	// are stored in context.hash
	if (!options && context.hasOwnProperty('hash')) {
		// strategy is to place context kwargs into options
		options = context;
		// bind our default inherited scope into context
		context = this;
	}

	// safe guard to ensure context is never null
	context = context === null ? undefined : context;

	if ((context) && (context.public_id)) {
		var imageName = context.public_id.concat('.',context.format);
		return cloudinary.url(imageName, options.hash);
	}
	else {
		return null;
	}
};

// ### Content Url Helpers
// KeystoneJS url handling so that the routes are in one place for easier
// editing.  Should look at Django/Ghost which has an object layer to access
// the routes by keynames to reduce the maintenance of changing urls

// Direct url link to a specific post
_helpers.postUrl = function(postSlug, options) {
	return ('/blog/post/' + postSlug);
};

// might be a ghost helper
// used for pagination urls on blog
_helpers.pageUrl = function(pageNumber, options) {
	return '/blog?page=' + pageNumber;
};

// create the category url for a blog-category page
_helpers.categoryUrl = function(categorySlug, options) {
	return ('/blog/' + categorySlug);
};

// ### Pagination Helpers
// These are helpers used in rendering a pagination system for content
// Mostly generalized and with a small adjust to `_helper.pageUrl` could be universal for content types

/*
 * expecting the data.posts context or an object literal that has `previous` and `next` properties
 * ifBlock helpers in hbs - http://stackoverflow.com/questions/8554517/handlerbars-js-using-an-helper-function-in-a-if-statement
 * */
_helpers.ifHasPagination = function(postContext, options){
	// if implementor fails to scope properly or has an empty data set
	// better to display else block than throw an exception for undefined
	if(_.isUndefined(postContext)){
		return options.inverse(this);
	}
	if(postContext.next || postContext.previous){
		return options.fn(this);
	}
	return options.inverse(this);
};

_helpers.paginationNavigation = function(pages, currentPage, totalPages, options){
	var html = '';

	// pages should be an array ex.  [1,2,3,4,5,6,7,8,9,10, '....']
	// '...' will be added by keystone if the pages exceed 10
	_.each(pages, function(page, ctr){
			// create ref to page, so that '...' is displayed as text even though int value is required
			var pageText = page,
			// create boolean flag state if currentPage
			isActivePage = ((page === currentPage)? true:false),
			// need an active class indicator
			liClass = ((isActivePage)? ' class="active"':'');

			// if '...' is sent from keystone then we need to override the url
			if(page === '...'){
			// check position of '...' if 0 then return page 1, otherwise use totalPages
			page = ((ctr)? totalPages:1);
			}

			// get the pageUrl using the integer value
			var pageUrl = _helpers.pageUrl(page);
			// wrapup the html
			html += '<li'+liClass+'>'+ linkTemplate({url:pageUrl,text:pageText})+'</li>\n';
			});
	return html;
};

// special helper to ensure that we always have a valid page url set even if
// the link is disabled, will default to page 1
_helpers.paginationPreviousUrl = function(previousPage, totalPages){
	if(previousPage === false){
		previousPage = 1;
	}
	return _helpers.pageUrl(previousPage);
};

// special helper to ensure that we always have a valid next page url set
// even if the link is disabled, will default to totalPages
_helpers.paginationNextUrl = function(nextPage, totalPages){
	if(nextPage === false){
		nextPage = totalPages;
	}
	return _helpers.pageUrl(nextPage);
};


//  ### Flash Message Helper
//  KeystoneJS supports a message interface for information/errors to be passed from server
//  to the front-end client and rendered in a html-block.  FlashMessage mirrors the Jade Mixin
//  for creating the message.  But part of the logic is in the default.layout.  Decision was to
//  surface more of the interface in the client html rather than abstracting behind a helper.
//
//  @messages:[]
//
//  *Usage example:*
//  `{{#if messages.warning}}
//      <div class="alert alert-warning">
//          {{{flashMessages messages.warning}}}
//      </div>
//   {{/if}}`

_helpers.flashMessages = function(messages) {
	var output = '';
	/*for (var i = 0; i < messages.length; i++) {

		if (messages[i].title) {
			output += '<h4>' + messages[i].title + '</h4>';
		}

		if (messages[i].detail) {
			output += '<p>' + messages[i].detail + '</p>';
		}

		if (messages[i].list) {
			output += '<ul>';
			for (var ctr = 0; ctr < messages[i].list.length; ctr++) {
				output += '<li>' + messages[i].list[ctr] + '</li>';
			}
			output += '</ul>';
		}
	}
	console.log("flash-output="+output);*/
	output = '<p>'+messages+'</p>';
	return new hbs.SafeString(output);
};

_helpers.pitiTest = function(tickets)
{
	var output = '<div class="container">';
	output += '<div class="page-header">TICKETS</div>';
	for (var i = 0; i < tickets.length; i++)
	{
		output += '<p><button class="btn btn-lg btn-danger" type="button">';
		output += tickets[i].content;
		output += '</button></p>';
	}
	output += '</div>';
	return new hbs.SafeString(output);
};

_helpers.userNav = function(userClass)
{
	var output =  '<div class="container">';
	if (userClass == 'student')
	{
		output += '<div class="page-header">STUDENTOR</div>';
		output += '<p><button class="btn btn-lg btn-danger" type="button">HI !</button></p>';
		output += '<p><button class="btn btn-lg btn-danger" type="button">STUDENT !</button></p>';
	}
	else if (userClass == 'admin')
	{
		output += '<div class="page-header">STAFFATOR</div>';
		output += '<p><button class="btn btn-lg btn-danger" type="button">HI !</button></p>';
		output += '<p><button class="btn btn-lg btn-danger" type="button">STAFF !</button></p>';
	}
	output += '</div>';
	return new hbs.SafeString(output);
}

_helpers.displayModuleList = function(module, isAdmin)
{
	var output = '';
	var admin = (isAdmin) ? '/admin' : '';
	output += '<a class="btn btn-info" role="button" href="'+admin+'/module/view/'+module.name+'">'+module.name+'</a>';
	if (!isAdmin)
		output += '<a class="btn btn-info" role="button" href="/module/register/'+module.name+'">Register ?</a>';
	return new hbs.SafeString(output);
}

_helpers.displayActivityList = function(activity, isAdmin)
{
	var output = '';
	var admin = (isAdmin) ? '/admin' : '';
	output += '<a class="btn btn-default pull-left" role="button" href="'+admin+'/activity/view/'+activity.name+'">'+activity.name+'</a>';
	if (!isAdmin)
		output += '<a class="btn btn-default pull-right" role="button" href="/activity/register/'+activity.name+'">Register ?</a>';
	return new hbs.SafeString(output);
}

_helpers.ActivityViewRef = function(activity, isAdmin)
{
	var output = '';
	var admin = (isAdmin) ? '/admin' : '';
	output += admin+'/activity/view/'+activity.name;
	return new hbs.SafeString(output);
}

_helpers.ActivityRegisterRef = function(activity, isAdmin)
{
	var output = '';
	var admin = (isAdmin) ? '/admin' : '';
	if (!isAdmin)
	{
		output += '/activity/register/'+activity.name;
		return new hbs.SafeString(output);
	}
}

_helpers.DateForm = function(dd)
{
	return new hbs.SafeString(dd.date("DD-MM-YYYY mm:hh"))
}

_helpers.form_listModules = function(modlist)
{
	var output = '';
	for (var i = 0; i < modlist.length; i++){
		output += '<option value="'+modlist[i]._id+'">'+modlist[i].name+'</option>';
		if (i == modlist.length - 1)
			return new hbs.SafeString(output);
	}
}

_helpers.form_listModules_checkSelected = function(modlist, module){
	var output = '';
	var selected = ' selected ';
	console.log(module);
	for (var i = 0; i < modlist.length; i++){
		if (module.name == modlist[i].name){
			output += '<option value="'+modlist[i]._id+'"'+selected+'>'+modlist[i].name+'</option>';
		}
		else {
			console.log('gotchapa '+modlist[i].name);
			output += '<option value="'+modlist[i]._id+'">'+modlist[i].name+'</option>';
		}
		if (i == modlist.length - 1)
			return new hbs.SafeString(output);
	}
}

_helpers.form_listActivities = function(actlist)
{
	var output = '';
	for (var i = 0; i < actlist.length; i++){
		output += '<option value="'+actlist[i]._id+'">'+actlist[i].name+'</option>';
		if (i == actlist.length - 1)
			return new hbs.SafeString(output);
	}
}

_helpers.addPlaceholder = function(val)
{
	var output = 'value="';
	output += val;
	output += '"';
	return new hbs.SafeString(output);
}

_helpers.addDateholder = function(val)
{
	var date = new Date(val);
	var output = 'value="';
	console.log(date.toUTCString());
	console.log(date.toISOString());
	output += date.toISOString().substr(0,16)+'"';
	return new hbs.SafeString(output);
}

_helpers.forumCategoryList = function(list){
	if (!list)
		return ('');
	var output = '';
	for (var i = 0; i < list.length; i++){
		output += '<option value="'+list[i]._id+'">'+list[i].name+'</option>';
		if (i == list.length - 1)
			return new hbs.SafeString(output);
	}
}

_helpers.ticketCategoryList = function(list){
	if (!list)
		return ('');
	var output = '';
	for (var i = 0; i < list.length; i++){
		output += '<option value="'+list[i]._id+'">'+list[i].name+'</option>';
		if (i == list.length - 1)
			return new hbs.SafeString(output);
	}
}

function ticketOverviewButton(ticket, admin_id) {
	if (ticket.state == 'closed')
		return ('<button class="btn btn-danger">Ticket closed</button>');
	else if (ticket.state == 'locked' && ticket.openedBy != admin_id)
		return ('<button class="btn btn-warning">Ticket locked</button>');
	else
		return ('<a href="/admin/ticket/view/'+ticket._id+'" class="btn btn-info" role="button">Handle this</a>');
}

function pushTicket(ticket, i, cb) {
	var out = '<div class="panel panel-default">'
	+'<div class="panel-heading">'+'<h1>'+data.tickets[i].title+'</h1></div>'
	+'<div class="panel-body">'
	+'<p>'+data.tickets[i].state+'>/p>'
	+'<p>Written by '+data.tickets[i].author+' at '+data.tickets[i].createdAt+'</p>'
	+'<p>'+data.tickets[i].content+'>/p>'
	+'<p>'+data.tickets[i].priority+'>/p>'
	+ticketOverviewButton(data.tickets[i], data.admin_id)
	+'</div></div>';
}

_helpers.ticketOverview = function(data){
	var output = '';
	for (var i = 0; i > data.tickets.length; i++) {
		output += pushTicket(output, data.tickets[i], i, function (err, ok){

		});

		if (i == data.ticket.length - 1){
			return new hbs.SafeString(output);
		}
	}
}

_helpers.projectgroup_registration = function(size) {
	var output = '';
	for (var i = 0; i < size; i++){
		output += '<div class="form-group"';
		//output += '<label for="uid'+i+'">Member #'+i+'</label>';
		//output += '<input type="text" name="uid'+i+'">';
		output += '<label for="members">Member #'+i+'</label>';
		output += '<input type="text" name="members">';
		output += '</div>';
		if (i == size - 1)
			return new hbs.SafeString(output);
	}

}

return _helpers;
};
