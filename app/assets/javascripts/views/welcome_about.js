SpeedReader.Views.WelcomeAbout = Backbone.View.extend({
  template: JST["welcome/about"],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});