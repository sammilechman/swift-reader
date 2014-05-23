SpeedReader.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.users = options.users;
    this.$rootEl = options.$rootEl;
  },

  // <li class="active link-to-reader"><a href="#">Home</a></li>
  // <li class="link-to-user-page"><a href="#">User</a></li>
  // <li class="link-to-contact-page"><a href="#">Contact</a></li>

  routes: {
    "": "index",
    "/": "index",
    // "user/:id": "userShow",
    "about": "about",
  },

  about: function() {
    var aboutView = new SpeedReader.Views.WelcomeAbout();
    this._swapView(aboutView);
  },

  index: function() {
    var indexView = new SpeedReader.Views.WelcomeIndex({
      collection: this.users
    });
    this._swapView(indexView);
  },

  userShow: function(id) {
    var router = this;
    this._getUser(id, function(user) {
      var userView = new SpeedReader.Views.WelcomeUser({
        model: user
      });
      router._swapView(userView);
    })
  },

  _swapView: function(view) {
    if (this._currentView) {
      this._currentView.remove();
    }

    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  },

  _getUser: function(id, callback) {
    var router = this;
    var user = SpeedReader.users.get(id);
    if (!user) {
      user = new SpeedReader.Models.User({
        id: id
      })
      user.collection = this.users;
      user.fetch({
        success: function() {
          router.users.add(user);
          callback(user);
        }
      });
    } else {
      callback(user);
    }
  },

});