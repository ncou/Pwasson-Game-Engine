/**
* @enum Shape - Defines the allowed shapes a sprite can use.
**/
var Shape = {
  RECTANGLE: 0,
  CIRCLE: 1,
  POLYGON: 2
};

/**
* @class HitBox - Defines a basic Hitbox. Used for drawing correct sprite shape.
*                 Also used as a hitbox is sprite.physic = true.
* @param {Shape} shape - The shape form.
* @param {Vector} position - The shape position within the sprite.
* @param {Vector} size - The shape size.
* @param {Array[Vector]} points - The shape points. Used only for polygons. Can be left null.
**/
function HitBox (shape, position, size, points) {
  this._className = 'HitBox';

  this.shape = shape;
  this.points = (points !== undefined) ? points : null;
  this.position = position;
  this.size = size;
}

// Export Shape as Game.Shape
Game.Shape = Shape;

// Export HitBox as Game.HitBox
Game.HitBox = HitBox;

