"use strict"

const {globalShortcut} = require("electron");
const log = require("./app-config.js").getLogger();

module.exports = {
  regist: (browserWindow) => {
    let ret = false;

    ret = globalShortcut.register("Control+H", () => {
      const event = {
        type: "keyDown",
        keyCode: "Backspace"
      };
      browserWindow.webContents.sendInputEvent(event);
    });
    if (!ret) {
      log.error("Registration the Backspace key short cut failed.");
      return;
    }

    ret = globalShortcut.register("Control+M", () => {
      const event = {
        type: "char",
        keyCode: "\u000d"
      };
      browserWindow.webContents.sendInputEvent(event);
    });
    if (!ret) {
      log.error("Registration the Enter key short cut failed");
      return;
    }

    ret = globalShortcut.register("Control+I", () => {
      const event = {
        type: "keyDown",
        keyCode: "Tab"
      };
      browserWindow.webContents.sendInputEvent(event);
    });
    if (!ret) {
      log.error("Registration the Tab key short cut failed");
      return;
    }

    ret = globalShortcut.register("Control+[", () => {
      const event = {
        type: "keyDown",
        keyCode: "Escape"
      };
      browserWindow.webContents.sendInputEvent(event);
    });
    if (!ret) {
      log.error("Registration the Escape key short cut failed");
      return;
    }

    return true;
  },
  unregist: () => {
    globalShortcut.unregisterAll();
  }
}
