"use strict";

const {remote, ipcRenderer} = require("electron");
const {Menu, MenuItem} = remote;
const webViewCtl = require("./webview-controller.js");
const win = remote.getCurrentWindow();

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

ipcRenderer.on(webViewCtl.getChannel(), (e, message) => {
  console.log("Received: " + message);
});

window.addEventListener("load", (e) => {
  console.log("window load");

  const contents = document.getElementById("contents");
  webView = document.createElement("webview");
  webView.src= "https://www.google.co.jp/";
  contents.appendChild(webView);

  webView.addEventListener("dom-ready", () => {
    // Context menu event in webview tag.
    webView.getWebContents().on("context-menu", popupContextMenu);
  }, {once: true});
}, false);

// Context menu event in BrowserWindow.
win.webContents.on("context-menu", popupContextMenu);

// window.addEventListener("contextmenu", (e, params) => {
  // e.preventDefault();
  // console.log(e);
  // contextMenu.popup(remote.getCurrentWindow());
// }, false);

// document.addEventListener("keydown", (e) => {
  // console.log(e);
// });
