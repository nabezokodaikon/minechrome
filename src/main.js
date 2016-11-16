"use strict";

const {app, BrowserWindow, globalShortcut} = require("electron");
const path = require("path");
const url = require("url");
const webViewCtl = require("./webview-controller.js");

let win = null;

function createWindow() {
  win = new BrowserWindow({width: 1280, height: 800});
  win.setAutoHideMenuBar(true);
  win.setMenuBarVisibility(false);

  win.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));

  win.on("closed", () => {
    win = null;
  });

  win.on("focus", () => {
    console.log("BrowserWindow.focus");
    globalShortcutRegister();
  });

  win.on("blur", () => {
    console.log("BrowserWindow.blur");
    globalShortcut.unregisterAll();
  });
}

function globalShortcutRegister() {
  let ret = false;

  ret = globalShortcut.register("Control+H", () => {
    const event = {
      type: "keyDown",
      keyCode: "Backspace"
    };
    win.webContents.sendInputEvent(event);
  });
  if (!ret) {
    console.log("Registration global short cut failed");
    return;
  }

  ret = globalShortcut.register("Control+M", () => {
    const event = {
      type: "char",
      keyCode: "\u000d"
    };
    win.webContents.sendInputEvent(event);
  });
  if (!ret) {
    console.log("Registration global short cut failed");
    return;
  }

  ret = globalShortcut.register("Control+I", () => {
    const event = {
      type: "keyDown",
      keyCode: "Tab"
    };
    win.webContents.sendInputEvent(event);
  });
  if (!ret) {
    console.log("Registration global short cut failed");
    return;
  }

  ret = globalShortcut.register("Control+[", () => {
    // TODO: Does not react.
    const event = {
      type: "keyDown",
      keyCode: "Escape"
    };
    win.webContents.sendInputEvent(event);
  });
  if (!ret) {
    console.log("Registration global short cut failed");
    return;
  }

  ret = globalShortcut.register("Control+N", () => {
    win.webContents.send(
        webViewCtl.channel, 
        webViewCtl.nextActionMessage);
  });
  if (!ret) {
    console.log("Registration global short cut failed");
    return;
  }

  ret = globalShortcut.register("Control+P", () => {
    win.webContents.send(
        webViewCtl.channel, 
        webViewCtl.previewActionMessage);
  });
  if (!ret) {
    console.log("Registration global short cut failed");
    return;
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  console.log("app.will-quit");
  globalShortcut.unregisterAll();
});

app.on("activate", () => {
  if (win == null) {
    createWindow();
  }
});
