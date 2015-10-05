'use strict';

const Move = require('./move.js');

const SIZE = 8;
const FREE_MOVES = 4;
const BLACK = 'B';
const WHITE = 'W';

function outbounds(x, y) {
  return x < 0 || x >= SIZE || y < 0 || y >= SIZE;
}

function occupied(board, x, y) {
  return board[x][y] !== undefined;
}

function incorrectOrder(moves, color) {
  return moves.length > 0 && moves[moves.length - 1].color === color;
}

function adjacent(moves, board, color, x, y) {
  function correct(color, x, y) {
    if (outbounds(x, y)) return false;
    return board[x][y] === color;
  }

  if (moves.length < FREE_MOVES) return true;
  if (correct(color, x - 1, y)) return true;
  if (correct(color, x + 1, y)) return true;
  if (correct(color, x, y - 1)) return true;
  if (correct(color, x, y + 1)) return true;
  return false;
}

function play(moves, board, color, x, y) {
  if (outbounds(x, y)) return false;
  if (occupied(board, x, y)) return false;
  if (incorrectOrder(moves, color)) return false;
  if (!adjacent(moves, board, color, x, y)) return false;

  moves.push(new Move(x, y, color));
  board[x][y] = color;

  return true;
}

module.exports = class {
  constructor(id, moves) {
    this.id = id;
    this.moves = [];
    this.board = [];

    for (let x = 0; x < SIZE; x++) {
      this.board.push([]);
    }

    if (moves) {
      moves.forEach(move => play(this.moves, this.board, move.color, move.x, move.y));
    }
  }

  playBlack(x, y) {
    return play(this.moves, this.board, BLACK, x, y);
  }

  playWhite(x, y) {
    return play(this.moves, this.board, WHITE, x, y);
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
