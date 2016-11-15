"use strict"

const Immutable = require("immutable");

const prefixCode = "KeyL";
const historyCode = "KeyH"
const bookmarkCode = "KeyB"
const interval = 3000.0;
const emptyList = Immutable.List();

let eventList = emptyList; 
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

    eventList = eventList.push(e); 
    if (eventList.size < 2) {
      return false;
    }

    try {
      const target = eventList.skip(eventList.size - 2);
      const first = target.first();
      if (!first.ctrlKey || first.code != prefixCode) {
        return false;
      }

      const last = target.last();
      if ((last.timeStamp - first.timeStamp) > interval) {
        return false;
      }

      try {
        switch (last.code) {
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
        eventList = emptyList;
      }
    } finally {
      eventList = eventList.skip(1);
    }
  }
}
