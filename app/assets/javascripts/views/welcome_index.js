SpeedReader.Views.WelcomeIndex = Backbone.View.extend({
  template: JST["welcome/index"],

  initialize: function() {
    this.speed;
    this.wordDelay;
  },

  events: {
    "submit form": "handleFormSubmit"
  },

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  },

  calculateFocusLetter: function(word) {
    var l = word.length;

    if (l < 2) {
      return 0;
    } else if (l < 6) {
      return 1;
    } else if (l < 10) {
      return 2;
    } else if (l < 14) {
      return 3;
    } else {
      return 4;
    }
  },

  calculateWordDelay: function() {
    this.wordDelay = ((60 / this.speed) * 1000);
  },

  handleFormSubmit: function(event) {
    event.preventDefault();

    //The string and speed from the user's input.
    var words = $(event.currentTarget).serializeJSON().text.body;
    var speed = $(event.currentTarget).serializeJSON().text.speed;

    wordsArray = [];
    //Split by any whitespace to form words array.
    //Might be a better way to do this without if statement.
    _(words.split(/\s+/g)).each(function(word) {
      if (word !== "") {
        wordsArray.push(word);
      }
    });

    this.speed = parseInt(speed);
    this.calculateWordDelay();

    return this.renderWordsArray(wordsArray);
  },

  handleFocusLetter: function(word, int) {
    str = [];
    str.push("<span class='focus-letter'>");
    str.push(word.slice(int, int + 1));
    str.push("</span>");
    str.push(word.slice(int + 1));

    //Returns left slice of word, right side with styling span applied.
    return [word.slice(0, int), str.join("")];
  },

  renderWordsArray: function(wordsArr) {
    var view = this;

    var wordInterval = window.setInterval(function() {
      if (wordsArr.length == 0) {
        window.clearInterval(wordInterval);
      }
      shiftOff(wordsArr);
    },this.wordDelay);

    function shiftOff(arr) {
      if (arr.length == 0) {
        $("#reader-words-left").text("");
        $("#reader-words-right").text("");
        return;
      } else {
        var word = arr.shift();
        console.log(word);
        var focusLetterPos = view.calculateFocusLetter(word);
        var words = view.handleFocusLetter(word, focusLetterPos);

        $("#reader-words-left").html(words[0]);
        $("#reader-words-right").html(words[1]);
      }
    };
  },

});