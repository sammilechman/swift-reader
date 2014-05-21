SpeedReader.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options.$rootEl;
    alert("HI");
  },

  routes: {
    "": "index",
  },

  index: function() {
    var indexView = new SpeedReader.Views.WelcomeIndex();
    this._swapView(indexView);
  },

  _swapView: function(view) {
    if (this._currentView) {
      this._currentView.remove();
    }

    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  },
});