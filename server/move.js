'use strict';

module.exports = class {
  constructor(time, gameId, color, x, y, valid) {
    this.time = time;
    this.gameId = gameId;
    this.color = color;
    this.x = x;
    this.y = y;
    this.valid = valid;
  }
};
