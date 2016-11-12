"use strict"

const browseMode = 0;
const searchMode = 1
const findTextMode = 2;
const historyMode = 31;
const bookmarkMode = 32;

const defaultMode = browseMode;
let currentMode = defaultMode;

let enterSearchMode = null;
let enterFindTextMode = null;
let enterHistoryMode = null;
let enterBookmarkMode = null;

let escapeSearchMode = null;
let escapeFindTextMode = null;
let escapeHistoryMode = null;
let escapeBookmarkMode = null;

let browseModeMoveToPreview = null;
let browseModeMoveToNext = null;

let searchModeMoveToPreview = null;
let searchModeMoveToNext = null;

let findTextModeMoveToPreview = null;
let findtextModeMoveToNext = null;

let historyModeMoveToPreview = null;
let historyModeMoveToNext = null;

let bookmarkModeMoveToPreview = null;
let bookmarkModeMoveToNext = null;

module.exports = {
  RegistEnterSearchModeAction: function(action) {
    enterSearchMode = action;
  },
  RegistEnterFindTextModeAction: function(action) {
    enterFindTextMode = action;
  },
  RegistEnterHistoryModeAction: function(action) {
    enterHistoryMode = action;
  },
  RegistEnterBookmarkModeAction: function(action) {
    enterBookmarkMode = action;
  },

  RegistEscapeSearchModeAction: function(action) {
    escapeSearchMode = action;
  },
  RegistEscapeFindTextModeAction: function(action) {
    escapeFindTextMode = action;
  },
  RegistEscapeHistoryModeAction: function(action) {
    escapeHistoryMode = action;
  },
  RegistEscapeBookmarkModeAction: function(action) {
    escapeBookmarkMode = action;
  },

  EnterSearchMode: function() {
    enterSearchMode();
  },
  EnterFindTextMode: function() {
    enterFindTextMode();
  },
  EnterHistoryMode: function() {
    enterHistoryMode();
  },
  EnterBookmarkMode: function() {
    enterBookmarkMode();
  }

  EscapeMode: function() {
    escapeSearchMode();
    escapeFindTextMode();
    escapeHistoryMode();
    escapeBookmarkMode();
    currentMode = defaultMode;
  },

  MoveToPreview: function() {
    switch (currentMode) {
      case browseMode:
        browseModeMoveToPreview();
        return;
      case searchMode:
        searchModeMoveToPreview();
        return;
      case findTextMode:
        findTextModeMoveToPreview();
        return;
      case historyMode:
        historyModeMoveToPreview();
        return;
      case bookmarkMode:
        bookmarkModeMoveToPreview();
        return;
      default:
        // TODO: Throw exception.
        return;
    }
  },

  MoveToNext: function() {
    switch (currentMode) {
      case browseMode:
        browseModeMoveToNext();
        return;
      case searchMode:
        searchModeMoveToNext();
        return;
      case findTextMode:
        findTextModeMoveToNext();
        return;
      case historyMode:
        historyModeMoveToNext();
        return;
      case bookmarkMode:
        bookmarkModeMoveToNext();
        return;
      default:
        // TODO: Throw exception.
        return;
    }
  }
}
