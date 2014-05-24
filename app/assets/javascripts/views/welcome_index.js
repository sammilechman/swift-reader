SpeedReader.Views.WelcomeIndex = Backbone.CompositeView.extend({
  template: JST["welcome/index"],

  tagName: "index",

  initialize: function() {
    this.speed;
    this.wordDelay;
    this.inRenderProcess = false;
    this.currentProgress = 0;
    this.currentWordsArray = [];
    this.sessionTotalWordsRead = 0;
    this.subviews = [];
    this.setUpBindings();
    this.userId = ($("body").attr("data-id") || -1);
  },

  render: function() {
    var renderedContent = this.template({
      users: this.collection
    });
    this.$el.html(renderedContent);
    return this;
  },

  // triggerSliderChange: function() {
  //   $("#input-speed-box").trigger("change");
  // },

  events: {
    "change form input#input-speed-box": "alignSliderAndInput",
    // "keyup form input#input-speed-box": "triggerSliderChange",
    "click form input#speed-select-slider": "alignSliderAndInput",
    "submit form": "handleFormSubmit",
    "click .quote": "handleQuoteClick",
  },

  keys: {
    'left right up down space': 'handleKeyboardInput',
  },

  alterSpeed: function(direction){
    window.clearInterval(wordInterval);

    if (direction === "pause" && this.inRenderProcess) {
      this.inRenderProcess = false;

    } else if (direction === "pause" && !this.inRenderProcess) {
      this.calculateSpeed();
      this.renderWordsArray(this.currentWordsArray, this.currentProgress);

    } else if (direction === "slower" || direction === "faster") {
      if (direction === "slower") {
        var newSpeed = parseInt($("#input-speed-box").val()) - 5;
      } else {
        var newSpeed = parseInt($("#input-speed-box").val()) + 5;
      }

      $("#input-speed-box").val(newSpeed);
      this.calculateSpeed();

      if (this.inRenderProcess) {
        this.renderWordsArray(this.currentWordsArray, this.currentProgress);
      }
    }
  },

  alterUserStats: function(numWords) {
    var user = this.collection.get(this.userId);

    var tw = user.attributes.total_words += numWords;
    var tt = user.attributes.total_time += (numWords / this.speed);
    var as = user.attributes.average_speed = (user.attributes.total_words / user.attributes.total_time);

    user.save({total_words: tw, total_time: tt, average_speed: as}, {
      success: function() {
        console.log("SUCCESS");
        debugger;
      }
    })
  },

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

  calculateSpeed: function() {
    this.speed = parseInt($("#input-speed-box").serializeJSON().text.speed);
    this.calculateWordDelay();
  },

  calculateWordDelay: function() {
    this.wordDelay = ((60 / this.speed) * 1000);
  },

  handleFormSubmit: function(event) {
    event.preventDefault();

    if (this.inRenderProcess) { return; }

    //The string and speed from the user's input.
    var words = $(event.currentTarget).serializeJSON().text.body;
    var speed = this.calculateSpeed();

    wordsArray = [];
    //Split by any whitespace to form words array.
    //Might be a better way to do this without if statement.
    _(words.split(/\s+/g)).each(function(word) {
      if (word !== "") {
        wordsArray.push(word);
      }
    });

    this.currentWordsArray = wordsArray;

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

  handleKeyboardInput: function(event, name){
    switch(name) {
    case "space":
      this.alterSpeed("pause");
      break;
    case "left":
      this.alterSpeed("slower");
      break;
    case "right":
      this.alterSpeed("faster");
      break;
    case "up":
      alert("UP");
      break;
    case "down":
      alert("DOWN");
      break;
    }
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

  renderWordsArray: function(wordsArr, startingPos) {
    var view = this;
    this.inRenderProcess = true;

    if (typeof(startingPos)==='undefined') startingPos = 0;
    wordsArr.slice(startingPos);

    wordInterval = window.setInterval(function() {
      if (wordsArr.length == 0) {
        view.alterUserStats(view.currentProgress);
        view.currentProgress = 0;

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

        //We need to track progress so that we can pause/resume/change speed.
        view.currentProgress++;
      }
    };
  },

  setUpBindings: function() {
    var view = this;
    var about = $(".link-to-about-page");
    var user = $(".link-to-user-page");

    about.on("click", function(event) {
      event.preventDefault();
      view.subviewAboutShow();
    });
    user.on("click", function(event) {
      event.preventDefault();
      view.subviewUserShow();
    });
  },

  subviewUserShow: function() {
    _(this.subviews).each(function(subview) {
      subview.remove();
    });
    var container = "#bottom-center-container";
    // var userShowView = new SpeedReader.Views.WelcomeUser();

    var user = this.collection.get(this.userId);
    var userShowView = new SpeedReader.Views.WelcomeUser({
        model: user
    });

    this.subviews.push(userShowView);

    this.attachSubview(container, userShowView);
  },

  subviewAboutShow: function(){
    _(this.subviews).each(function(subview) {
      subview.remove();
    });
    var container = "#bottom-center-container";
    var aboutShowView = new SpeedReader.Views.WelcomeAbout();
    this.subviews.push(aboutShowView);

    this.attachSubview(container, aboutShowView);
  },

  quoteData: {
    "cj-app-academy": "Back to work!",

    "alec-baldwin-departed": "I’m gonna go have a smoke right now. You want a smoke? You don’t smoke, do ya, right? What are ya, one of those fitness freaks, huh? Go fuck yourself.",

    "the-emperor-jedi": "Everything that has transpired has done so according to my design. Your friends, up there on the sanctuary moon, are walking into a trap, as is your Rebel fleet. It was I who allowed the Alliance to know the location of the shield generator. It is quite safe from your pitiful little band. An entire legion of my best troops awaits them. Oh, I'm afraid the deflector shield will be quite operational when your friends arrive.",

    "ferris-bueller": "The key to faking out the parents is the clammy hands. It's a good non-specific symptom; I'm a big believer in it. A lot of people will tell you that a good phony fever is a dead lock, but, uh... you get a nervous mother, you could wind up in a doctor's office. That's worse than school. You fake a stomach cramp, and when you're bent over, moaning and wailing, you lick your palms. It's a little childish and stupid, but then, so is high school.",

    "denzel-washington": "S.I.S. Detective. Give me 18 months, I'll give you a career. We're an elite unit. We make the big seizures. We make the big arrests. But if you're in my unit, you gotta be in it all the way or not at all. I thought that you was man enough to face that. I guess I was wrong. Five proven, decorated officers say that you're the shooter. The investigators are gonna want to pull a tube of your blood to check for intoxicants, and what are they gonna find, Jake? Do the math. You've been smoking PCP all day, haven't you?",

  },

});