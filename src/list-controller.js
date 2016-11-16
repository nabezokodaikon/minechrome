"use strict"

const Immutable = require("immutable");
const stringUtil = require("./string-util.js");

class ListItem {

  static empty() {
    new ListItem();
  }

  constructor(args) {
    this.index = args.index;
    this.text = args.text;
    this.url = args.url;
    this.keyword = this.text + " " + this.url;
  }
}

const testList = Immutable.List.of(
      new ListItem({ index: 0, text: "Google", url: "https://www.google.com" }),
      new ListItem({ index: 1, text: "Apple", url: "http://www.apple.com" }),
      new ListItem({ index: 2, text: "GitHub", url: "https://github.com" }),
      new ListItem({ index: 3, text: "Twitter", url: "https://twitter.com" }),
      new ListItem({ index: 4, text: "GitHub Gist", url: "https://gist.github.com" }),
      new ListItem({ index: 5, text: "Docker", url: "https://www.docker.com/" }),
      new ListItem({ index: 6, text: "The Scala Programming Langage", url: "http://www.scala-lang.org" }),
      new ListItem({ index: 7, text: "Mozilla Developer Network", url: "https://developer.mozilla.org/en-US" }),
      new ListItem({ index: 8, text: "CodePen", url: "https://codepen.io/" }),
      new ListItem({ index: 9, text: "Electron", url: "http://electron.atom.io/" }),
      new ListItem({ index: 10, text: "npm", url: "https://www.npmjs.com/" }),
      new ListItem({ index: 11, text: "Arch Linux", url: "https://www.archlinux.org/" }),
      new ListItem({ index: 12, text: "ArchWiki", url: "https://wiki.archlinux.org/" }),
      new ListItem({ index: 13, text: "AUR (en) - Home", url: "https://aur.archlinux.org/" }),
      new ListItem({ index: 14, text: "Travis CI - Test and Deploy Your Code with Confidence", url: "https://travis-ci.org/getting_started" }),
      new ListItem({ index: 15, text: "terminal.sexy - Terminal Color Scheme Designer", url: "http://terminal.sexy/" }),
      new ListItem({ index: 16, text: "Newest - Vim Colors", url: "http://vimcolors.com/" }),
      new ListItem({ index: 17, text: "Home Neovim", url: "https://neovim.io/" }),
      new ListItem({ index: 18, text: "tmux", url: "https://tmux.github.io/" }),
      new ListItem({ index: 19, text: "sbt The interactive build tool", url: "http://www.scala-sbt.org/" })
    );

console.log(testList.first().text);
console.log(testList.last().url);
console.log(testList.filter(a => a.text.indexOf("rc") > -1).last().text)
console.log(Immutable.Range(3, 8).toArray())
for (const i of Immutable.Range(3, 8)) {
  console.log(i);
}

const activeBackgroundColor = "#5d91c6";
const activeFontColor = "#f7f7f7";

let listBox = null;
let linkArray = [];
let displayCount = 0;
let currentItemList = Immutable.List();
let currentKeyword = "";
let currentIndex = 0;
let currentStartIndex = 0;
let currentEndIndex = 0;

function filteringList(list, keyword, startIndex, endIndex) {
  if (stringUtil.isEmpty(keyword)) {
    return list.filter(a =>
        startIndex <= a.index &&
        a.index <= endIndex).toArray();
  } else {
    return list.filter(a =>
        a.text.indexOf(keyword) > -1 &&
        startIndex <= a.index &&
        a.index <= endIndex).toArray();
  }
}

function setList(keyword, startIndex) {
  currentStartIndex = startIndex; 
  currentEndIndex = (currentItemList.size < displayCount)?
    currentItemList.size - 1:
    currentStartIndex + displayCount - 1; 
  const itemArray = filteringList(currentItemList, keyword, currentStartIndex, currentEndIndex);
  for (const i of Array.from(Array(displayCount).keys())) {
    const item = itemArray[i];
    const link = linkArray[i];
    link.href = item.url;
    link.innerHTML = item.keyword;
  }
}

module.exports = {
  init: (document, count) => {
    if (listBox != null) {
      return;
    }

    listBox = document.getElementById("listBox");
    displayCount = count;

    for (const i of Array.from(Array(displayCount).keys())) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = "";
      link.innerHTML = "*";
      item.appendChild(link);
      listBox.appendChild(item);
      linkArray.push(link);
    }
  },
  next: (keyword) => {
    if (listBox == null) {
      return;
    }

    if (currentIndex >= currentItemList.size - 1) {
      currentIndex = currentItemList.size - 1;
      return;
    }

    if (currentIndex < currentEndIndex) {
      const prevLink = linkArray[currentIndex - currentStartIndex];
      prevLink.style.color = "inherit";
      prevLink.parentElement.style.backgroundColor = "inherit";

      if (currentIndex < testList.size - 1) {
        currentIndex++;
      }

      const nextLink = linkArray[currentIndex - currentStartIndex];
      nextLink.style.color = activeFontColor;
      nextLink.parentElement.style.backgroundColor = activeBackgroundColor;
    } else {
      currentIndex++;
      setList(keyword, currentStartIndex + 1);
    }
  },
  preview: (keyword) => {
    if (listBox == null) {
      return;
    }

    if (currentIndex <= 0) {
      currentIndex = 0;
      return;
    }

    if (currentIndex > currentStartIndex) {
      const prevLink = linkArray[currentIndex - currentStartIndex];
      prevLink.style.color = "inherit";
      prevLink.parentElement.style.backgroundColor = "inherit";

      if (currentIndex > 0) {
        currentIndex--;
      }

      const nextLink = linkArray[currentIndex - currentStartIndex];
      nextLink.style.color = activeFontColor;
      nextLink.parentElement.style.backgroundColor = activeBackgroundColor;
    } else {
      currentIndex--;
      setList(keyword, currentStartIndex - 1);
    }
  },
  setTestList: (keyword) => {
    if (listBox == null) {
      return;
    }

    currentItemList = testList;
    setList(keyword, 0);
    currentIndex = currentStartIndex;

    if (currentItemList.size > 0) {
      const link = linkArray[0];
      link.style.color = activeFontColor;
      link.parentElement.style.backgroundColor = activeBackgroundColor;
    }
  }
}
