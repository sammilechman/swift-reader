window.SpeedReader = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    SpeedReader.users = new SpeedReader.Collections.Users();
    SpeedReader.users.fetch({
      success: function() {
        new SpeedReader.Routers.Router({
          $rootEl: $("#content"),
          users: SpeedReader.users
        });
        Backbone.history.start();
      }
    });
  }
};