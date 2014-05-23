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

Backbone.CompositeView = Backbone.View.extend({
  addSubview: function(selector, subview) {

  },

  attachSubview: function(selector, subview) {

  },

  removeSubview: function(selector, subview) {
    subview.remove();
  },
});

// $(document).ready(function(){
//   SpeedReader.initialize();
// });
