'use strict';

const Move = require('./move.js');
const Region = require('./region.js');

const BOARD_SIZE = 8;
const FREE_MOVES = 4;
const BLACK = 'B';
const WHITE = 'W';
const LEGAL = 'L';
const ILLEGAL = 'I';

function outbounds(x, y) {
  return x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE;
}

function traversed(x, y, regions) {
  let isTraversed = false;
  regions.forEach(region => isTraversed |= region.hasTile(x, y));
  return isTraversed;
}

function mapRegion(x, y, region, board) {
  if (outbounds(x, y)) return;

  const color = board[x][y];
  if (color !== undefined) {
    region.addColor(color);
    return;
  }

  if (region.hasTile(x, y)) return;

  region.addTile(x, y);
  mapRegion(x - 1, y, region, board);
  mapRegion(x + 1, y, region, board);
  mapRegion(x, y - 1, region, board);
  mapRegion(x, y + 1, region, board);
}

function mapTerritory(board) {
  const regions = [];

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (board[x][y] === undefined && !traversed(x, y, regions)) {
        const region = new Region();
        regions.push(region);
        mapRegion(x, y, region, board);
      }
    }
  }

  return regions;
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

function finished(moves, board) {
  if (moves.length < 2 * BOARD_SIZE) return false;

  var isFinished = true;
  mapTerritory(board).forEach(region => isFinished &= region.owners.size === 1);
  return isFinished;
}

function isLegal(moves, board, color, x, y) {
  if (outbounds(x, y)) return false;
  if (occupied(board, x, y)) return false;
  if (incorrectOrder(moves, color)) return false;
  if (!adjacent(moves, board, color, x, y)) return false;
  if (finished(moves, board)) return false;
  return true;
}

function play(moves, board, color, x, y) {
  if (!isLegal(moves, board, color, x, y)) return false;

  moves.push(new Move(x, y, color));
  board[x][y] = color;

  return true;
}

module.exports = class {
  constructor(id, moves) {
    this.id = id;
    this.moves = [];
    this.board = [];

    for (let x = 0; x < BOARD_SIZE; x++) {
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

  render(splitRows) {
    let renderedBoard = '';
    const board = this.board;
    const next = this.next();

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const tile = board[x][y];
        if (tile) {
          renderedBoard += tile;
        } else if(isLegal(this.moves, board, next, x, y)) {
          renderedBoard += LEGAL;
        } else {
          renderedBoard += ILLEGAL;
        }
      }

      if (splitRows) {
        renderedBoard += '\n';
      }
    }

    return renderedBoard;
  }
};
