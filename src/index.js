"use strict";

const {remote, ipcRenderer} = require("electron");
const {Menu, MenuItem} = remote;
const path = require("path");
const url = require("url");
const win = remote.getCurrentWindow();
const stringUtil = require("./string-util.js");
const webViewCtl = require("./webview-controller.js");

let addressInput = null;
let webView = null;

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

function searchByURL(address) {
  webView.loadURL(address);
}

function searchByKeyWord(keyWord) {
  const encodedKeyWord = stringUtil.fixedEncodeURIComponent(keyWord);
  const address = "https://www.google.com/webhp?ie=UTF-8#q=" + encodedKeyWord 
  webView.loadURL(address);
}

function showFindInputBox() {
  const elm = document.getElementById("findTextBox");
  elm.style.visibility = "visible";
}

function hiddenFindInputBox() {
  const elm = document.getElementById("findTextBox");
  elm.style.visibility = "hidden";
}

function moveToPreviewPage() {
  // webView.goBack();
  webView.goToOffset(-1);
}

function moveToNextPage() {
  // webView.goForward();
  webView.goToOffset(1);
}

function onGlobalKeyDown(e, message) {
  console.log("global.keydown: " + message);

  switch (message) {
    case webViewCtl.getMoveToPreviewPageMessage():
      moveToPreviewPage();
      break;
    case webViewCtl.getMoveToNextPageMessage():
      moveToNextPage();
      break;
    default:
      return;
  }
}

function onDocumentKeyDown(e) {
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
        e.preventDefault();
        showFindInputBox();
        return;
      case "BracketLeft":
        e.preventDefault();
        hiddenFindInputBox();
        return;
      default:
        return;
    }
  } else {
    switch (e.code) {
      case "Escape":
        e.preventDefault();
        hiddenFindInputBox();
        return;
      default:
        return;
    }
  }
}

function onReady() {
  console.log("webView.dom-ready");

  // Context menu event in BrowserWindow.
  win.webContents.on("context-menu", popupContextMenu);

  // Context menu event in webview tag.
  webView.getWebContents().on("context-menu", popupContextMenu);

  // Key down events.
  ipcRenderer.on(webViewCtl.getChannel(), onGlobalKeyDown);
  document.addEventListener("keydown", onDocumentKeyDown, false);

  // Search event.
  document.getElementById("addressForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = addressInput.value;
    if (stringUtil.isURL(value)) {
      searchByURL(value);
    } else {
      searchByKeyWord(value);
    }
  }, false);
  
  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  webView.removeEventListener("dom-ready", onReady, false);
}

window.addEventListener("load", (e) => {
  console.log("window.load: " + e);

  addressInput = document.getElementById("addressInput");
  addressInput.value = "https://www.google.com"; 
  addressInput.addEventListener("focus", (e) => {
    addressInput.select();
  });

  webView = document.getElementById("webView");

  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  // webView.addEventListener("dom-ready", onReady, {once: true});
  webView.addEventListener("dom-ready", onReady, false);

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
}, false);
