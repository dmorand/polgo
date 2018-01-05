'use strict';

function toInteger(row, column) {
  return row*10 + column;
}

module.exports = class {
  constructor() {
    this.tiles = new Set();
    this.colors = new Set();
  }

  addColor(color) {
    this.colors.add(color);
  }

  addTile(row, column) {
    this.tiles.add(toInteger(row, column));
  }

  hasTile(row, column) {
    return this.tiles.has(toInteger(row, column));
  }
};
