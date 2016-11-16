"use strict"

const Immutable = require("immutable");
const stringUtil = require("./string-util.js");

class ListItem {
  constructor(args) {
    this.text = args.text;
    this.url = args.url;
    this.keyword = this.text + " " + this.url;
  }
}

const testList = Immutable.List.of(
      new ListItem({ text: "Google", url: "https://www.google.com" }),
      new ListItem({ text: "Apple", url: "http://www.apple.com" }),
      new ListItem({ text: "GitHub", url: "https://github.com" }),
      new ListItem({ text: "Twitter", url: "https://twitter.com" }),
      new ListItem({ text: "GitHub Gist", url: "https://gist.github.com" }),
      new ListItem({ text: "Docker", url: "https://www.docker.com/" }),
      new ListItem({ text: "The Scala Programming Langage", url: "http://www.scala-lang.org" }),
      new ListItem({ text: "Mozilla Developer Network", url: "https://developer.mozilla.org/en-US" }),
      new ListItem({ text: "CodePen", url: "https://codepen.io/" }),
      new ListItem({ text: "Electron", url: "http://electron.atom.io/" }),
      new ListItem({ text: "npm", url: "https://www.npmjs.com/" }),
      new ListItem({ text: "Arch Linux", url: "https://www.archlinux.org/" }),
      new ListItem({ text: "ArchWiki", url: "https://wiki.archlinux.org/" }),
      new ListItem({ text: "AUR (en) - Home", url: "https://aur.archlinux.org/" }),
      new ListItem({ text: "Travis CI - Test and Deploy Your Code with Confidence", url: "https://travis-ci.org/getting_started" }),
      new ListItem({ text: "terminal.sexy - Terminal Color Scheme Designer", url: "http://terminal.sexy/" }),
      new ListItem({ text: "Newest - Vim Colors", url: "http://vimcolors.com/" }),
      new ListItem({ text: "Home Neovim", url: "https://neovim.io/" }),
      new ListItem({ text: "tmux", url: "https://tmux.github.io/" }),
      new ListItem({ text: "sbt The interactive build tool", url: "http://www.scala-sbt.org/" })
    );

// console.log(testList.first().text);
// console.log(testList.last().url);
// console.log(testList.filter(a => a.text.indexOf("rc") > -1).last().text)
// console.log(Immutable.Range(3, 8).toArray())
// for (const i of Immutable.Range(3, 8)) {
  // console.log(i);
// }

const activeBackgroundColor = "#5d91c6";
const activeFontColor = "#f7f7f7";

let listBox = null;
let linkArray = [];
let displayCount = 0;
let currentSourceList = null;
let currentFilteringList = null;
let currentKeyword = "";
let currentIndex = 0;
let currentStartIndex = 0;

function filtering(list, keyword) {
  if (stringUtil.isEmpty(keyword)) {
    return list;
  } else {
    const re = new RegExp(".*" + keyword + ".*");
    return list.filter(a => re.test(a.keyword));
  }
}

function setList(list, keyword, startIndex) {

  for (const i of Array.from(Array(displayCount).keys())) {
    const link = linkArray[i];
    link.href = "";
    link.innerHTML = "";
  }

  const filteringList = filtering(list, keyword);
  const count = (filteringList.size <= displayCount)? filteringList.size: displayCount;
  for (const i of Array.from(Array(count).keys())) {
    const item = filteringList.get(i + startIndex);
    const link = linkArray[i];
    link.href = item.url;
    link.innerHTML = item.keyword;
  }

  return filteringList;
}

function setActiveColor(index) {
  for (const i of Array.from(Array(displayCount).keys())) {
    const link = linkArray[i];
    link.style.color = "inherit";
    link.parentElement.style.backgroundColor = "inherit";
  }

  if (currentFilteringList.size < 1) {
    return;
  }

  const link = linkArray[index];
  link.style.color = activeFontColor;
  link.parentElement.style.backgroundColor = activeBackgroundColor;
}

module.exports = {
  init: (document, count) => {
    if (listBox) {
      return;
    }

    listBox = document.getElementById("listBox");
    displayCount = count;

    for (const i of Array.from(Array(displayCount).keys())) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = "";
      link.innerHTML = "*";
      link.setAttribute("disabled", "disabled");
      item.appendChild(link);
      listBox.appendChild(item);
      linkArray.push(link);
    }
  },
  next: (keyword) => {
    if (!listBox || !currentFilteringList) {
      return;
    }

    if (currentIndex >= currentFilteringList.size - 1) {
      currentIndex = currentFilteringList.size - 1;
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
      currentFilteringList = setList(currentFilteringList, keyword, currentStartIndex);
      setActiveColor(currentIndex - currentStartIndex);
    }
  },
  preview: (keyword) => {
    if (!listBox || !currentFilteringList) {
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
      currentFilteringList = setList(currentFilteringList, keyword, currentStartIndex);
      setActiveColor(currentIndex - currentStartIndex);
    }
  },
  filter: (keyword) => {
    if (!listBox || !currentSourceList) {
      return;
    }

    currentStartIndex = 0;
    currentIndex = 0;
    currentFilteringList = setList(currentSourceList, keyword, currentStartIndex);
    setActiveColor(0);
  },
  get: () => {
    if (currentFilteringList.size < 1) {
      return "";
    }

    const index = currentIndex - currentStartIndex;
    const link = linkArray[index];
    return link.href;
  },
  setTestList: (keyword) => {
    if (!listBox) {
      return;
    }

    currentSourceList = testList;
    currentStartIndex = 0;
    currentIndex = 0;
    currentFilteringList = setList(currentSourceList, keyword, currentStartIndex);
    setActiveColor(0);
  }
}
