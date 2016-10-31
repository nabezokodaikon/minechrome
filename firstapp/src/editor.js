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
