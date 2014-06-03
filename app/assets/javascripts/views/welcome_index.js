SpeedReader.Views.WelcomeIndex = Backbone.View.extend({
  template: JST["welcome/index"],

  tagName: "index",

  initialize: function() {
    this.speed = 220;
    this.wordDelay;
    this.inRenderProcess = false;
    this.inputBox = $("#input-speed-box");
    this.currentProgress = 0;
    this.currentWordsArray = [];
    this.sessionTotalWordsRead = 0;
    this.setUpDeadLinks();
    this.userId = ($("body").attr("data-id") || -1);
    this.wordInterval;
  },

  render: function() {
    var renderedContent = this.template({
      users: this.collection,
      speed: this.speed
    });
    this.$el.html(renderedContent);

    this.$("#text-area-box-input").val($("#hidden-listener").val());

    return this;
  },

  events: {
    "change form input#input-speed-box": "alignSpeed",
    "submit form": "handleFormSubmit",
    "click .left-sample-button": "handleQuoteClick",
    "click .control-button": "handleControlClick",
    "click .wpm-picker": "handleWPMClick",
    "click button#start-button": "changeStartButtonColor",
  },

  handleWPMClick: function(event) {
    event.preventDefault();
    $("#input-speed-box").val(event.currentTarget.id);
    this.setWPMIndicator();
    if (this.inRenderProcess) {
      //This double-pause is a workaround. Results in instant speed change.
      this.alterSpeed("pause");
      this.alterSpeed("pause");
    }
  },

  keys: {
    'left right': 'handleKeyboardInput',
  },

  alterSpeed: function(direction){
    this.attemptClearInterval();

    if (direction === "pause" && this.inRenderProcess) {
      this.inRenderProcess = false;

    } else if (direction === "pause" && !this.inRenderProcess) {
      this.calculateSpeed();
      if (this.currentWordsArray.length === 0) {
        this.handleFormSubmit();
      } else {
        this.renderWordsArray(this.currentWordsArray, this.currentProgress);
      }

    } else if (direction === "slower" || direction === "faster") {
      if (direction === "slower") {
        var newSpeed = parseInt($("#input-speed-box").val()) - 5;
      } else {
        var newSpeed = parseInt($("#input-speed-box").val()) + 5;
      }

      $("#input-speed-box").val(newSpeed);
      this.calculateSpeed();
      this.setWPMIndicator();

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
    var speed = $(event.currentTarget).val();
    $("#input-speed-box").val(speed);
  },

  attemptClearInterval: function() {
    if (this.wordInterval !== undefined) {
      window.clearInterval(this.wordInterval);
    }
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

  changeStartButtonColor: function() {
    if (this.currentWordsArray.length === 0) { return; }

    if ($("#start-button").css("background-color") === "rgb(192, 192, 192)") {
      $("#start-button").css({"background-color":"#A9BFD2"});
    } else {
      $("#start-button").css({"background-color":"rgb(192, 192, 192)"});
    }

    $("#start-button").blur();
  },

  handleFormSubmit: function(event) {
    //The string and speed from the user's input.
    var words = $("#text-area-box-input").serializeJSON().text.body;

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

  handleControlClick: function(event) {
    event.preventDefault();
    var action = event.currentTarget.id;

    switch(action) {
    case "start-button":
      this.alterSpeed("pause");
      break;
    case "faster-button":
      this.alterSpeed("faster");
      break;
    case "slower-button":
      this.alterSpeed("slower");
      break;
    case "reset-button":
      $("#text-area-box-input").val($("#hidden-listener").val(""));
      // This is a workaround - prevents bug that would render from paused.
      this.inRenderProcess = true;

      this.alterSpeed("pause");
      Backbone.history.loadUrl();
      break;
    }
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
    case "left":
      this.alterSpeed("slower");
      break;
    case "right":
      this.alterSpeed("faster");
      break;
    }
  },

  handleQuoteClick: function(event) {
    event.preventDefault();
    var thisQuote = this.quoteData[event.currentTarget.id];
    var thisSpeed = $(event.currentTarget).data("wpm");

    this.currentWordsArray = [];
    this.inRenderProcess = false;

    $("#text-area-box-input").val(thisQuote);
    $("#input-speed-box").val(thisSpeed);

    $("#start-button").click();
  },

  setWPMIndicator: function() {
    var content = $("#input-speed-box").serializeJSON().text.speed;
    $("#wpm-indicator").html(content + " wpm")
  },

  renderWordsArray: function(wordsArr, startingPos) {
    var view = this;

    this.setWPMIndicator();
    this.inRenderProcess = true;

    if (typeof(startingPos)==='undefined') startingPos = 0;
    wordsArr.slice(startingPos);

    view.wordInterval = window.setInterval(function() {
      if (wordsArr.length == 0) {
        if (view.userId !== -1) {
          view.alterUserStats(view.currentProgress);
        }

        view.currentProgress = 0;

        window.clearInterval(view.wordInterval);

        view.inRenderProcess = false;
      }
      shiftOff(wordsArr);
    },this.wordDelay);

    function shiftOff(arr) {
      if (arr.length <= 0) {
        return;
      } else {
        var word = arr.shift();
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

    var userShow = $("#userShowModal");
    userShow.on("click", function(event) {
      event.preventDefault();
    });

    this.speed = $("#hidden-speed").data("speed");
  },

  quoteData: {
    "cj-app-academy": "Back to work!",

    "snowden": "Edward Joseph \"Ed\" Snowden, born June 21, 1983, is an American computer professional. A former systems administrator for the Central Intelligence Agency (CIA) and a counter intelligence trainer at the Defense Intelligence Agency, he later went to work for the private intelligence contractor Dell, inside a National Security Agency (NSA) outpost in Japan. In early 2013, he joined the consulting firm Booz Allen Hamilton inside the NSA center in Hawaii. He came to international attention in June 2013 after disclosing to several media outlets thousands of classified documents that he acquired while working as an NSA contractor for Dell and Booz Allen Hamilton. Snowden's release of classified material has been described as the most significant leak in U.S. history by Pentagon Papers leaker Daniel Ellsberg.",

    "obama": "Barack Hussein Obama II, born August 4, 1961, is the 44th and current President of the United States, and the first African American to hold the office. Born in Honolulu, Hawaii, Obama is a graduate of Columbia University and Harvard Law School, where he served as president of the Harvard Law Review. He was a community organizer in Chicago before earning his law degree. He worked as a civil rights attorney and taught constitutional law at the University of Chicago Law School from 1992 to 2004. He served three terms representing the 13th District in the Illinois Senate from 1997 to 2004, running unsuccessfully for the United States House of Representatives in 2000. In 2004, Obama received national attention during his campaign to represent Illinois in the United States Senate with his victory in the March Democratic Party primary, his keynote address at the Democratic National Convention in July, and his election to the Senate in November. He began his presidential campaign in 2007 and, after a close primary campaign against Hillary Rodham Clinton in 2008, he won sufficient delegates in the Democratic Party primaries to receive the presidential nomination. He then defeated Republican nominee John McCain in the general election, and was inaugurated as president on January 20, 2009. Nine months after his election, Obama was named the 2009 Nobel Peace Prize laureate.",

    "lebron": "LeBron Raymone James, born December 30, 1984, is an American professional basketball player for the Miami Heat of the National Basketball Association. Standing at 6 foot 8 inches and weighing 250 pounds, he has started at the small forward and power forward positions. James has won two NBA championships, four NBA Most Valuable Player Awards, two NBA Finals MVP Awards, two Olympic gold medals, a NBA scoring title, and the NBA Rookie of the Year Award. He has also been selected to ten NBA All-Star teams, nine All-NBA teams, and five All-Defensive teams, and is the Cleveland Cavaliers' all-time leading scorer. James played high school basketball at St. Vincent – St. Mary High School in his hometown of Akron, Ohio, where he was highly promoted in the national media as a future NBA superstar. After graduating, he was selected with the first overall pick in the 2003 NBA Draft by the Cavaliers. James led Cleveland to the franchise's first Finals appearance in 2007, losing to the San Antonio Spurs in a sweep. In 2010, he left the Cavaliers for the Heat in a highly publicized free agency period. In his first season in Miami, the Heat reached the Finals but lost to the Dallas Mavericks. James won his first championship in 2012 when Miami defeated the Oklahoma City Thunder. In 2013, he led the Heat on a 27-game winning streak, the second longest in league history. Miami also won their second consecutive title that year.",

    "arnold" : "Arnold Alois Schwarzenegger, born July 30, 1947, is an Austrian-born American actor, film producer, businessman, investor, writer, philanthropist, former professional bodybuilder and politician. Schwarzenegger served two terms as the 38th Governor of California from 2003 until 2011. Schwarzenegger began weight training at the age of 15. He won the Mr. Universe title at age 20 and went on to win the Mr. Olympia contest seven times. Schwarzenegger has remained a prominent presence in bodybuilding and has written many books and articles on the sport. Schwarzenegger gained worldwide fame as a Hollywood action film icon. He was nicknamed the \"Austrian Oak\" and the \"Styrian Oak\" in his bodybuilding days, \"Arnie\" during his acting career and more recently \"The Governator\" (a portmanteau of \"Governor\" and \"The Terminator\" – one of his best-known movie roles). As a Republican, he was first elected on October 7, 2003, in a special recall election to replace then-Governor Gray Davis. Schwarzenegger was sworn in on November 17, 2003, to serve the remainder of Davis's term. Schwarzenegger was then re-elected on November 7, 2006, in California's 2006 gubernatorial election, to serve a full term as governor, defeating Democrat Phil Angelides, who was California State Treasurer at the time. Schwarzenegger was sworn in for his second term on January 5, 2007. In 2011, Schwarzenegger completed his second term as governor, and it was announced that he had separated from Maria Shriver, his wife for the last 25 years; she is a member of the influential Kennedy family, as a niece of the late Democratic US President John F. Kennedy.",

  },

});
