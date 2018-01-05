const expect = require('chai').expect;
const Move = require('../app/move.js');

describe("Move", function() {
  it("is properly created.", function() {
    const move = new Move(3, 6, 'W');
    expect(move.row).to.equal(3);
    expect(move.column).to.equal(6);
    expect(move.color).to.equal('W');
  });
});
