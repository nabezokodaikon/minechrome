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

function moveToPreviewPage() {
  // webView.goBack();
  webView.goToOffset(-1);
}

function moveToNextPage() {
  // webView.goForward();
  webView.goToOffset(1);
}

function onReady() {
  console.log("webView: dom-ready");

  // Context menu event in BrowserWindow.
  win.webContents.on("context-menu", popupContextMenu);

  // Context menu event in webview tag.
  webView.getWebContents().on("context-menu", popupContextMenu);

  ipcRenderer.on(webViewCtl.getChannel(), (e, message) => {
    console.log("Received: " + message);
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
  });

  // The once option of addEventListener will be available in Chrome version 55 and beyond.
  document.getElementById("addressForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = addressInput.value;
    if (stringUtil.isURL(value)) {
      searchByURL(value);
    } else {
      searchByKeyWord(value);
    }
  }, false);
  webView.removeEventListener("dom-ready", onReady, false);
}

window.addEventListener("load", (e) => {
  console.log("window: load");

  addressInput = document.getElementById("addressInput");
  addressInput.value = "https://www.google.com"; 
  addressInput.addEventListener("focus", (e) => {
    addressInput.select();
  });

  webView = document.getElementById("webView");
  webView.src = url.format({
    pathname: path.join(__dirname, "blank.html"),
    protocol: "file:",
    slashes: true
  });

  // webView.addEventListener("dom-ready", onReady, {once: true});
  webView.addEventListener("dom-ready", onReady, false);

  // Hook the reload shortcut key.
  webView.addEventListener("keydown", (e) => {
    console.log(e);
    if (!e.altKey && !e.shiftKey && !e.metaKey &&
        e.ctrlKey && e.code == "KeyR") {
      webView.reload();
      e.preventDefault();
      return;
    }
  });

  // Hook the new window event.
 webView.addEventListener("new-window", (e) => {
    console.log("new-window.url: " + e.url);
    webView.loadURL(e.url);
  }, false);

  webView.addEventListener("did-navigate", (e) => {
    console.log("did-navigate.url: " + e.url);
    addressInput.value = e.url;
    webView.focus();
  }, false);
}, false);
