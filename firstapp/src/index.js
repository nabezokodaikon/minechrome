"use strict";

const {remote, ipcRenderer} = require("electron");
const {Menu, MenuItem} = remote;
const webViewCtl = require("./webview-controller.js");

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
      console.log("item 1 clicked");
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

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  contextMenu.popup(remote.getCurrentWindow());
}, false);

document.addEventListener("keydown", (e) => {
  console.log(e);
});
