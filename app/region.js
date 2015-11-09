'use strict';

function toInteger(x, y) {
  return x * 10 + y;
}

module.exports = class {
  constructor() {
    this.tiles = new Set();
    this.colors = new Set();
  }

  addColor(color) {
    this.colors.add(color);
  }

  addTile(x, y) {
    this.tiles.add(toInteger(x, y));
  }

  hasTile(x, y) {
    return this.tiles.has(toInteger(x, y));
  }
};
