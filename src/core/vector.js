/**
* @struct Vector
* @param {int} x
* @param {int} y
**/
function Vector (x, y) {
  this._className = 'Vector';

  this.x = x;
  this.y = y;
}

// Export Vector as Game.Vector.
Game.Vector = Vector;
