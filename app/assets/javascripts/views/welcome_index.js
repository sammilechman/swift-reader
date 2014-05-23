SpeedReader.Views.WelcomeIndex = Backbone.View.extend({
  template: JST["welcome/index"],

  tagName: "index",

  initialize: function() {
    this.speed;
    this.wordDelay;
    this.inRenderProcess = false;
  },

  keys: {
    'left up': 'test',
  },

  events: {
    "keyup form input#input-speed-box": "alignSliderAndInput",
    // "keyup form input#input-speed-box": "triggerSliderChange",
    "click form input#speed-select-slider": "alignSliderAndInput",
    "submit form": "handleFormSubmit",
    "click .quote": "handleQuoteClick",
    'keyup #entire-welcome-index': 'test',
    'keypress #entire-welcome-index': 'test',
  },

  test: function(e, name) { alert("You pressed: " + name); },

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  },

  // triggerSliderChange: function() {
  //   $("#input-speed-box").trigger("change");
  // },

  alignSliderAndInput: function(event) {
    // alert("CHANGE")
    var speed = $(event.currentTarget).val();
    console.log(speed);
    $("#input-speed-box").val(speed);
    $("#speed-select-slider").val(speed);
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

    if (this.inRenderProcess) { return; }
    this.inRenderProcess = true;

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

  handleQuoteClick: function(event) {
    event.preventDefault();
    var thisQuote = this.quoteData[event.currentTarget.id];
    var thisSpeed = $(event.currentTarget).data("wpm")

    $("#text-area-box-input").val(thisQuote);
    $("#input-speed-box").val(thisSpeed);
    $("#speed-select-slider").val(thisSpeed);

    $("#text-input-form").submit();
  },

  renderWordsArray: function(wordsArr) {
    var view = this;

    var wordInterval = window.setInterval(function() {
      if (wordsArr.length == 0) {
        window.clearInterval(wordInterval);
        view.inRenderProcess = false;
      }
      shiftOff(wordsArr);
    },this.wordDelay);

    function shiftOff(arr) {
      if (arr.length == 0) {
        $("#reader-words-left").html("Sp");
        $("#reader-words-right").html("<span class='focus-letter'>e</span>edReader");
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

  quoteData: {
    "cj-app-academy": "Back to work!",

    "alec-baldwin-departed": "I’m gonna go have a smoke right now. You want a smoke? You don’t smoke, do ya, right? What are ya, one of those fitness freaks, huh? Go fuck yourself.",

    "the-emperor-jedi": "Everything that has transpired has done so according to my design. Your friends, up there on the sanctuary moon, are walking into a trap, as is your Rebel fleet. It was I who allowed the Alliance to know the location of the shield generator. It is quite safe from your pitiful little band. An entire legion of my best troops awaits them. Oh, I'm afraid the deflector shield will be quite operational when your friends arrive.",

    "ferris-bueller": "The key to faking out the parents is the clammy hands. It's a good non-specific symptom; I'm a big believer in it. A lot of people will tell you that a good phony fever is a dead lock, but, uh... you get a nervous mother, you could wind up in a doctor's office. That's worse than school. You fake a stomach cramp, and when you're bent over, moaning and wailing, you lick your palms. It's a little childish and stupid, but then, so is high school.",

    "denzel-washington": "S.I.S. Detective. Give me 18 months, I'll give you a career. We're an elite unit. We make the big seizures. We make the big arrests. But if you're in my unit, you gotta be in it all the way or not at all. I thought that you was man enough to face that. I guess I was wrong. Five proven, decorated officers say that you're the shooter. The investigators are gonna want to pull a tube of your blood to check for intoxicants, and what are they gonna find, Jake? Do the math. You've been smoking PCP all day, haven't you?",

  },

});