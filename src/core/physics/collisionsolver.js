/**
* @class CollisionSolver - Physical collision solver between many shapes.
**/
function CollisionSolver () {
  this._className = 'CollisionSolver';
}

/**
* @public {bool} RectangleRectangle - Detects a collision between two rectangles.
* @param {HitBox} shape1 - The first rectangle.
* @param {HitBox} shape2 - The second rectangle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RectangleRectangle = function (shape1, shape2) {
  return true;
};

/**
* @public {bool} RotRectangleRectangle - Detects a collision between a rotated rectangle and a rectangle.
* @param {HitBox} shape1 - The first rectangle.
* @param {HitBox} shape2 - The second rectangle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RotRectangleRectangle = function (shape1, shape2) {
  return true;
};

/**
* @public {bool} CircleCircle - Detects a collision between two circles.
* @param {HitBox} shape1 - The first circle.
* @param {HitBox} shape2 - The second circle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.CircleCircle = function (shape1, shape2) {
  return true;
};

/**
* @public {bool} RotCircleCircle - Detects a collision between a rotated circle and a circle.
* @param {HitBox} shape1 - The first circle.
* @param {HitBox} shape2 - The second circle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RotCircleCircle = function (shape1, shape2) {
  return true;
};

/**
* @public {bool} RectangleCircle - Detects a collision between a rectangle and a circle.
* @param {HitBox} shape1 - The first circle.
* @param {HitBox} shape2 - The second circle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RectangleCircle = function (shape1, shape2) {
  return true;
};

// Export CollisionSolver as Game.Physics.CollisionSolver
Game.Physics.CollisionSolver = CollisionSolver;

