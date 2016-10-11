require.config({
paths: {
jquery : "lib/jquery/jquery",
underscore : "lib/underscore/underscore",
backbone : "lib/backbone/backbone",
backbonecross : "lib/backbone/backbone.crossdomain",
text : "lib/require/text"
}
});

require(['views/app'], function(AppView){
  
  var app_view = new AppView;
});