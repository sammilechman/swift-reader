SpeedReader.Views.WelcomeIndex = Backbone.View.extend({
  template: JST["welcome/index"],

  render: function() {
    alert("hi");
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});