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

let listBox = null;
let displayCount = 0;
let currentKeyword = "";
let currentIndex = 0;
let startIndex = 0;
let endIndex = 0;

function filteringList(list, keyword) {
  if (stringUtil.isEmpty(keyword)) {
    return list.filter(a => a.text.indexOf(keyword) > -1 && startIndex <= a.index && a.index <= endIndex).toArray();
  } else {
    return list.filter(a => startIndex <= a.index && a.index <= endIndex).toArray();
  }
}

module.exports = {
  init: (document, count) => {
    if (listBox != null) {
      return;
    }

    listBox = document.getElementById("listBox");
    displayCount = count;

    for (var i = 0; i < displayCount; i++) {
      const link = document.createElement("a");
      link.href = "";
      link.innerHTML = "*";
      const item = document.createElement("li");
      item.appendChild(link);
      listBox.appendChild(item);
    }
  },
  setTestList: (keyword) => {
    if (listBox == null) {
      return;
    }

    startIndex = 0; 
    endIndex = (testList.size < displayCount)? destList.size - 1: displayCount - 1; 
    const array = filteringList(testList, "");
    let elm = listBox.firstElementChild;
    for(var i = startIndex; i <= endIndex; i++) {
      const item = array[i];
      const link = elm.firstElementChild;
      link.href = item.url;
      link.innerHTML = item.keyword;
      elm = elm.nextElementSibling;
    }

    currentIndex = startIndex;

    return testList;
  }
}
