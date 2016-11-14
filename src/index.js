"use strict";

const {remote, ipcRenderer} = require("electron");
const {Menu, MenuItem} = remote;
const path = require("path");
const url = require("url");
const win = remote.getCurrentWindow();
const stringUtil = require("./string-util.js");
const webViewCtl = require("./webview-controller.js");
const modeManager = require("./mode-manager.js");

// Regist on mode manage.
modeManager.registBrowseAction({
  enter: browseModeEnterAction,
  escape: browseModeEscapeAction,
  do: browseModeDoAction,
  next: browseModeNextAction,
  preview: browseModePreviewAction,
});
modeManager.registSearchAction({
  enter: searchModeEnterAction,
  escape: searchModeEscapeAction,
  do: searchModeDoAction,
  next: searchModeNextAction,
  preview: searchModePreviewAction,
});
modeManager.registFindTextAction({
  enter: findTextModeEnterAction,
  escape: findTextModeEscapeAction,
  do: findTextModeDoAction,
  next: findTextModeNextAction,
  preview: findTextModePreviewAction,
});
modeManager.registListAction({
  enter: listModeEnterAction,
  escape: listModeEscapeAction,
  do: listModeDoAction,
  next: listModeNextAction,
  preview: listModePreviewAction,
});

let webView = null;
let addressInput = null;
let findTextInput = null;
let findTextBox = null;

function browseModeEnterAction() {
  webView.focus();
}

function browseModeEscapeAction() {
}

function browseModeDoAction() {
  // TODO: Required implementation.
}

function browseModeNextAction() {
  webView.goToOffset(1);
}

function browseModePreviewAction() {
  webView.goToOffset(-1);
}

function searchModeEnterAction() {
  addressInput.focus();  
  addressInput.select();
}

function searchModeEscapeAction() {
  // TODO: Required implementation.
}

function searchModeDoAction(e) {
  e.preventDefault();

  const value = addressInput.value;
  if (stringUtil.isEmpty(value)) {
    return;
  }

  if (stringUtil.isURL(value)) {
    webView.loadURL(value);
  } else {
    const encodedKeyWord = stringUtil.fixedEncodeURIComponent(value);
    const address = "https://www.google.com/webhp?ie=UTF-8#q=" + encodedKeyWord 
    webView.loadURL(address);
  }
}

function searchModeNextAction() {
  // TODO: Required implementation.
}

function searchModePreviewAction() {
  // TODO: Required implementation.
}

function findTextModeEnterAction() {
  findTextBox.style.visibility = "visible";
  findTextInput.focus();  
}

function findTextModeEscapeAction() {
  findTextBox.style.visibility = "hidden";
}

function findTextModeDoAction(e) {
  e.preventDefault();
  nextForFindTextMode();
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

function listModeEnterAction() {
  // TODO: Required implementation.
}

function listModeEscapeAction() {
  // TODO: Required implementation.
}

function listModeDoAction() {
  // TODO: Required implementation.
}

function listModeNextAction() {
  // TODO: Required implementation.
}

function listModePreviewAction() {
  // TODO: Required implementation.
}

function popupContextMenu(e, params) {
  e.preventDefault();
  const contextMenuTemplate = [
    {
      role: "undo"
    },
    {
      role: "separator"
    },
    {
      role: "copy"
    },
    {
      role: "paste"
    },
    {
      role: "separator"
    },
    {
      label: "Search for [" + params.selectionText + "]", click() {
      },
    }
  ];
  const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
  contextMenu.popup(win);
}

function onReady() {
  console.log("webView.dom-ready");

  // Context menu event in BrowserWindow.
  win.webContents.on("context-menu", popupContextMenu);

  // Context menu event in webview tag.
  webView.getWebContents().on("context-menu", popupContextMenu);

  addressInput.addEventListener("focus", (e) => {
    console.log("addressInput.focus");
    modeManager.enterSearchMode();
  }, false);

  findTextInput.addEventListener("focus", (e) => {
    console.log("findTextInput.focus");
    modeManager.enterFindTextMode();
  }, false);

  webView.addEventListener("focus", (e) => {
    console.log("webView.focus");
    modeManager.enterBrowseMode();
  }, false);

  // Hook the new window event.
  webView.addEventListener("new-window", (e) => {
    console.log("webview.new-window.url: " + e.url);
    webView.loadURL(e.url);
  }, false);

  webView.addEventListener("did-navigate", (e) => {
    console.log("webview.did-navigate.url: " + e.url);
    addressInput.value = e.url;
    webView.focus();
  }, false);

  addressInput.addEventListener("keypress", (e) => {
    console.log("addressInput.keypress: " + e.code);
    switch (e.code) {
      case "Enter":
        modeManager.do(e);
        return;
      default:
        return;
    }
  }, false);

  findTextInput.addEventListener("keypress", (e) => {
    console.log("findTextInput.keypress: " + e.code);
    switch (e.code) {
      case "Enter":
        modeManager.next();
        return;
      default:
        return;
    }
  }, false);

  findTextInput.addEventListener("input", (e) => {
    console.log("findTextInput.input");
    modeManager.next();
  }, false);

  // First action.
  modeManager.enterSearchMode();

  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  webView.removeEventListener("dom-ready", onReady, false);
}

window.addEventListener("load", (e) => {
  console.log("window.load: " + e);

  webView = document.getElementById("webView");
  addressInput = document.getElementById("addressInput");
  findTextBox = document.getElementById("findTextBox");
  findTextInput = document.getElementById("findTextInput");

  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  // webView.addEventListener("dom-ready", onReady, {once: true});
  webView.addEventListener("dom-ready", onReady, false);
}, false);


// Global key down event.
ipcRenderer.on(webViewCtl.getChannel(), (e, message) => {
  console.log("global.keydown: " + message);

  switch (message) {
    case webViewCtl.getMoveToNextPageMessage():
      modeManager.next();
      return;
    case webViewCtl.getMoveToPreviewPageMessage():
      modeManager.preview();
      return;
    default:
      return;
  }
});

// Document key down event.
document.addEventListener("keydown", (e) => {
  console.log("document.keydown: " + e.code);

  if (e.code == "Escape") {
    modeManager.enterBrowseMode(e);
    return;
  }

  if (e.altKey || e.shiftKey || e.metaKey || !e.ctrlKey) {
    return;
  }

  switch (e.code) {
    case "KeyF":
      modeManager.enterFindTextMode(e);
      return;
    case "KeyR":
      e.preventDefault();
      webView.reload();
      return;
    case "KeyS":
      modeManager.enterSearchMode();
      return;
    default:
      return;
  }
}, false);
