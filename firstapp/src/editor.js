var inputArea = null;
var inputTxt = null;
var footerArea = null;
var editor = null;

function onLoad() {
  inputArea = document.getElementById("input_area");
  inputTxt = document.getElementById("input_txt");
  footerArea = document.getElementById("footer_fixed");

  editor = ace.edit("input_txt");
  editor.getSession().setMode("ase/mode/javascript");
  editor.setTheme("ace/theme/twilight");

  // Drag and Drop.
  document.ondragover = document.ondrop = function(e) {
    e.preventDefault();
    return false;
  }

  inputArea.ondragover = function() {
    return false;
  }

  inputArea.ondragleave = inputArea.ondragend = function() {
    return false;
  }

  inputArea.ondrop = function(e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    readFile(filepath);
    return false;
  }
};

function openLoadFile() {
  var win = browserWindow.getFocusedWindow();

  dialog.showOpenDialog(
      win,
      {
        properties: ["openFile"],
        filters: [
          {
            name: "Documents",
            extensions: ["txt", "text", "html", "js"]
          }
        ]
      },
      function(filenames) {
        if (filenames) {
          readFile(filenames[0]);
        }
      });
}

function readFile(path) {
  currentPath = path;
  fs.readFile(path, function(error, text) {
    if (error != null) {
      alert("error: " + error);
      return;
    }

    footerArea.innerHTML = path;
    editor.setValue(text.toString());
  });
}

function saveFile() {
  if (currentPath == "") {
    saveNewFile();
    return;
  }

  var win = browserWindow.getFocusedWindow();
  dialog.showMessageBox(win, {
    title: "ファイルの上書き保存を行います。",
    type: "info",
    buttons: ["OK", "Cancel"],
    detail: "本当に保存しますか？"
  },
  function(response) {
    if (response == 0) {
      var data = editor.getValue();
      writeFile(currentPath, data);
    }
  });
}

function writeFile() {
  fs.writeFile(path, dta, function(error) {
    if (error != null) {
      alert("error: " + error);
      return;
    }
  });
}

function saveNewFile() {
  var win = browserWindow.getFocuseWindow();
  dialog.showSaveDialog(
      win,
      {
        properties: ["openFile"],
        filters: [
          {
            name: "Documents",
            extensions: ["txt", "text", "html", "js"]
          }
        ]
      },
      function(fileName) {
        if (fileName) {
          var data = editor.getValue();
          currentPath = fileName;
          writeFile(currentPath, data);
        }
      }
  );
}
