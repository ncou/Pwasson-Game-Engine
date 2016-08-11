/**
* @class Sprite - Defines a simple Sprite that can be added to a Scene.
*
* @param {int} x - Sprite's position in X.
* @param {int} y - Sprite's position in Y.
* @param {int} width - Sprite's width.
* @param {int} height - Sprite's height.
* @param {string|Texture} texture - The sprite texture. If {string}, Engine.getTexture is called.
* @param {Object} properties - The sprite properties. Refers to the @properties fields.
*
* @property {int} alpha - The sprite opacity. Must be between 0 and 1.
* @property {Vector} anchor - Specify the anchor point of the sprite (for rotation).
* @property {string|Color} bgColor - The sprite background color. If null, no background will be drawn.
* @property {string|Color} borderColor - The sprite border color. If null, no border will be drawn.
* @property {int} borderSize - The sprite border size. If 0, no border will be drawn.
* @property {bool} canGoOffscreen - If true, once the sprite goes offcanvas, it won't be updated until it get visible.
* @property {string|Color} fontColor - Used if the sprite contains some text.
* @property {Object} layers - The different layers used to animate the sprite.
* @property {bool} needsUpdate - If true the sprite will be update, else it wont.
* @property {bool} physics - If true the sprite will be given a hitbox and will be able to use the scene physic world.
* @property {Vector} position - The sprite position.
* @property {int} rotation - The sprite rotation angle in degrees. Converted in radians using: `angle * Math.PI / 180`.
* @property {Shape} shape - The sprite shape. Used for drawing, also used for physics as the hitbox.
* @property {Vector} size - The sprite size. size.x = width, size.y = height.
* @property {int} speed - The sprite animation speed.
* @property {bool} static - If set to true, the sprite will only be updated when another sprite erased it. Can't move.
* @property {Texture} texture - The sprite texture.
* @property {Vector} velocity - The sprite velocity. Used for physics.
* @property {Object} last - The sprite last position, rotation and size.
* @property {Object} base - The sprite base position, rotation and size.
**/
function Sprite (x, y, width, height, texture, properties) {
  this.alpha = 1;
  this.anchor = new Game.Vector(0.5, 0.5);
  this.bgColor = null;
  this.borderColor = 'lime';
  this.borderSize = 2;
  this.canGoOffscreen = false;
  this.fontColor = '#fff';
  this.layers = {};
  this.needsUpdate = true;
  this.physics = false;
  this.position = new Game.Vector(x, y);
  this.rotation = 0;
  this.size = new Game.Vector(width, height);
  this.shape = new Game.Shape(Game.HitBox.RECTANGLE, this.position, this.size);
  this.speed = 20;
  this.static = false;
  this.texture = Game.Engine.getTexture(texture);
  this.velocity = new Game.Vector(0, 0);
  this.last = { position: this.position, rotation: this.rotation, size: this.size };
  this.base = this.last;

  Game.merge(this, properties);

  this._init();
};

/**
* @private {void} _init - Initialize the Sprite.
**/
Sprite.prototype._init = function () {
  /* TODO: do something here? */
};

/**
* @public {void} draw - Draw the sprite using options in `this`.
* @param {double} delta - The scene delta time. Can be 0.
**/
Sprite.prototype.draw = function (delta) {
  Game.context.save();
    Game.context.globalAlpha = this.alpha;

    Game.context.beginPath();
      Game.context.translate(
        (this.position.x + (this.size.x * this.anchor.x)),
        (this.position.y + (this.size.y * this.anchor.y))
      );
      Game.context.rotate(((this.rotation + 1) % 360) * Math.PI / 180);
      Game.context.translate(
        -(this.position.x + (this.size.x * this.anchor.x)),
        -(this.position.y + (this.size.y * this.anchor.y))
      );
      
      switch (this.shape.hitbox) {
        case Game.HitBox.RECTANGLE:
          Game.context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
          break;
        case Game.HitBox.CIRCLE:
          Game.context.arc(this.position.x, this.position.y, this.size.x, 0, 2 * Math.PI);
          break;
        case Game.HitBox.POLYGON:
          console.log('Polygon shape are not yet implemented. Use HitBox.RECTANGLE or HitBox.CIRCLE.');
          break;
        default:
          console.log('Unknown shape. Please refer to Game.HitBox for a list of available shapes.');
          break;
      }
      
      
      if (this.bgColor !== null) {
        Game.context.fillStyle = this.bgColor;
        Game.context.fill();
      }
      if (this.borderSize > 0 && this.borderColor !== null) {
        Game.context.strokeStyle = this.borderColor;
        Game.context.lineWidth = this.borderSize;
        Game.context.stroke();
      }
    Game.context.closePath();


  Game.context.restore();
};

/**
* @public {void} update - The update loop called from the scene.
* @param {double} delta - The scene delta time. Can be 0.
**/
Sprite.prototype.update = function (delta) {
  if (this.lock) return;

  if (this.isOffscreen() && !this.canGoOffscreen && !this.static) {
    console.log('Sprite', this._index, 'is offscreen, updating this sprite is not needed.');
    this.needsUpdate = false;
    return;
  }

  this.draw(delta);
};

/**
* @public {bool} positionChanged - Returns true if the position changed, false if not.
**/
Sprite.prototype.positionChanged = function () {
  return !!(
    (this.position.x == this.last.position.x) ||
    (this.position.y == this.last.position.y)
  );
};

/**
* @public {bool} rotationChanged - Returns true if the rotation changed, false if not.
**/
Sprite.prototype.rotationChanged = function () {
  return !!(this.rotation == this.last.rotation);
};

/**
* @public {bool} sizeChanged - Returns true if the size changed, false if not.
**/
Sprite.prototype.sizeChanged = function () {
  return !!(
    (this.size.x == this.last.size.x) ||
    (this.size.y == this.last.size.y)
  );
};

/**
* @public {bool} isOffscreen - Returns true if the sprite is offscreen, false if not.
**/
Sprite.prototype.isOffscreen = function () {
  return (
    (this.position.x - this.size.x > Game.Config.canvas.width) ||
    (this.position.y - this.size.y > Game.Config.canvas.height)
  );
};

/**
* TODO: write this function. Should permits to add animations to the sprite with different layers.
**/
Sprite.prototype.addLayer = function (name, animations) {};

// Export Sprite as Game.Sprite.
Game.Sprite = Sprite;
