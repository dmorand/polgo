'use strict';

module.exports = class {
  constructor(x, y, color) {
    this.time = new Date().getTime();
    this.x = x;
    this.y = y;
    this.color = color;
  }
};
