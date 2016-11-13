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
  enter: enterForBrowseMode,
  escape: escapeForBrowseMode,
  do: doForBrowseMode,
  next: nextForBrowseMode,
  preview: previewForBrowseMode,
});
modeManager.registSearchAction({
  enter: enterForSearchMode,
  escape: escapeForSearchMode,
  do: doForSearchMode,
  next: nextForSearchMode,
  preview: previewForSearchMode,
});
modeManager.registFindTextAction({
  enter: enterForFindTextMode,
  escape: escapeForFindTextMode,
  do: doForFindTextMode,
  next: nextForFindTextMode,
  preview: previewForFindTextMode,
});
modeManager.registListAction({
  enter: enterForListMode,
  escape: escapeForListMode,
  do: doForListMode,
  next: nextForListMode,
  preview: previewForListMode,
});


let addressInput = null;
let findTextInput = null;
let findTextBox = null;
let webView = null;
let tempFlag = false;

function enterForBrowseMode() {
  webView.focus();
}

function escapeForBrowseMode() {
}

function doForBrowseMode() {
  // TODO: Required implementation.
}

function nextForBrowseMode() {
  webView.goToOffset(1);
}

function previewForBrowseMode() {
  webView.goToOffset(-1);
}

function enterForSearchMode() {
  addressInput.focus();  
  addressInput.select();
}

function escapeForSearchMode() {
  // TODO: Required implementation.
}

function doForSearchMode(e) {
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

function nextForSearchMode() {
  // TODO: Required implementation.
}

function previewForSearchMode() {
  // TODO: Required implementation.
}

function enterForFindTextMode() {
  findTextBox.style.visibility = "visible";
  findTextInput.focus();  
}

function escapeForFindTextMode() {
  findTextBox.style.visibility = "hidden";
}

function doForFindTextMode(e) {
  e.preventDefault();
  nextForFindTextMode();
}

function nextForFindTextMode() {
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

function previewForFindTextMode() {
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

function enterForListMode() {
  // TODO: Required implementation.
}

function escapeForListMode() {
  // TODO: Required implementation.
}

function doForListMode() {
  // TODO: Required implementation.
}

function nextForListMode() {
  // TODO: Required implementation.
}

function previewForListMode() {
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

  // Hook the addressForm submit event.
  document.getElementById("addressForm").addEventListener("submit", (e) => {
    modeManager.do(e);
    modeManager.enterBrowseMode();
  }, false);

  addressInput.addEventListener("focus", (e) => {
    addressInput.select();
  });

  // Context menu event in webview tag.
  webView.getWebContents().on("context-menu", popupContextMenu);

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

  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  webView.removeEventListener("dom-ready", onReady, false);

  // TODO: Hook the findTextForm submit event.
  // document.getElementById("findTextForm").addEventListener("submit", (e) => {
    // modeManager.do(e);
    // modeManager.enterBrowseMode();
  // }, false);

  findTextInput.addEventListener("input", (e) => {
    console.log("findTextInput.input");
    modeManager.next();
  });

  // First action.
  modeManager.enterSearchMode();
}

window.addEventListener("load", (e) => {
  console.log("window.load: " + e);

  addressInput = document.getElementById("addressInput");
  findTextBox = document.getElementById("findTextBox");
  findTextInput = document.getElementById("findTextInput");
  webView = document.getElementById("webView");

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
  console.log("document.keydown: " + e)

  if (e.altKey || e.shiftKey || e.metaKey) {
    return;
  }

  if (e.ctrlKey) {
    switch (e.code) {
      case "KeyR":
        e.preventDefault();
        webView.reload();
        return;
      case "KeyF":
        modeManager.enterFindTextMode(e);
        return;
      case "BracketLeft":
        modeManager.enterBrowseMode(e);
        return;
      default:
        return;
    }
  } else {
    switch (e.code) {
      case "Escape":
        modeManager.enterBrowseMode(e);
        return;
      default:
        return;
    }
  }
}, false);
