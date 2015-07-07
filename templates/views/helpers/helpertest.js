Handlebars.registerHelper('ticketlist', function(items, options) {
  var out = "<ul>";

  for(var i=0, l=items.length; i<l; i++)
  {
    out = out + "<li>" + items.title + "</li>";
  }

  return out + "</ul>";
});
