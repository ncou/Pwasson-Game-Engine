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
* @property {bool} buttonMode - If true, once the sprite got hovered, cursor changes to pointer.
* @property {bool} canGoOffscreen - If true, once the sprite goes offcanvas, it won't be updated until it get visible.
* @property {int} collisionGroup - The sprite collision group, used in physics with collideAgainst.
* @property {Array<int>} collideAgainst - The collision groups that the sprite can collide against.
* @property {bool} draggable - If true, the sprite can be dragged by the mouse.
* @property {string|Color} fontColor - Used if the sprite contains some text.
* @property {int} friction - The sprite friction, used in physics.
* @property {Object} layers - The different layers used to animate the sprite.
* @property {bool} needsUpdate - If true the sprite will be update, else it wont.
* @property {bool} physics - If true the sprite will be given a hitbox and will be able to use the scene physic world.
* @property {Vector} position - The sprite position.
* @property {int} restitution - The sprite restitution, used in physics.
* @property {int} rotation - The sprite rotation angle in degrees. Converted in radians using: `angle * Math.PI / 180`.
* @property {Vector} scale - The sprite scale factors.
* @property {Shape} shape - The sprite shape. Used for drawing, also used for physics as the hitbox.
* @property {Vector} size - The sprite size. size.x = width, size.y = height.
* @property {int} speed - The sprite animation speed.
* @property {bool} static - If set to true, the sprite will only be updated when another sprite erased it. Can't move.
* @property {Texture} texture - The sprite texture.
* @property {Vector} velocity - The sprite velocity. Used for physics.
* @property {Object} last - The sprite last position, rotation and size.
* @property {Object} base - The sprite base position, rotation and size. MUST never be updated. (readOnly)
**/
function Sprite (x, y, width, height, properties) {
  this._className = 'Sprite';

  this.alpha = 1;
  this.anchor = new Game.Vector(0.5, 0.5);
  this.bgColor = null;
  this.borderColor = 'lime';
  this.borderSize = 2;
  this.buttonMode = false;
  this.canGoOffscreen = false;
  this.collisionGroup = 0;
  this.collideAgainst = [ 0 ];
  this.draggable = false;
  this.fontColor = '#fff';
  this.friction = 0.2;
  this.gravityAffected = true;
  this.layers = {};
  this.needsUpdate = true;
  this.physics = false;
  this.position = new Game.Vector(x, y);
  this.restitution = 0.3;
  this.rotation = 0;
  this.scale = new Game.Vector(1, 1);
  this.size = new Game.Vector(width, height);
  this.shape = Game.Shape.RECTANGLE;
  this.hitbox = new Game.HitBox(this.shape, this.position, this.size);
  this.speed = 20;
  this.static = false;
  this.texture = null;
  this.velocity = new Game.Vector(0, 0);
  this.last = {
    position: this.position,
    rotation: this.rotation,
    size: this.size,
    collisionShape: null
  };
  this.base = {
    position: new Game.Vector(x, y),
    rotation: this.rotation,
    size: new Game.Vector(width, height),
    velocity: new Game.Vector(0, 0)
  };
  
  Game.merge(this, properties);
  this.hitbox = new Game.HitBox(this.shape, this.position, this.size);

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
      
      Game.context.scale(this.scale.x, this.scale.y);
      Game.context.rotate(((this.rotation) % 360) * Math.PI / 180);

      // Let's reset the transformations. Uglyness but...
      Game.context.translate(
        -(this.position.x + (this.size.x * this.anchor.x)),
        -(this.position.y + (this.size.y * this.anchor.y))
      );

      switch (this.shape) {
        case Game.Shape.RECTANGLE:
          Game.context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
          break;
        case Game.Shape.CIRCLE:
          Game.context.arc(this.position.x, this.position.y, this.size.x, 0, 2 * Math.PI);
          break;
        case Game.Shape.POLYGON:
          console.log('Polygon shape are not yet implemented. Use Game.Shape.RECTANGLE or Game.Shape.CIRCLE.');
          break;
        default:
          console.log('Unknown shape. Please refer to Game.Shape for a list of available shapes.');
          break;
      }

      if (this.texture !== null) {
        Game.context.clip();
        Game.context.drawImage(
          Game.Engine.loader.getTexture(this.texture),
          this.position.x, this.position.y,
          this.size.x, this.size.y
        );
      } else {
        if (this.bgColor !== null) {
          Game.context.fillStyle = this.bgColor;
          Game.context.fill();
        }
        if (this.borderSize > 0 && this.borderColor !== null) {
          Game.context.strokeStyle = this.borderColor;
          Game.context.lineWidth = this.borderSize;
          Game.context.stroke();
        }
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
  
  if (this.isMouseHover()) {
    this.onMouseHover(Game.Engine.mouse);
  } else {
    this.onMouseOut();
  }

  if (this.isOffscreen() && !this.canGoOffscreen && !this.static && !this.needsUpdate) {
    console.log('Sprite', this._index, 'is offscreen, updating this sprite is not needed.');
    this.needsUpdate = false;
    return;
  }

  this.draw(delta);
  
  // Keep the hitbox position updated.
  this.hitbox.position.copy(this.position);
};

/**
* @private {void} _mouseDown - The proxy function for mouse down. Takes the same args as onMouseDown.
**/
Sprite.prototype._mouseDown = function (button, position) {
  if (this.draggable) {
    this.selected = true;
    
    if (this.physics && !this.static) {
      this.static = true; // We make the sprite static to avoid glitches related to physics.
    }
  }
  this.onMouseDown(button, position);
};

/**
* @private {void} _mouseRelease - The proxy function for mouse release. Takes the same args as onMouseRelease.
**/
Sprite.prototype._mouseRelease = function (button, position) {
  if (this.draggable) {
    this.selected = false;
    
    if (this.physics && this.static) {
      this.static = false;
    }
  }
  this.onMouseRelease(button, position);
};

/**
* @private {void} _mouseHover - The proxy function for mouse hover. Takes the same args as onMouseHover.
**/
Sprite.prototype._mouseHover = function (position) {
  this.onMouseHover(position);
};

/**
* @private {void} _mouseMove - The proxy function for mouse move. Takes the same args as onMouseMove.
**/
Sprite.prototype._mouseMove = function (position) {
  if (this.draggable && this.selected) {
    this.position.x = position.x - (this.size.x / 2);
    this.position.y = position.y - (this.size.y / 2);
  }
  this.onMouseMove(position);
};

/**
* @private {void} _mouseOut- The proxy function for mouse out. Takes the same args as onMouseOut.
**/
Sprite.prototype._mouseOut = function () {
  this.onMouseOut();
};

/**
* @public {void} onMouseDown - Function that gets called when the sprite got clicked.
* @event This function only gets called from the engine, you shouldn't trigger it manually, use Engine.click() instead.
* @param {int} button - The click button id. (1: left, 2: right, 4: middle)
* @param {Vector} position - The click position, calculated properly using Engine.getCanvasPos().
**/
Sprite.prototype.onMouseDown = function (button, position) {};

/**
* @public {void} onMouseRelease - Function that gets called when the sprite click got released.
* @event This function only gets called from the engine, you shouldn't trigger it manually.
* @param {int} button - The click button id. (1: left, 2: right, 4: middle)
* @param {Vector} position - The click position, calculated properly using Engine.getCanvasPos().
**/
Sprite.prototype.onMouseRelease = function (button, position) {};

/**
* @public {void} onMouseHover - Function that gets called when the sprite got hovered.
* @event This function only gets called from the engine, you shouldn't trigger it manually.
* @param {Vector} position - The mouse position, calculated properly using Engine.getCanvasPos().
**/
Sprite.prototype.onMouseHover = function (position) {};

/**
* @public {void} onMouseMove - Function that gets called when the mouse cursor got moved.
* @event This function only gets called from the engine, you shouldn't trigger it manually.
* @param {Vector} position - The mouse position, calculated properly using Engine.getCanvasPos().
**/
Sprite.prototype.onMouseMove = function (position) {};

/**
* @public {void} onMouseOut - Function that gets called when the mouse goes off the sprite.
* @event This function only gets called from the engine, you shouldn't trigger it manually.
**/
Sprite.prototype.onMouseOut = function () {};

/**
* @public {void} reset - Reset the Sprite using base as a reference.
**/
Sprite.prototype.reset = function () {
  this.position.copy(this.base.position);
  this.size.copy(this.base.size);
  this.rotation = this.base.rotation;
  this.velocity.copy(this.base.velocity);
  this.needsUpdate = true;
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
* @public {bool} isMouseHover - Returns true if the mouse is hover the sprite, false if not.
**/
Sprite.prototype.isMouseHover = function (mousePosition) {
  if (mousePosition === undefined) {
    return (
      (this.position.y <= Game.Engine.mouse.y) &&
      (Game.Engine.mouse.y <= this.position.y + this.size.y) &&
      (this.position.x <= Game.Engine.mouse.x) &&
      (Game.Engine.mouse.x <= this.position.x + this.size.x)
    );
  } else {
    return (
      (this.position.y <= mousePosition.y) &&
      (mousePosition.y <= this.position.y + this.size.y) &&
      (this.position.x <= mousePosition.x) &&
      (mousePosition.x <= this.position.x + this.size.x)
    );
  }
};

/**
* TODO: write this function. Should permits to add animations to the sprite with different layers.
**/
Sprite.prototype.addLayer = function (name, animations) {};

// Export Sprite as Game.Sprite.
Game.Sprite = Sprite;
