"use strict"

const Immutable = require("immutable");

class ListItem {

  static empty() {
    new ListItem();
  }

  constructor(args) {
    if (args) {
      this.text = args.text;
      this.url = args.url;
    } else {
      this.text = "";
      this.url = "";
    }
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

console.log(testList.first().text);
console.log(testList.last().url);
console.log(testList.filter(a => a.text.indexOf("rc") > -1).last().text)

module.exports = {
  getTestList: () => {
    return testList;
  }
}
