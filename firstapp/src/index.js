"use strict";

const {ipcRenderer} = require("electron");
const webViewCtl = require("./webview-controller.js");

let webView = null;

ipcRenderer.on(webViewCtl.getChannel(), (e, message) => {
  console.log("Received: " + message);
});

window.addEventListener("load", (e) => {
  console.log("window load");

  const contents = document.getElementById("contents");
  webView = document.createElement("webview");
  webView.src= "https://www.github.com/";
  contents.appendChild(webView);
}, false);

document.addEventListener("keydown", (e) => {
  console.log(e);
});
