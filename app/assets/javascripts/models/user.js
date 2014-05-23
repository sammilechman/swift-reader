SpeedReader.Models.User = Backbone.Model.extend({
  validate: function(attributes) {
    if (!attributes) {
      return "Must have attributes";
    }
  }
});