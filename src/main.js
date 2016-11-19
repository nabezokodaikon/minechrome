"use strict";

const path = require("path");
const url = require("url");
const {app, BrowserWindow} = require("electron");
const log = require("./js/app-config.js").getLogger();
const globalShortcut = require("./js/global-shortcut.js");

let win = null;

function createWindow() {
  log.debug("app.ready");
  log.debug("app dir: " + path.resolve(""));

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
    const ret = globalShortcut.regist(win);
    if (!ret) {
      log.error("Registration global short cut failed.");
    }
  });

  win.on("blur", () => {
    globalShortcut.unregist();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  log.debug("app.will-quit");
  globalShortcut.unregisterAll();
});

app.on("activate", () => {
  if (win == null) {
    createWindow();
  }
});
