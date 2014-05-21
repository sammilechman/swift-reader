SpeedReader.Views.WelcomeIndex = Backbone.View.extend({
  template: JST["welcome/index"],

  initialize: function() {
    this.speed;
    this.wordDelay;
  },

  events: {
    "submit form": "handleFormSubmit",
  },

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  },

  calculateWordDelay: function() {
    console.log(60 / this.speed);
  },

  handleFormSubmit: function(event) {
    event.preventDefault();
    wordsArray = [];

    //The string and speed from the user's input.
    var words = $(event.currentTarget).serializeJSON().text.body;
    var speed = $(event.currentTarget).serializeJSON().text.speed;

    //Split by any whitespace to form words array.
    _(words.split(/\s+/g)).each(function(word) {
      wordsArray.push(word);
    });

    this.speed = parseInt(speed);
    this.calculateWordDelay();

    return this.handleWordsArray(wordsArray);
  },

  handleWordsArray: function(arr) {
    _(arr).each(function(word) { console.log(word) });
  },

});