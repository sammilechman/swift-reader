window.SpeedReader = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new SpeedReader.Routers.Router({
      $rootEl: $("#content"),
    });
    Backbone.history.start();
  }
};

// $(document).ready(function(){
//   SpeedReader.initialize();
// });
