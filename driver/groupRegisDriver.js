var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var ActRegis = keystone.list('ActivityRegistration');
var GroupRegis = keystone.list('GroupRegistration');
var Activity = keystone.list('Activity');
var User = keystone.list('User');

var groupRegisDriver = function () {};

groupRegisDriver.prototype.create = function () {

};

exports.groupRegisDriver = groupRegisDriver;
