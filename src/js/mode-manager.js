"use strict"

class Action {

  static empty(e) {}

  constructor(args) {
    if (args) {
      this.enter = (args.enter)? args.enter: Action.empty;
      this.escape = (args.escape)? args.escape: Action.empty;
      this.do = (args.do)? args.do: Action.empty;
      this.next = (args.next)? args.next: Action.empty;
      this.preview = (args.preview)? args.preview: Action.empty;
    } else {
      this.enter = Action.empty;
      this.escape = Action.empty;
      this.do = Action.empty;
      this.next = Action.empty;
      this.preview = Action.empty;
    }
  }
}

const emptyAction = new Action();

let browseAction = emptyAction;
let searchAction = emptyAction;
let findTextAction = emptyAction;
let listAction = emptyAction;
let currentAction = emptyAction;

module.exports = {
  
  registBrowseAction: function(action) {
    browseAction = new Action(action)
  },
  registSearchAction: function(action) {
    searchAction = new Action(action)
  },
  registFindTextAction: function(action) {
    findTextAction = new Action(action)
  },
  registListAction: function(action) {
    listAction = new Action(action)
  },

  enterBrowseMode: function(e) {
    if (currentAction == browseAction) {
      return;
    }
    browseAction.enter(e);
    searchAction.escape();
    findTextAction.escape();
    listAction.escape();
    currentAction = browseAction;
  },
  enterSearchMode: function(e) {
    if (currentAction == searchAction) {
      return;
    }
    browseAction.escape();
    searchAction.enter(e);
    findTextAction.escape();
    listAction.escape();
    currentAction = searchAction;
  },
  enterFindTextMode: function(e) {
    if (currentAction == findTextAction) {
      return;
    }
    browseAction.escape();
    searchAction.escape();
    findTextAction.enter(e);
    listAction.escape();
    currentAction = findTextAction;
  },
  enterListMode: function(e) {
    if (currentAction == listAction) {
      return;
    }
    browseAction.escape();
    searchAction.escape();
    findTextAction.escape();
    listAction.enter(e);
    currentAction = listAction;
  },
  
  do: function(e) {
    currentAction.do(e);
  },
  next: function(e) {
    currentAction.next(e);
  },
  preview: function(e) {
    currentAction.preview(e);
  }
}
