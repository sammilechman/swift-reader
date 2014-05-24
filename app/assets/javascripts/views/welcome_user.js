SpeedReader.Views.WelcomeUser = Backbone.View.extend({
  template: JST["welcome/user"],

  render: function() {
    console.log("rendering USER")

    var time = this.model.attributes.total_time;

    if (time < 60) {
      var time = time;
      var format = "seconds";
    } else if (time < 3600) {
      var time = (time / 60);
      var format = "minutes";
    } else {
      var time = (time / 3600);
      var format = "hours";
    }

    var renderedContent = this.template({
      user: this.model,
      time: time.toFixed(2),
      format: format
    });
    this.$el.html(renderedContent);
    return this;
  },
});