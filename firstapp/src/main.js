const {app, BrowserWindow, globalShortcut} = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow() {
  win = new BrowserWindow({width: 1280, height: 800});

  win.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));

  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });

  globalShortcut.register("Control+H", () => {
    const event = {
      type: "keyDown",
      keyCode: "Backspace"
    };
    win.webContents.sendInputEvent(event);
  })

  globalShortcut.register("Control+M", () => {
    const event = {
      type: "char",
      keyCode: "\u000d"
    };
    win.webContents.sendInputEvent(event);
  })

  globalShortcut.register("Control+I", () => {
    const event = {
      type: "keyDown",
      keyCode: "Tab"
    };
    win.webContents.sendInputEvent(event);
  })

  globalShortcut.register("Control+[", () => {
    const event = {
      type: "keyDown",
      keyCode: "Escape"
    };
    win.webContents.sendInputEvent(event);
  })

  globalShortcut.register("Control+P", () => {
    // TODO: Move to preview page.
    console.log("Control+P");
  })

  globalShortcut.register("Control+N", () => {
    // TODO: Move to next page.
    console.log("Control+N");
  })
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win == null) {
    createWindow();
  }
});
