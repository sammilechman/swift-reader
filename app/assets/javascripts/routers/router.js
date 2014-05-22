SpeedReader.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options.$rootEl;
  },

  // <li class="active link-to-reader"><a href="#">Home</a></li>
  // <li class="link-to-user-page"><a href="#">User</a></li>
  // <li class="link-to-contact-page"><a href="#">Contact</a></li>

  routes: {
    "": "index",
    "/": "index",
    "user/:id": "userShow",
    "about": "about",
  },

  about: function() {
    var aboutView = new SpeedReader.Views.WelcomeAbout();
    this._swapView(aboutView);
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