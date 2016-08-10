/**
* @enum HitBox - Defines the allowed hitbox shapes a sprite can use.
**/
var HitBox = {
  RECTANGLE: 0,
  CIRCLE: 1,
  POLYGON: 2
};

/**
* @class Shape - Defines a basic shape. Used for drawing correct sprite shape.
*                Also used as a hitbox is sprite.physic = true.
* @param {HitBox} hitbox - The shape form.
* @param {Vector} size - The shape size.
**/
function Shape (hitbox, size) {
  this.hitbox = hitbox;
  this.size = size;
}

// Export HitBox as Game.HitBox // Export Shape as Game.Shape
Game.HitBox = HitBox;
Game.Shape = Shape;
