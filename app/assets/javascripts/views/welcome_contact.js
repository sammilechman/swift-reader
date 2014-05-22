SpeedReader.Views.WelcomeContact = Backbone.View.extend({
  template: JST["welcome/contact"],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});