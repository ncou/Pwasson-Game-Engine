/**
* @class CollisionSolver - Physical collision solver between many shapes.
**/
function CollisionSolver () {
  this._className = 'CollisionSolver';
}

/**
* @public {bool} RectangleRectangle - Detects a collision between two rectangles.
* @param {Sprite} shape1 - The first rectangle.
* @param {Sprite} shape2 - The second rectangle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RectangleRectangle = function (shape1, shape2) {
  var collisionDirection = Game.Physics.CollisionDirection.NONE;

  // Get the vector to check against.
  var vX = (shape1.hitbox.position.x + (shape1.hitbox.size.x / 2)) - (shape2.hitbox.position.x + (shape2.hitbox.size.x / 2));
  var vY = (shape1.hitbox.position.y + (shape1.hitbox.size.y / 2)) - (shape2.hitbox.position.y + (shape2.hitbox.size.y / 2));

  // Add the half widths and half heights of the shapes.
  var hWidths = (shape1.hitbox.size.x / 2) + (shape2.hitbox.size.x / 2);
  var hHeights = (shape1.hitbox.size.y / 2) + (shape2.hitbox.size.y / 2);

  /**
  * If the X and Y vectors are less than the half width or half height, they must be inside the shape.
  * This means that we have a collision!
  **/
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // Figure out on which side the collision happened. (TOP, LEFT, RIGHT, BOTTOM)
    var oX = hWidths - Math.abs(vX);
    var oY = hHeights - Math.abs(vY);
    
    if (oX >= oY) {
      if (vY > 0) {
        collisionDirection = Game.Physics.CollisionDirection.TOP;
        // If the collide method returns true, we apply the collision, else we just giveup.
        if (Game.Engine.scene.collide(collisionDirection, shape1, shape2)) {
          shape1.hitbox.position.y += oY;
        }
      } else {
        collisionDirection = Game.Physics.CollisionDirection.BOTTOM;
        // If the collide method returns true, we apply the collision, else we just giveup.
        if (Game.Engine.scene.collide(collisionDirection, shape1, shape2)) {
          shape1.hitbox.position.y -= oY;
        }
      }
    } else {
      if (vX > 0) {
        collisionDirection = Game.Physics.CollisionDirection.LEFT;
        // If the collide method returns true, we apply the collision, else we just giveup.
        if (Game.Engine.scene.collide(collisionDirection, shape1, shape2)) {
          shape1.hitbox.position.x += oX;
        }
      } else {
        collisionDirection = Game.Physics.CollisionDirection.RIGHT;
        // If the collide method returns true, we apply the collision, else we just giveup.
        if (Game.Engine.scene.collide(collisionDirection, shape1, shape2)) {
          shape1.hitbox.position.x -= oX;
        }
      }
    }
    
    return true;
  }

  return false;
};

/**
* @public {bool} RotRectangleRectangle - Detects a collision between a rotated rectangle and a rectangle.
* @param {Sprite} shape1 - The first rectangle.
* @param {Sprite} shape2 - The second rectangle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RotRectangleRectangle = function (shape1, shape2) {
  return true;
};

/**
* @public {bool} CircleCircle - Detects a collision between two circles.
* @param {Sprite} shape1 - The first circle.
* @param {Sprite} shape2 - The second circle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.CircleCircle = function (shape1, shape2) {
  return true;
};

/**
* @public {bool} RotCircleCircle - Detects a collision between a rotated circle and a circle.
* @param {Sprite} shape1 - The first circle.
* @param {Sprite} shape2 - The second circle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RotCircleCircle = function (shape1, shape2) {
  return true;
};

/**
* @public {bool} RectangleCircle - Detects a collision between a rectangle and a circle.
* @param {Sprite} shape1 - The first circle.
* @param {Sprite} shape2 - The second circle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RectangleCircle = function (shape1, shape2) {
  return true;
};

// Export CollisionSolver as Game.Physics.CollisionSolver
Game.Physics.CollisionSolver = CollisionSolver;

