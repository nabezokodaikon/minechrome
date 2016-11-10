"use strict";

const {remote, ipcRenderer} = require("electron");
const {Menu, MenuItem} = remote;
const webViewCtl = require("./webview-controller.js");
const win = remote.getCurrentWindow();

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
    label: "MenuItem1", click() {
      const contents = remote.getCurrentWindow().webContents;
      console.log(contents);
      // console.log(selectionText);
      // var selObj = window.getSelection();
      // console.log(selObj);
      // var selRange = selObj.getRangeAt(0);
      // console.log(selRange);
    },
  }
];
const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

let webView = null;

ipcRenderer.on(webViewCtl.getChannel(), (e, message) => {
  console.log("Received: " + message);
});

window.addEventListener("load", (e) => {
  console.log("window load");

  const contents = document.getElementById("contents");
  webView = document.createElement("webview");
  webView.src= "https://www.google.co.jp/";
  contents.appendChild(webView);

}, false);

// window.addEventListener("contextmenu", (e, params) => {
  // e.preventDefault();
  // console.log(e);
  // contextMenu.popup(remote.getCurrentWindow());
// }, false);

// document.addEventListener("keydown", (e) => {
  // console.log(e);
// });

win.webContents.on("context-menu", (e, params) => {
  e.preventDefault();
  console.log("context-menu");
  contextMenu.popup(win);
});

