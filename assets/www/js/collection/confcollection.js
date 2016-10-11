define(["backbone", "underscore", "model/confmodel"], function(Backbone, _, confModel) {
    var confCollection = Backbone.Collection.extend({
        model: confModel,
		url : "all-response.json",
		search : function(letters){
			if(letters===""){
			return this;
			}
			var pattern = new RegExp(letters,"gi");
			
			return _.filter(this.models, function(item) {
					return pattern.test(item.get("name")); 
			});
						
		}
       //all-room-available.json
	   //http://data.nasa.gov/api/
	   
    });
    return new confCollection;
});