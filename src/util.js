'use strict';

module.exports.get = (obj, path, def) =>
  path
    .split('.')
    .filter(Boolean)
    .every(step => !(step && (obj = obj[step]) === undefined))
    ? obj
    : def;
