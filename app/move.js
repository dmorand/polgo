'use strict';

module.exports = class {
  constructor(row, column, color) {
    this.time = new Date().getTime();
    this.row = row;
    this.column = column;
    this.color = color;
  }
};
