SpeedReader.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options.$rootEl;
  },

  routes: {
    "": "index",
    "user/:id": "userShow",
  },

  index: function() {
    var indexView = new SpeedReader.Views.WelcomeIndex();
    this._swapView(indexView);
  },

  userShow: function() {
    //Will eventually take ID argument
    var userView = new SpeedReader.Views.WelcomeUser();
    this._swapView(userView);
  },

  _swapView: function(view) {
    if (this._currentView) {
      this._currentView.remove();
    }

    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  },
});