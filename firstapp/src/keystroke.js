function isCapsLockKey(e) {
  return (e.code == "CapsLock");
}

function canToBackSpaceKey(e) {
  return (
      !e.shiftKey && !e.altKey && !e.metaKey &&
      e.ctrlKey && e.code == "KeyH"
      );
}


document.addEventListener("keydown", (e) => {
  console.log("keydown: ", e);

  if (isCapsLockKey(e)) {
    const dispatchEvent = new KeyboardEvent("keydown", {
      key: "Control",
      code: "ControlLeft",
      location: e.location,
      ctrlKey: true,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      repeat: e.repeat,
      isComposing: e.isComposing,
      view: e.view,
      bubbles: e.bubbles,
      cancelable: e.cancelable
    });
    e.target.dispatchEvent(dispatchEvent);
    e.preventDefault();
    return;
  }

  if (canToBackSpaceKey(e)) {
    const dispatchEvent = new KeyboardEvent("keydown", {
      key: "Backspace",
      code: "Backspace",
      location: e.location,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      repeat: e.repeat,
      isComposing: e.isComposing,
      view: e.view,
      bubbles: e.bubbles,
      cancelable: e.cancelable
    });

    Object.defineProperty(dispatchEvent, 'keyCode', {
      get: function() {
        return this.keyCodeVal;
      }
    });     

    Object.defineProperty(dispatchEvent, 'which', {
      get: function() {
        return this.keyCodeVal;
      }
    }); 

    dispatchEvent.keyCodeVal = 8;

    e.target.dispatchEvent(dispatchEvent);
    e.preventDefault();
    return;
  }

  const div = document.getElementById("keystroke");
  div.textContent = e.key;

});

