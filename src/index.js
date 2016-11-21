"use strict";

const {remote, ipcRenderer} = require("electron");
const {Menu, MenuItem} = remote;
const path = require("path");
const url = require("url");
const win = remote.getCurrentWindow();
const log = require("./js/app-config.js").getLogger();
const stringUtil = require("./js/string-util.js");
const modeManager = require("./js/mode-manager.js");
const listKeystroke = require("./js/list-keystroke.js");
const listController = require("./js/list-controller.js");

// Regist on mode manage.
modeManager.registBrowseAction({
  enter: browseModeEnterAction,
  escape: browseModeEscapeAction,
  do: browseModeDoAction,
  next: browseModeNextAction,
  preview: browseModePreviewAction,
  delete: browseModeDeleteAction
});
modeManager.registSearchAction({
  enter: searchModeEnterAction,
  escape: searchModeEscapeAction,
  do: searchModeDoAction,
  next: searchModeNextAction,
  preview: searchModePreviewAction,
  delete: searchModeDeleteAction
});
modeManager.registFindTextAction({
  enter: findTextModeEnterAction,
  escape: findTextModeEscapeAction,
  do: findTextModeDoAction,
  next: findTextModeNextAction,
  preview: findTextModePreviewAction,
  delete: findTextModeDeleteAction
});
modeManager.registListAction({
  enter: listModeEnterAction,
  escape: listModeEscapeAction,
  do: listModeDoAction,
  next: listModeNextAction,
  preview: listModePreviewAction,
  delete: listModeDeleteAction
});
modeManager.registBookmarkAddAction({
  enter: bookmarkAddModeEnterAction,
  escape: bookmarkAddModeEscapeAction,
  do: bookmarkAddModeDoAction,
  next: bookmarkAddModeNextAction,
  preview: bookmarkAddModePreviewAction,
  delete: bookmarkAddModeDeleteAction
});

listKeystroke.registHistoryDisplayAction(HistoryListDisplayAction);
listKeystroke.registBookmarkDisplayAction(BookmarkListDisplayAction);

let webView = null;
let addressInput = null;
let findTextBox = null;
let findTextInput = null;
let footer = null;
let listItemFindInput = null;
let bookmarkAddBox = null;
let bookmarkAddTagInput = null;

function browseModeEnterAction() {
  webView.focus();
}

function browseModeEscapeAction() { }

function browseModeDoAction() { }

function browseModeNextAction() {
  if (!webView.canGoForward()) {
    return;
  }

  webView.goForward();
}

function browseModePreviewAction() {
  if (!webView.canGoBack()) {
    return;
  }

  webView.goBack();
}

function browseModeDeleteAction() { }

function searchModeEnterAction() {
  addressInput.focus();  
  addressInput.select();
}

function searchModeEscapeAction() {
  // TODO: Required implementation.
}

function searchModeDoAction() {
  const value = addressInput.value;
  if (stringUtil.isEmpty(value)) {
    return;
  }

  if (stringUtil.isURL(value)) {
    webView.loadURL(value);
  } else {
    searchByKeyword(value);
  }
}

function searchModeNextAction() {
  // TODO: Required implementation.
}

function searchModePreviewAction() {
  // TODO: Required implementation.
}

function searchModeDeleteAction() { 
  addressInput.value = "";
}

function findTextModeEnterAction() {
  findTextBox.style.visibility = "visible";
  findTextInput.focus();  
}

function findTextModeEscapeAction() {
  findTextBox.style.visibility = "hidden";
}

function findTextModeDoAction() {
  findTextModeNextAction();
}

function findTextModeNextAction() {
  const text = findTextInput.value;
  if (stringUtil.isEmpty(text)) {
    return;
  }

  webView.findInPage(text, {
    forward: true,
    findNext: false,
    matchCase: false,
    wordStart: false,
    medialCapitalAsWordStart: false
  });
}

function findTextModePreviewAction() {
  const text = findTextInput.value;
  if (stringUtil.isEmpty(text)) {
    return;
  }

  webView.findInPage(text, {
    forward: false,
    findNext: false,
    matchCase: false,
    wordStart: false,
    medialCapitalAsWordStart: false
  });
}

function findTextModeDeleteAction() { 
  findTextInput.value = "";
}

function listModeEnterAction() {
  // TODO: Required implementation.
  footer.style.visibility = "visible";
  listItemFindInput.focus();
}

function listModeEscapeAction() {
  // TODO: Required implementation.
  footer.style.visibility = "hidden";
}

function listModeDoAction() {
  // TODO: Required implementation.
  listController.filter(listItemFindInput.value);
}

function listModeNextAction() {
  // TODO: Required implementation.
  listController.next(listItemFindInput.value);
}

function listModePreviewAction() {
  // TODO: Required implementation.
  listController.preview(listItemFindInput.value);
}

function listModeDeleteAction() {
  listController.delete(listItemFindInput.value);
}

function bookmarkAddModeEnterAction() {
  // TODO: Search DB by current URL.
  bookmarkAddBox.style.visibility = "visible";
  bookmarkAddTagInput.focus();
}

function bookmarkAddModeEscapeAction() {
  bookmarkAddBox.style.visibility = "hidden";
}

function bookmarkAddModeDoAction() {
  // TODO: Required implementation.
}

function bookmarkAddModeNextAction() { }

function bookmarkAddModePreviewAction() { }

function bookmarkAddModeDeleteAction() {
  bookmarkAddTagInput.value = "";
}

function HistoryListDisplayAction() {
  listController.loadHistory(listItemFindInput.value);
  modeManager.enterListMode();
}

function BookmarkListDisplayAction() {
  // TODO: Required implementation.
  // modeManager.enterListMode();
}

function searchByKeyword(keyword) {
  if (stringUtil.isEmpty(keyword)) {
    return;
  }

  const encodedKeyWord = stringUtil.fixedEncodeURIComponent(keyword);
  const address = "https://www.google.com/webhp?ie=UTF-8#q=" + encodedKeyWord 
  webView.loadURL(address);
}

function onReady() {
  log.trace("webView.dom-ready");

  listController.init(document);

  addressInput.addEventListener("focus", (e) => {
    modeManager.enterSearchMode();
  }, false);

  findTextInput.addEventListener("focus", (e) => {
    modeManager.enterFindTextMode();
  }, false);

  webView.addEventListener("focus", (e) => {
    modeManager.enterBrowseMode();
  }, false);

  webView.addEventListener("new-window", (e) => {
    log.trace("webview.new-window.url: " + e.url);
    webView.loadURL(e.url);
  }, false);

  webView.addEventListener("did-navigate", (e) => {
    log.trace("webview.did-navigate.url: " + e.url);
    addressInput.value = e.url;
    modeManager.enterBrowseMode();
  }, false);

  webView.addEventListener("page-title-updated", (e) => {
    if (!e.explicitSet) {
      return;
    }

    if (stringUtil.isURL(e.title)) {
      return;
    }

    log.trace("webView.page-title-updated: " + e.title + ", " + webView.getURL() + ", " + e.explicitSet);
    listController.addHistory({ url: webView.getURL(), title: e.title });
  }, false);

  addressInput.addEventListener("keypress", (e) => {
    log.trace("addressInput.keypress: " + e.code);
    switch (e.code) {
      case "Enter":
        e.preventDefault();
        modeManager.do();
        return;
      default:
        return;
    }
  }, false);

  findTextInput.addEventListener("keypress", (e) => {
    switch (e.code) {
      case "Enter":
        e.preventDefault();
        modeManager.do();
        return;
      default:
        return;
    }
  }, false);

  findTextInput.addEventListener("input", (e) => {
    modeManager.next();
  }, false);

  listItemFindInput.addEventListener("keypress", (e) => {
    switch (e.code) {
      case "Enter":
        e.preventDefault();
        const url = listController.get();
        if (stringUtil.isEmpty(url)) {
          return;
        }

        addressInput.value = url;
        modeManager.enterSearchMode();
        modeManager.do();
        return;
      default:
        return;
    }
  }, false);

  listItemFindInput.addEventListener("input", (e) => {
    modeManager.do();
  }, false);

  // First action.
  modeManager.enterSearchMode();

  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  webView.removeEventListener("dom-ready", onReady, false);
}

window.addEventListener("load", (e) => {
  webView = document.getElementById("webView");
  addressInput = document.getElementById("addressInput");
  findTextBox = document.getElementById("findTextBox");
  findTextInput = document.getElementById("findTextInput");
  footer = document.getElementById("footer");
  listItemFindInput = document.getElementById("listItemFindInput");
  bookmarkAddBox = document.getElementById("bookmarkAddBox");
  bookmarkAddTagInput = document.getElementById("bookmarkAddTagInput");

  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  // webView.addEventListener("dom-ready", onReady, {once: true});
  webView.addEventListener("dom-ready", onReady, false);
}, false);

// Document key down event.
document.addEventListener("keydown", (e) => {
  console.log("document.keydown: " + e.code);

  if (listKeystroke.push(e)) {
    e.preventDefault();
    return;
  }

  if (e.code == "Escape") {
    e.preventDefault();
    modeManager.enterBrowseMode(e);
    return;
  }

  if (e.altKey || e.shiftKey || e.metaKey || !e.ctrlKey) {
    return;
  }

  switch (e.code) {
    case "KeyG":
      e.preventDefault();
      const script = "{ result: window.getSelection().toString() }";
      webView.executeJavaScript(script, false, (result) => {
        searchByKeyword(result);
      });
      return;
    case "KeyR":
      e.preventDefault();
      webView.reload();
      return;
    case "KeyF":
      e.preventDefault();
      modeManager.enterFindTextMode(e);
      return;
    case "KeyS":
      e.preventDefault();
      modeManager.enterSearchMode();
      return;
    case "KeyB":
      e.preventDefault();
      modeManager.enterBookmarkAddMode();
      return;
    case "KeyN":
      e.preventDefault();
      modeManager.next();
      return;
    case "KeyP":
      e.preventDefault();
      modeManager.preview();
      return;
    case "KeyD":
      e.preventDefault();
      modeManager.delete();
      return;
    default:
      return;
  }
}, false);
