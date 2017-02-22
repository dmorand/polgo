# Polgo

[![Build Status](https://travis-ci.org/dmorand/polgo-node.svg?branch=master)](https://travis-ci.org/dmorand/polgo-node)

## Description

Polgo is a board game of strategy and territory that is similar to Go but with a focus on quick games.  The goal is to control the most territory while blocking the other player.  It can be played on a 8X8 chess board using Go stones.  

## Rules

1. Either black or white may begin
2. Each player 2 first moves are considered free moves and may be played anywhere
3. Other moves must be adjacent to another stone of the same color (diagonal is not considered adjacent)
4. The game is finished when both players can no longer expand their territory

## Scoring

1. Each stone count for 1 point
2. Each empty tile in a player territory count for 2 points
