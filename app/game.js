'use strict';

const _ = require('lodash');
const Move = require('./move.js');
const Region = require('./region.js');

const BOARD_SIZE = 8;
const FREE_MOVES = 4;
const BLACK = 'B';
const WHITE = 'W';
const LEGAL = 'L';
const ILLEGAL = 'I';

function outbounds(row, column) {
  return row < 0 || row >= BOARD_SIZE || column < 0 || column >= BOARD_SIZE;
}

function traversed(row, column, regions) {
  let isTraversed = false;
  regions.forEach(region => isTraversed |= region.hasTile(row, column));
  return isTraversed;
}

function mapRegion(row, column, region, board) {
  if (outbounds(row, column)) return;

  const color = board[row][column];
  if (color !== undefined) {
    region.addColor(color);
    return;
  }

  if (region.hasTile(row, column)) return;

  region.addTile(row, column);
  mapRegion(row - 1, column, region, board);
  mapRegion(row + 1, column, region, board);
  mapRegion(row, column - 1, region, board);
  mapRegion(row, column + 1, region, board);
}

function mapTerritory(board) {
  const regions = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let column = 0; column < BOARD_SIZE; column++) {
      if (board[row][column] === undefined && !traversed(row, column, regions)) {
        const region = new Region();
        regions.push(region);
        mapRegion(row, column, region, board);
      }
    }
  }

  return regions;
}

function occupied(board, row, column) {
  return board[row][column] !== undefined;
}

function incorrectOrder(moves, color) {
  return moves.length > 0 && moves[moves.length - 1].color === color;
}

function adjacent(moves, board, color, row, column) {
  function correct(color, x, y) {
    if (outbounds(x, y)) return false;
    return board[x][y] === color;
  }

  if (moves.length < FREE_MOVES) return true;
  if (correct(color, row - 1, column)) return true;
  if (correct(color, row + 1, column)) return true;
  if (correct(color, row, column - 1)) return true;
  if (correct(color, row, column + 1)) return true;
  return false;
}

function finished(moves, board) {
  if (moves.length < 2 * BOARD_SIZE) return false;

  var isFinished = true;
  mapTerritory(board).forEach(region => isFinished &= region.colors.size === 1);
  return isFinished;
}

function isLegal(moves, board, color, row, column) {
  if (outbounds(row, column)) return false;
  if (occupied(board, row, column)) return false;
  if (incorrectOrder(moves, color)) return false;
  if (!adjacent(moves, board, color, row, column)) return false;
  if (finished(moves, board)) return false;
  return true;
}

module.exports = class {
  constructor(id, moves) {
    this.id = id;
    this.moves = [];
    this.board = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      this.board.push([]);
    }

    if (moves) {
      moves.forEach(move => this.play(move.row, move.column));
    }
  }

  play(row, column) {
    const color = this.next();
    if (!isLegal(this.moves, this.board, color, row, column)) return false;

    this.moves.push(new Move(row, column, color));
    this.board[row][column] = color;

    return true;
  }

  next() {
    if (this.moves.length === 0) return WHITE;

    const [{color: previous}] = this.moves.slice(-1);
    if (previous === BLACK) return WHITE;
    return BLACK;
  }

  scores() {
    let black = this.moves.filter(move => move.color === BLACK).length;
    let white = this.moves.length - black;

    mapTerritory(this.board).forEach(function(region) {
      if (region.colors.size !== 1) return;

      const regionScore = region.tiles.size * 2;

      if (region.colors.has(BLACK)) {
        black += regionScore;
      } else {
        white += regionScore;
      }
    });

    let scores = {};
    scores[BLACK] = black;
    scores[WHITE] = white;
    return scores;
  }

  render() {
    let renderedBoard = '';
    const board = this.board;
    const next = this.next();

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let column = 0; column < BOARD_SIZE; column++) {
        const tile = board[row][column];
        if (tile) {
          renderedBoard += tile;
        } else if(isLegal(this.moves, board, next, row, column)) {
          renderedBoard += LEGAL;
        } else {
          renderedBoard += ILLEGAL;
        }
      }
    }

    return _.chunk(renderedBoard, BOARD_SIZE);
  }
};
