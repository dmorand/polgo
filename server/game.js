'use strict';

const Move = require('./move.js');

const SIZE = 8;

function outbounds(x, y) {
  return x < 0 || x >= SIZE || y < 0 || y >= SIZE;
}

function occupied(board, x, y) {
  return board[x][y] !== undefined;
}

function move(moves, board, x, y, color) {
  moves.push(new Move(x, y, color));

  if (outbounds(x, y)) return false;
  if (occupied(board, x, y)) return false;

  board[x][y] = color;
  return true;
}

module.exports = class {
  constructor(id) {
    this.id = id;
    this.moves = [];
    this.board = [];

    for (let x = 0; x < SIZE; x++) {
      this.board.push([]);
    }
  }

  black(x, y) {
    return move(this.moves, this.board, x, y, 'B');
  }

  white(x, y) {
    return move(this.moves, this.board, x, y, 'W');
  }

  render() {
    let renderedBoard = '';
    const board = this.board;

    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        const tile = this.board[x][y];
        renderedBoard += tile ? tile : '.';
      }

      renderedBoard += '\n';
    }

    return renderedBoard;
  }
};
