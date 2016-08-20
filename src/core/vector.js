/**
* @struct Vector
* @note If no arguments are given on new, x and y will defaults to 0.
* @param {int} x
* @param {int} y
**/
function Vector (x, y) {
  this._className = 'Vector';

  this.x = x || 0;
  this.y = y || 0;
}

/**
* @public {Vector} copy - Copy a vector into this.
* @param {Vector} source - The vector to copy from.
* @return Returns this.
**/
Vector.prototype.copy = function (source) {
  if (typeof source !== 'object') throw 'Source Vector is not an Object.';
  if (source._className !== 'Vector') throw 'Source Vector is not a Vector.';

  this.x = source.x;
  this.y = source.y;
  
  return this;
};

/**
* @public {Vector} add - Addition this with a given vector.
* @param {Vector} source - The vector to addtionate from.
* @return Returns this.
**/
Vector.prototype.add = function (source) {
  if (typeof source !== 'object') throw 'Source Vector is not an Object.';
  if (source._className !== 'Vector') throw 'Source Vector is not a Vector.';

  this.x += source.x;
  this.y += source.y;
  
  return this;
};

/**
* @public {Vector} sub - Substract this with a given vector.
* @param {Vector} source - The vector to substract from.
* @return Returns this.
**/
Vector.prototype.sub = function (source) {
  if (typeof source !== 'object') throw 'Source Vector is not an Object.';
  if (source._className !== 'Vector') throw 'Source Vector is not a Vector.';

  this.x -= source.x;
  this.y -= source.y;
  
  return this;
};

/**
* @public {Vector} multiply - Multiply this with a given vector.
* @param {Vector} source - The vector to multiply from.
* @return Returns this.
**/
Vector.prototype.multiply = function (source) {
  if (typeof source !== 'object') throw 'Source Vector is not an Object.';
  if (source._className !== 'Vector') throw 'Source Vector is not a Vector.';

  this.x *= source.x;
  this.y *= source.y;
  
  return this;
};

/**
* @public {Vector} divide - Divide this with a given vector.
* @param {Vector} source - The vector to divide from.
* @return Returns this.
**/
Vector.prototype.divide = function (source) {
  if (typeof source !== 'object') throw 'Source Vector is not an Object.';
  if (source._className !== 'Vector') throw 'Source Vector is not a Vector.';

  this.x /= source.x;
  this.y /= source.y;
  
  return this;
};

// Export Vector as Game.Vector.
Game.Vector = Vector;

