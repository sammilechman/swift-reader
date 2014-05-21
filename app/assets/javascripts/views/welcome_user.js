SpeedReader.Views.WelcomeUser = Backbone.View.extend({
  template: JST["welcome/user"],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  },
});