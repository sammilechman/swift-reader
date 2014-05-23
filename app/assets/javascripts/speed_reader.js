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
  attachSubview: function(selector, subview) {
    var subviewToInsert = subview.render();

    this.$(selector).append(subviewToInsert.$el);
    subviewToInsert.delegateEvents();
  },

  removeSubview: function(selector, subview) {
    subview.remove();
  },

});

// $(document).ready(function(){
//   SpeedReader.initialize();
// });
