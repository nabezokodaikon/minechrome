"use strict";

const {ipcRenderer} = require("electron");
const webViewCtl = require("./webview-controller.js");

let webView = null;

window.addEventListener("load", (e) => {
  console.log("window load");
}, false);

ipcRenderer.on(webViewCtl.getChannel(), (e, message) => {
  console.log("Received: " + message);
});
