/**
* @class CollisionSolver - Physical collision solver between many shapes.
**/
function CollisionSolver () {
  this._className = 'CollisionSolver';
}

/**
* @public {bool} solve - Solve a collision against two shapes.
* @param {Sprite} shape1
* @param {Sprite} shape2
**/
CollisionSolver.prototype.solve = function (shape1, shape2) {
  var type1 = shape1.shape,
      type2 = shape2.shape;

  if (shape1.collideAgainst.includes(shape2.collisionGroup) == false) {
    shape1.last.collisionShape = null;
    return false;
  }

  if (shape1.last.collisionShape == shape2) {
    shape1.velocity.y = 0;
    shape1.velocity.x = 0;
    return true;
  }

  if (type1 == Game.Shape.RECTANGLE && type2 == type1) {
    return this.RectangleRectangle(shape1, shape2);
  } else if (type1 == Game.Shape.CIRCLE && type2 == type1) {
    return this.CircleCircle(shape1, shape2);
  }
};

/**
* @public {bool} RectangleRectangle - Detects a collision between two rectangles.
* @param {Sprite} shape1 - The first rectangle.
* @param {Sprite} shape2 - The second rectangle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RectangleRectangle = function (shape1, shape2) {
  var collisionDirection = Game.Physics.CollisionDirection.NONE;

  // Get the vector to check against, take in account the HitBox of the shape, not only it's position.
  var vX = (shape1.position.x + (shape1.hitbox.size.x / 2)); /* Shape 1 */
     vX += ((shape1.size.x / 2) - (shape1.hitbox.size.x / 2));
     vX -= (shape2.position.x + (shape2.hitbox.size.x / 2)); /* Shape 2 */
     vX += ((shape2.size.x / 2) - (shape2.hitbox.size.x / 2));

  var vY = (shape1.position.y + (shape1.hitbox.size.y / 2)); /* Shape 1 */
     vY += ((shape1.size.y / 2) - (shape1.hitbox.size.y / 2));
     vY -= (shape2.position.y + (shape2.hitbox.size.y / 2)); /* Shape 2 */
     vY += ((shape2.size.y / 2) - (shape2.hitbox.size.y / 2));

  // Add the half widths and half heights of the shapes.
  var hWidths = (shape1.size.x / 2) + (shape2.size.x / 2);
  var hHeights = (shape1.size.y / 2) + (shape2.size.y / 2);

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
          //shape1.position.y = oY;
        }
      } else {
        collisionDirection = Game.Physics.CollisionDirection.BOTTOM;
        // If the collide method returns true, we apply the collision, else we just giveup.
        if (Game.Engine.scene.collide(collisionDirection, shape1, shape2)) {
          shape1.position.y -= oY;
          shape1.velocity.y = 0;
        }
      }
    } else {
      if (vX > 0) {
        collisionDirection = Game.Physics.CollisionDirection.LEFT;
        // If the collide method returns true, we apply the collision, else we just giveup.
        if (Game.Engine.scene.collide(collisionDirection, shape1, shape2)) {
          shape1.position.x += oX;
          shape1.velocity.x = 0;
        }
      } else {
        collisionDirection = Game.Physics.CollisionDirection.RIGHT;
        // If the collide method returns true, we apply the collision, else we just giveup.
        if (Game.Engine.scene.collide(collisionDirection, shape1, shape2)) {
          shape1.position.x -= oX;
          shape1.velocity.x = 0;
        }
      }
    }
    
    shape1.last.collisionShape = shape2;
    return true;
  }
  
  shape1.last.collisionShape = null;
  return false;
};

/**
* @public {bool} CircleCircle - Detects a collision between two circles.
* @param {Sprite} shape1 - The first circle.
* @param {Sprite} shape2 - The second circle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.CircleCircle = function (shape1, shape2) {
  var collisionDirection = Game.Physics.CollisionDirection.BOTTOM;

  // Get the vector to check against.
  var vX = (shape2.position.x - shape1.position.x) * (shape2.position.x - shape1.position.x);
  var vY = (shape2.position.y - shape1.position.y) * (shape2.position.y - shape1.position.y);
  var rSum = (shape1.size.x + shape2.size.x) * (shape1.size.x + shape2.size.x);
  
  if (vX + vY <= rSum) {
    //shape1.position.x = vX + shape2.position.x;
    //shape1.position.y = vY + shape2.position.y;
    shape1.last.collisionShape = shape2;
    return Game.Engine.scene.collide(collisionDirection, shape1, shape2);
  }

  shape1.last.collisionShape = null;
  return false;
};

/**
* @public {bool} RotRectangleRotRectangle - Detects a collision between two rotated rectangle.
* @param {Sprite} shape1 - The first rectangle.
* @param {Sprite} shape2 - The second rectangle.
* @return {bool} Returns true if both hitbox collides, false if not.
**/
CollisionSolver.prototype.RotRectangleRotRectangle = function (shape1, shape2) {
  return false;
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

