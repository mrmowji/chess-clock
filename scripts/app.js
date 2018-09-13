'use strict';

/*let states = {
  one: "one",
  two: "two",
  three: "three",
};

new Vue({
  el: "#app",

  data: {
    state: states.one,
  }
});*/

let STATES = {
  STARTED: "started",
  STOPPED: "stopped",
  PAUSED: "paused",
};

let PAGES = {
  HOME: "home",
  ABOUT: "about",
  SETTINGS: "settings",
  CLOCK: "clock",
};

let COLORS = {
  WHITE: "white",
  BLACK: "black",
};

Vue.component("timer", {
  template: "#timer",
  props: [
    "name",
    "color",
    "isWinner",
    "isCurrentPlayer",
    "initialRemainingTimeInSeconds",
    "remainingTimeInSeconds",
    "secondsPassed",
    "percentage",
  ],
  methods: {
    getNameLabelColor: function () {
      return this.isWinner ? 'green' : this.color;
    },
    getTimeFromSeconds: function(seconds) {
      let minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      let hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      return this.getTwoDigitsNumber(hours) + ":" +
        this.getTwoDigitsNumber(minutes) + ":" +
        this.getTwoDigitsNumber(seconds);
    },
    getTwoDigitsNumber: function(number) {
      if (number > 99) {
        return "+9";
      }
      else if (number < 10) {
        return "0" + number;
      }
      return number;
    },
  }
});

new Vue({
  el: "#app",

  data: {
    isLoaded: false,
    isFinished: false,
    currentPage: "home",
    currentPlayer: "white",
    winner: null,
    state: "stopped",
    players: {
      [COLORS.WHITE]: {
        name: "White",
        color: COLORS.WHITE,
        initialRemainingTimeInSeconds: 3600,
        remainingTimeInSeconds: 3600,
        numberOfMoves: 0,
      },
      [COLORS.BLACK]: {
        name: "Black",
        color: COLORS.BLACK,
        initialRemainingTimeInSeconds: 3600,
        remainingTimeInSeconds: 3600,
        numberOfMoves: 0,
      },
    },
    secondsPassed: 0
  },

  mounted: function() {
    this.initialize();
    this.isLoaded = true;
  },

  watch: {
  },

  computed: {
    whitePlayer: function() {
      return this.players['white'];
    },
    blackPlayer: function() {
      return this.players['black'];
    },
    isHomePage: function() {
      return this.currentPage === PAGES.HOME;
    },
    totalTimeInSeconds: function() {
      var i;
      var intervalsLength = 0;
      for (i = 0; i < this.intervals.length; i++) {
        intervalsLength += parseInt(this.intervals[i].length);
      }
      return (intervalsLength) * this.numberOfRounds;
    },
  },

  methods: {
    initialize: function() {
    },
    start: function() {
      this.state = STATES.STARTED;
      this.tick();
      this.interval = setInterval(this.tick, 1000);
    },
    pause: function() {
      this.state = STATES.PAUSED;
      clearInterval(this.interval);
    },
    stop: function() {
      this.winner = null;
      this.isFinished = false;
      this.state = STATES.STOPPED;
      clearInterval(this.interval);
      this.secondsPassed = 0;
      for (let player in COLORS) {
        this.players[COLORS[player]].remainingTimeInSeconds = this.players[COLORS[player]].initialRemainingTimeInSeconds;
      }
    },
    tick: function() {
      if (this.players[this.currentPlayer].remainingTimeInSeconds !== 0) {
        this.secondsPassed++;
        this.players[this.currentPlayer].remainingTimeInSeconds--;
        return;
      }
      this.isFinished = true;
      if (this.currentPlayer === COLORS.WHITE) {
        this.winner = COLORS.BLACK;
      }
      else {
        this.winner = COLORS.WHITE;
      }
      clearInterval(this.interval);
    },
    changePage: function(page) {
      let currentPageElement = document.getElementById(this.currentPage);
      this.currentPage = page;
      this.stop();
    },
    switchTurn: function() {
      this.players[this.currentPlayer].numberOfMoves++;
      if (this.currentPlayer === COLORS.WHITE) {
        this.currentPlayer = COLORS.BLACK;
      }
      else {
        this.currentPlayer = COLORS.WHITE;
      }
    },
  }
})
