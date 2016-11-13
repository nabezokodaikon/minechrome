"use strict"

const urlRegExp = new RegExp(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:¥@&=+\$,%#]+)$/);

module.exports = {
  isEmpty: function(str) {
    if (str == undefined) return true;
    if (str == null) return true;
    if (str.trim().length == 0) return true;
    return false;
  },
  fixedEncodeURIComponent: function(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  },
  isURL: function(str) {
     return urlRegExp.test(str);
  }
}
