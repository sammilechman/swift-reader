SpeedReader.Models.User = Backbone.User.extend({
  validate: function(attributes) {
    if (!attributes) {
      return "Must have attributes";
    }
  }
});