"use strict";

const {remote, ipcRenderer} = require("electron");
const {Menu, MenuItem} = remote;
const path = require("path");
const url = require("url");
const win = remote.getCurrentWindow();
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

function onSubmit(e) {
  e.preventDefault();   
  console.log(addressInput.value);

  webView.loadURL(addressInput.value);
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
  document.getElementById("addressForm").addEventListener("submit", onSubmit, false);
  webView.removeEventListener("dom-ready", onReady, false);
}

window.addEventListener("load", (e) => {
  console.log("window: load");

  addressInput = document.getElementById("addressInput");
  addressInput.value = "https://www.google.com"; 
  webView = document.createElement("webview");
  webView.src = url.format({
    pathname: path.join(__dirname, "blank.html"),
    protocol: "file:",
    slashes: true
  });

  const contents = document.getElementById("contents");
  contents.appendChild(webView);
  // webView.addEventListener("dom-ready", onReady, {once: true});
  webView.addEventListener("dom-ready", onReady, false);
}, false);
