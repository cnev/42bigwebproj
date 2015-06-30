  var keystone = require('keystone');
keystone.init({

  'name': '42-Intra',
  'brand': '3mythicsstilllosing.fr:(',

  'favicon': 'public/favicon.ico',
  'less': 'public',
  'static': ['public'],

  'views': 'templates/views',
  'view engine': 'jade',

  'auto update': true,
  'mongo': 'mongodb://localhost:27017',

  'session': true,
  'auth': true,
  'user model': 'User',
  'cookie secret': '(your secret here)',

  'headless': true

});

require('./models');

keystone.set('routes', require('./routes'));

keystone.start();
