"use strict"

const path = require("path");
const Immutable = require("immutable");
const Datastore = require("nedb");
const appConfig = require("./app-config.js").getAppConfig();
const log = require("./app-config.js").getLogger();
const stringUtil = require("./string-util.js");

const activeBackgroundColor = "#5d91c6";
const activeFontColor = "#f7f7f7";
const displayCount = appConfig.listDisplayCount;
const historyDB = new Datastore(appConfig.historyDatabaseFile);

let listBox = null;
let linkArray = [];
let currentDB = null;
let currentFilteringDocs = null;
let currentIndex = 0;
let currentStartIndex = 0;

historyDB.loadDatabase((err) => {
  if (err) {
    log.error("DB load failed: %s", err);
  } 
});

function filtering(db, keyword, callback) {
  if (stringUtil.isEmpty(keyword)) {
    db.find({ $and: [ { keyword: { $regex: /.*/ } } ] }).sort({ date: -1 }).exec((err, docs) => {
      if (err) {
        log.error("filtering failed: " + err);
        return;
      }

      callback(docs);
    });
  } else {
    const keywordArray = keyword.split(" ");
    const keywordSeq = Immutable.Seq(keywordArray);
    const keywordQuery = keywordSeq.map(a => {
      return { keyword: { $regex: new RegExp(a) } };
    }).toArray();

    db.find({ $and: keywordQuery }).sort({ date: -1 }).exec((err, docs) => {
      if (err) {
        log.error("filtering failed: " + err);
        return;
      }

      callback(docs);
    });
  }
}

function getItemSpans(link) {
  const elements = link.getElementsByTagName("span");
  return {
    tagSpan: elements[0],
    titleSpan: elements[1],
    urlSpan: elements[2],
  };
}

function setList(db, keyword, startIndex, callback) {

  for (const i of Array.from(Array(displayCount).keys())) {
    const link = linkArray[i];
    link.href = "";
    const {tagSpan, titleSpan, urlSpan} = getItemSpans(link);
    tagSpan.innerHTML = "";
    titleSpan.innerHTML = "";
    urlSpan.innerHTML = "";
  }

  filtering(db, keyword, (docs) => {
    const count = ((docs.length <= displayCount) ? docs.length : displayCount);
    for (const i of Array.from(Array(count).keys())) {
      const item = docs[i + startIndex];
      const link = linkArray[i];
      link.href = item.url;
      const {tagSpan, titleSpan, urlSpan} = getItemSpans(link);
      tagSpan.innerHTML = item.tag;
      titleSpan.innerHTML = item.title;
      urlSpan.innerHTML = item.url;
    }

    callback(docs);
  });
}

function setActiveColor(index) {
  for (const i of Array.from(Array(displayCount).keys())) {
    const link = linkArray[i];
    link.style.color = "inherit";
    link.parentElement.style.backgroundColor = "inherit";
  }

  if (currentFilteringDocs.length < 1) {
    return;
  }

  const link = linkArray[index];
  link.style.color = activeFontColor;
  link.parentElement.style.backgroundColor = activeBackgroundColor;
}

module.exports = {
  init: (document) => {
    if (listBox) {
      return;
    }

    listBox = document.getElementById("listBox");

    for (const i of Array.from(Array(displayCount).keys())) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const tagSpan = document.createElement("span");
      const titleSpan = document.createElement("span");
      const urlSpan = document.createElement("span");
      link.href = "";
      link.setAttribute("disabled", "disabled");
      link.appendChild(tagSpan); 
      link.appendChild(titleSpan); 
      link.appendChild(urlSpan); 
      item.appendChild(link);
      listBox.appendChild(item);
      linkArray.push(link);
    }
  },
  next: (keyword) => {
    if (!listBox || !currentFilteringDocs) {
      return;
    }

    if (currentIndex >= currentFilteringDocs.length - 1) {
      currentIndex = currentFilteringDocs.length - 1;
      return;
    }

    const endIndex = currentStartIndex + displayCount - 1;
    if (currentIndex < endIndex) {
      const nextLink = linkArray[currentIndex + 1 - currentStartIndex];
      if (stringUtil.isEmpty(nextLink.href)) {
        return;
      }

      currentIndex++;
      setActiveColor(currentIndex - currentStartIndex);
    } else {
      currentIndex++;
      currentStartIndex++;
      setList(currentDB, keyword, currentStartIndex, (docs) => {
        currentFilteringDocs = docs;
        setActiveColor(currentIndex - currentStartIndex);
      });
    }
  },
  preview: (keyword) => {
    if (!listBox || !currentFilteringDocs) {
      return;
    }

    if (currentIndex <= 0) {
      currentIndex = 0;
      return;
    }

    if (currentIndex > currentStartIndex) {
      currentIndex--;
      setActiveColor(currentIndex - currentStartIndex);
    } else {
      currentIndex--;
      currentStartIndex--;
      setList(currentDB, keyword, currentStartIndex, (docs) => {
        currentFilteringDocs = docs;
        setActiveColor(currentIndex - currentStartIndex);
      });
    }
  },
  filter: (keyword) => {
    if (!listBox || !currentDB) {
      return;
    }

    currentStartIndex = 0;
    currentIndex = 0;
    setList(currentDB, keyword, currentStartIndex, (docs) => {
      currentFilteringDocs = docs;
      setActiveColor(0);
    });
  },
  get: () => {
    if (currentFilteringDocs.length < 1) {
      return "";
    }

    const index = currentIndex - currentStartIndex;
    const link = linkArray[index];
    return link.href;
  },
  addHistory: (args) => {
    const date = Date.now();
    const tag = (new Date(date)).toLocaleString();
    const keyword = tag + " " + args.title + " " + args.url;

    historyDB.update(
        { url: args.url },
        { url: args.url, title: args.title, date: date, tag: tag, keyword: keyword },
        { upsert: true },
        (err, numReplaced, upsert) => {
          if (err) {
            log.error("History upsert failed: " + err);
          }
        });    
  },
  loadHistory: (keyword) => {
    if (!listBox) {
      return;
    }

    currentDB = historyDB;
    currentStartIndex = 0;
    currentIndex = 0;
    setList(currentDB, keyword, currentStartIndex, (docs) => {
      currentFilteringDocs = docs;
      setActiveColor(0);
    });
  }
}
