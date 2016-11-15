"use strict"

const Immutable = require("immutable");

class Keystroke {
  constructor(args) {
    this.code = args.code;
    this.time = args.time;
  }
}

const prefixCode = "Space";
const historyCode = "KeyH"
const bookmarkCode = "KeyB"
const interval = 3000;
const emptyList = Immutable.List();

let keystrokeList = emptyList; 
let historyDisplayAction = () => {};
let bookmarkDisplayAction = () => {};

module.exports = {
  push: (code) => {
    keystrokeList = keystrokeList.push(
      new Keystroke({
        code: code,
        time: Date.now()
      }
    )); 

    if (keystrokeList.size < 2) {
      return;
    }

    try {
      const target = keystrokeList.skip(keystrokeList.size - 2);
      const first = target.first();
      const last = target.last();
      if (first.code != prefixCode || last.code == prefixCode) {
        return;
      }

      if ((last.time - first.time) > interval) {
        return;
      }

      try {
        switch (last.code) {
          case historyCode:
            console.log("Show history.");
            historyDisplayAction();
            return;
          case bookmarkCode:
            console.log("Show bookmark.");
            bookmarkDisplayAction();
            return;
          default:
            return;
        }
      } finally {
        keystrokeList = emptyList;
      }
    } finally {
      keystrokeList = keystrokeList.skip(1);
    }
  },
  registHistoryDisplayAction: (action) => {
    historyDisplayAction = action;
  },
  registBookmarkDisplayAction: (action) => {
    bookmarkDisplayAction = action;
  }
}
