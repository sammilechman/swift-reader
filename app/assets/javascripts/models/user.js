SpeedReader.Models.User = Backbone.Model.extend({
  urlRoot: "api/users",

  validate: function(attributes) {
    if (!attributes) {
      return "Must have attributes";
    }
  }
});