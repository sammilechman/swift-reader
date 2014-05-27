SpeedReader.Views.WelcomeIndex = Backbone.View.extend({
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
    this.setUpDeadLinks();
    this.userId = ($("body").attr("data-id") || -1);
  },

  render: function() {
    var renderedContent = this.template({
      users: this.collection
    });
    this.$el.html(renderedContent);
    return this;
  },

  events: {
    "change form input#input-speed-box": "alignSpeed",
    "submit form": "handleFormSubmit",
    "click .left-sample-button": "handleQuoteClick",
    "click button": "loseFocus",
  },

  loseFocus: function() {

    $("#reader-input-container").focus();
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
      this.alignSpeedBar();

      if (this.inRenderProcess) {
        this.renderWordsArray(this.currentWordsArray, this.currentProgress);
      }
    }
  },

  alterUserStats: function(numWords) {
    var view = this;
    var user = this.collection.get(this.userId);

    var tw = user.attributes.total_words += numWords;
    var tt = user.attributes.total_time += (numWords / (this.speed / 60));
    var as = user.attributes.average_speed = (user.attributes.total_words / (user.attributes.total_time / 60));

    user.save({total_words: tw, total_time: tt, average_speed: as.toFixed(2)}, {
      success: function() {
        view.render();
      }
    })
  },

  alignSpeed: function(event) {
    // alert("CHANGE")
    var speed = $(event.currentTarget).val();
    console.log(speed);
    $("#input-speed-box").val(speed);
    this.alignSpeedBar();
  },

  alignSpeedBar: function() {
    $("#progress-bar").progressbar("option", "value", this.speed/10);
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
    this.alignSpeedBar();

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

    $("#text-input-form").submit();
    $(event.currentTarget).blur();
  },

  renderWordsArray: function(wordsArr, startingPos) {
    var view = this;
    this.inRenderProcess = true;

    if (typeof(startingPos)==='undefined') startingPos = 0;
    wordsArr.slice(startingPos);

    wordInterval = window.setInterval(function() {
      if (wordsArr.length == 0) {
        if (view.userId !== -1) {
          view.alterUserStats(view.currentProgress);
        }

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

  setUpDeadLinks: function() {
    var link = $(".dead-link");

    link.on("click", function(event) {
      event.preventDefault();
    });
  },

  quoteData: {
    "cj-app-academy": "Back to work!",

    "alec-baldwin-departed": "I’m gonna go have a smoke right now. You want a smoke? You don’t smoke, do ya, right? What are ya, one of those fitness freaks, huh? Go fuck yourself.",

    "the-emperor-jedi": "Everything that has transpired has done so according to my design. Your friends, up there on the sanctuary moon, are walking into a trap, as is your Rebel fleet. It was I who allowed the Alliance to know the location of the shield generator. It is quite safe from your pitiful little band. An entire legion of my best troops awaits them. Oh, I'm afraid the deflector shield will be quite operational when your friends arrive.",

    "ferris-bueller": "The key to faking out the parents is the clammy hands. It's a good non-specific symptom; I'm a big believer in it. A lot of people will tell you that a good phony fever is a dead lock, but, uh... you get a nervous mother, you could wind up in a doctor's office. That's worse than school. You fake a stomach cramp, and when you're bent over, moaning and wailing, you lick your palms. It's a little childish and stupid, but then, so is high school.",

    "harry-potter": "There was a clatter as the basilisk fangs cascaded out of Hermione's arms. Running at Ron, she flung them around his neck and kissed him full on the mouth. Ron threw away the fangs and broomstick he was holding and responded with such enthusiasm that he lifted Hermione off her feet. \"Is this the moment?\" Harry asked weakly, and when nothing happened except that Ron and Hermione gripped each other still more firmly and swayed on the spot, he raised his voice. \"OI! There's a war going on here!\" Ron and Hermione broke apart, their arms still around each other. \"I know, mate,\" said Ron, who looked as though he had recently been hit on the back of the head with a Bludger, \"so it's now or never, isn't it?\" \"Never mind that, what about the Horcrux?\" Harry shouted. \"D'you think you could just --- just hold it in, until we've got the diadem?\" \"Yeah --- right --- sorry ---\" said Ron, and he and Hermione set about gathering up fangs, both pink in the face."

  },

});