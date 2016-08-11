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

/**
* @public {void} copy - Copy a vector into this.
* @param {Vector} source - The vector to copy from.
**/
Vector.prototype.copy = function (source) {
  if (typeof source !== 'object') return;
  if (source._className !== 'Vector') return;

  this.x = source.x;
  this.y = source.y;
};

/**
* @public {void} add - Addition this with a given vector.
* @param {Vector} source - The vector to addtionate from.
**/
Vector.prototype.add = function (source) {
  if (typeof source !== 'object') return;
  if (source._className !== 'Vector') return;

  this.x += source.x;
  this.y += source.y;
};

/**
* @public {void} sub - Substract this with a given vector.
* @param {Vector} source - The vector to substract from.
**/
Vector.prototype.sub = function (source) {
  if (typeof source !== 'object') return;
  if (source._className !== 'Vector') return;

  this.x -= source.x;
  this.y -= source.y;
};

/**
* @public {void} multiply - Multiply this with a given vector.
* @param {Vector} source - The vector to multiply from
**/
Vector.prototype.multiply = function (source) {
  if (typeof source !== 'object') return;
  if (source._className !== 'Vector') return;

  this.x *= source.x;
  this.y *= source.y;
};

/**
* @public {void} divide - Divide this with a given vector.
* @param {Vector} source - The vector to divide from
**/
Vector.prototype.divide = function (source) {
  if (typeof source !== 'object') return;
  if (source._className !== 'Vector') return;

  this.x /= source.x;
  this.y /= source.y;
};

// Export Vector as Game.Vector.
Game.Vector = Vector;

