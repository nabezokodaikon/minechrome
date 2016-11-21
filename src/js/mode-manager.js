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
      this.delete = (args.delete)? args.delete: Action.empty;
    } else {
      this.enter = Action.empty;
      this.escape = Action.empty;
      this.do = Action.empty;
      this.next = Action.empty;
      this.preview = Action.empty;
      this.delete = Action.delete;
    }
  }
}

const emptyAction = new Action();

let browseAction = emptyAction;
let searchAction = emptyAction;
let findTextAction = emptyAction;
let listAction = emptyAction;
let bookmarkAddAction = emptyAction;
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
  registBookmarkAddAction: function(action) {
    bookmarkAddAction = new Action(action)
  },

  enterBrowseMode: function(e) {
    if (currentAction == browseAction) {
      return;
    }
    browseAction.enter(e);
    searchAction.escape();
    findTextAction.escape();
    listAction.escape();
    bookmarkAddAction.escape();
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
    bookmarkAddAction.escape();
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
    bookmarkAddAction.escape();
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
    bookmarkAddAction.escape();
    currentAction = listAction;
  },
  enterBookmarkAddMode: function(e) {
    if (currentAction == bookmarkAddAction) {
      return;
    }
    browseAction.escape();
    searchAction.escape();
    findTextAction.escape();
    listAction.escape();
    bookmarkAddAction.enter(e);
    currentAction = bookmarkAddAction;
  },
  
  do: function(e) {
    currentAction.do(e);
  },
  next: function(e) {
    currentAction.next(e);
  },
  preview: function(e) {
    currentAction.preview(e);
  },
  delete: function(e) {
    currentAction.delete(e);
  }
}
