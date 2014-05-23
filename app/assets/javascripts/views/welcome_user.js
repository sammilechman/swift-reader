SpeedReader.Views.WelcomeUser = Backbone.View.extend({
  template: JST["welcome/user"],

  render: function() {
    console.log("rendering USER")
    var renderedContent = this.template({
      user: this.model
    });
    this.$el.html(renderedContent);
    return this;
  },
});