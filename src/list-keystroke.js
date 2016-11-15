"use strict"

const Immutable = require("immutable");

class Keystroke {
  constructor(args) {
    this.event = args.event;
    this.time = args.time;
  }
}

const prefixCode = "KeyL";
const historyCode = "KeyH"
const bookmarkCode = "KeyB"
const interval = 3000;
const emptyList = Immutable.List();

let keystrokeList = emptyList; 
let historyDisplayAction = () => {};
let bookmarkDisplayAction = () => {};

module.exports = {
  registHistoryDisplayAction: (action) => {
    historyDisplayAction = action;
  },
  registBookmarkDisplayAction: (action) => {
    bookmarkDisplayAction = action;
  },
  push: (e) => {

    if (e.altKey || e.shiftKey || e.metaKey) {
      return false;
    }

    keystrokeList = keystrokeList.push(
      new Keystroke({
        event: e,
        time: Date.now()
      }
    )); 

    if (keystrokeList.size < 2) {
      return false;
    }

    try {
      const target = keystrokeList.skip(keystrokeList.size - 2);
      const first = target.first();
      if (!first.event.ctrlKey || first.event.code != prefixCode) {
        return false;
      }

      const last = target.last();
      if ((last.time - first.time) > interval) {
        return false;
      }

      try {
        switch (last.event.code) {
          case historyCode:
            console.log("Show history.");
            historyDisplayAction();
            return true;
          case bookmarkCode:
            console.log("Show bookmark.");
            bookmarkDisplayAction();
            return true;
          default:
            return false;
        }
      } finally {
        keystrokeList = emptyList;
      }
    } finally {
      keystrokeList = keystrokeList.skip(1);
    }
  }
}
