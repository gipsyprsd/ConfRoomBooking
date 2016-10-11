define(['backbone','underscore'],function(Backbone, _){
  var confModel = Backbone.Model.extend({
    defaults : {
	},
	initialize : function(){
		//To Always set the room Names if its not fetched from server
		
	}
  
  });
  return confModel;
});