document.addEventListener("keydown", (e) => {
  console.log("keydown: ", e);

  const div = document.getElementById("keystroke");
  div.textContent = e.key;

});

