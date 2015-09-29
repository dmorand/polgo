'use strict';

const Move = require('./move.js');

function move(moves, board, x, y, color) {
  board[x][y] = color;
  moves.push(new Move(x, y, color));
}

module.exports = class {
  constructor(id) {
    this.id = id;
    this.moves = [];
    this.board = [];

    for (let x = 0; x < 8; x++) {
      const row = [];
      this.board.push(row);
      for (let y = 0; y < 8; y++) {
        row.push('.');
      }
    }
  }

  black(x, y) {
    move(this.moves, this.board, x, y, 'B');
  }

  white(x, y) {
    move(this.moves, this.board, x, y, 'W');
  }

  render() {
    let renderedBoard = '';

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        renderedBoard += this.board[x][y];
      }
      renderedBoard += '\n';
    }

    return renderedBoard;
  }
};
