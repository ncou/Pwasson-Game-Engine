/**
* @class Scene - Defines a simple game scene that can contains childrens.
*
* @param {string} name - The scene name, used in console.log's.
*
* @property {Vector} position - The scene position within the Canvas.
* @property {Vector} size - The scene size, defaults to the one defined in config.js.
* @property {Array} childrens - The childrens this scene has to update/handle.
* @property {Physics.World} world - A physical world object.
* @property {int} maxFPS - The maximum FPS this scene allows. Defaults to 60.
* @property [readOnly] {int} delta - The scene delta time.
**/
function Scene (name) {
  this._className = 'Scene';

  this.name = name;
  this.position = { x: 0, y: 0 };
  this.size = { width: Game.Config.canvas.width, height: Game.Config.canvas.height };

  this.childrens = [];
  this.world = null;
  
  this.maxFPS = 60;
  this.delta = 0;
  this.lock = false;

  this._now = 0;
  this._then = Date.now();
  this._interval = 1000 / this.maxFPS;
  
  this._lastCalledTime;
  this.fps = 0;

  // Let's run our infinite loop.
  this._init();
}

/**
* @private {void} _init - Initialize the scene.
**/
Scene.prototype._init = function () {
  console.log('Current scene:', this.name);
  this._loop();
};

/**
* @private {void} _loop - The scene loop. Uses requestAnimationFrame.
**/
Scene.prototype._loop = function () {
  // Let's run requestAnimateFrame (@see engine.js:0).
  this.raf = requestAnimateFrame(this._loop.bind(this));
  
  if (this.lock) return;
  
  if (!this._lastCalledTime) {
    this._lastCalledTime = Date.now();
    this.fps = 0;
    return;
  }

  this._now = Date.now();
  var d = (this._now - this._lastCalledTime) / 1000;
  this._lastCalledTime = Date.now();
  this.fps = Math.floor(1 / d);
  this.delta = this._now - this._then;

  if (this.delta > this._interval) {
    this._then = this._now - (this.delta % this._interval);

    Game.context.clearRect(0, 0, Game.Config.canvas.width, Game.Config.canvas.height);
    //Game.context.fillText('FPS: ' + (this.fps * 3), 10, 20);

    // Run the scene update method.
    this.update(this.delta);
    
    // If the scene has a physics world, let's update.
    if (this.world !== undefined && this.world != null) {
      this.world._update(this.delta);
    }

    /**
    * Let simply update every childrens this scene has.
    * Pass the scene delta time to update method.
    **/
    for (var i = 0; i < this.childrens.length; i++) {
      var child = this.childrens[i];
      /*if (child.isMouseHover()) {
        Game.setCursor('pointer');
      } else {
        Game.setCursor('default');
      }*/
      
      if (child.needsUpdate === true) {
        child.update(this.delta);
        this.childrens[i].last.position.copy(child.position);
        this.childrens[i].last.size.copy(child.size);
        this.childrens[i].last.rotation = child.rotation;
      }
    }
  }
};

/**
* @public {void} initWorld - Create and initialize a new world for the scene.
* @param {Vector} gravity
* @param {Object} properties
**/
Scene.prototype.addWorld = function (gravity, properties) {
  this.world = new Game.Physics.World(this, gravity, properties);
};

/**
* @public {bool} addChild - Add a child to the scene.
* @param {Object} child - The object to add to this scene.
* @return true if success, false if failure.
**/
Scene.prototype.addChild = function (child) {
  if (typeof child !== 'object') throw new Error('Child is not an Object.');
  /*if (
    child._className != 'Sprite' ||
    child._className != 'Text' ||
    child._className != 'Button'
  ) throw new Error('Child is not a Sprite/Text/Button.');*/

  child._index = this.childrens.length;
  child._parent = this;
  child.remove = function () { this._parent.removeChild(this._index); };

  var index = this.childrens.push(child);
  if (this.childrens[index] !== undefined && typeof this.childrens[index] === 'object') {
    if (this.world != null && child.physics == true) {
      this.world.childrens.push(child);
    }
  
    return true;
  }
  
  return false;
};

/**
* @public {bool} removeChild - Remove a child from the scene.
* @param {int} index - The object's index to remove from this scene.
* @return true if success, false if failure.
**/
Scene.prototype.removeChild = function (index) {
  if (this.childrens[index] === undefined) throw new Error('Child at index ' + index + ' doesn\'t exists.');

  this.childrens.splice(index, 1);
  //this.childrens[index] = null;

  if (this.childrens[index] === undefined) {
    return true;
  }
  return false;
};

/**
* @public {void} stop - Stop the scene loop.
*
* @note May not work properly on some browsers.
* @TODO: Write a polyfill that fallback to removeInterval/removeTimeout.
**/
Scene.prototype.stop = function () {
  cancelAnimationFrame(this.raf);
};

/**
* @public {void} update - The scene update function. MUST be used by extended scenes instead of _loop.
* @param {int} delta - Scene's delta time.
**/
Scene.prototype.update = function (delta) {};

/**
* @public {String} toImage - Return the current scene as base64 image string.
* @param {String|Color} background - The image background color. Defaults to Game.Config.canvas.bgColor if not specified.
* @param {String} mimeType - The image mime type. Defaults to `image/png` if not specified.
**/
Scene.prototype.toImage = function (background, mimeType) {
  var bg = (background || Game.Config.canvas.bgColor || 'white');
  var mime = (mimeType || 'image/png');
  
  this.lock = true;
  
  // Let's cache our current canvas state for restoring it later.
  var data = Game.context.getImageData(0, 0, Game.Config.canvas.width, Game.Config.canvas.height);
  var compositeOperation = Game.context.globalCompositeOperation;
  
  // Now we draw the background and save the image data uri.
//  Game.context.save();
    Game.context.globalCompositeOperation = "destination-over";
    Game.context.fillStyle = bg;
    Game.context.fillRect(0, 0, Game.Config.canvas.width, Game.Config.canvas.height);
    var imageData = Game.Engine.canvas.toDataURL(mime);
//  Game.context.restore();
  
  // Let's reset the canvas as it was before image capture.
//  Game.context.save();
    Game.context.clearRect(0, 0, Game.Config.canvas.width, Game.Config.canvas.height);
    Game.context.putImageData(data, 0, 0);
    Game.context.globalCompositeOperation = compositeOperation;
//  Game.context.restore();
  
  this.lock = false;
  
  // Finally return the data uri.
  return imageData;
};

/**
* @public {void} onMouseClick - Function that gets called when the canvas got clicked.
* @event This function only gets called from the engine, you shouldn't trigger it manually, use Engine.click() instead.
* @param {int} button - The click button id. (1: left, 2: right, 4: middle)
* @param {Vector} position - The click position, calculated properly using Engine.getCanvasPos().
**/
Scene.prototype.onMouseClick = function (button, position) {
  /**
  * Let simply loop over every childrens this scene has.
  * If the mouse click has happened into a child, let's tell this sprite it got a click.
  **/
  for (var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i].isMouseHover()) {
      this.childrens[i]._mouseClick(button, position);
      return;
    }
  }
};

/**
* @public {void} onMouseDown - Function that gets called when the canvas got clicked.
* @event This function only gets called from the engine, you shouldn't trigger it manually, use Engine.click() instead.
* @param {int} button - The click button id. (1: left, 2: right, 4: middle)
* @param {Vector} position - The click position, calculated properly using Engine.getCanvasPos().
**/
Scene.prototype.onMouseDown = function (button, position) {
  /**
  * Let simply loop over every childrens this scene has.
  * If the mouse click has happened into a child, let's tell this sprite it got a click.
  **/
  for (var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i].isMouseHover()) {
      this.childrens[i]._mouseDown(button, position);
      return;
    }
  }
};

/**
* @public {void} onMouseRelease - Function that gets called when the sprite click got released.
* @event This function only gets called from the engine, you shouldn't trigger it manually.
* @param {int} button - The click button id. (1: left, 2: right, 4: middle)
* @param {Vector} position - The click position, calculated properly using Engine.getCanvasPos().
**/
Scene.prototype.onMouseRelease = function (button, position) {
  /**
  * Let simply loop over every childrens this scene has.
  * If the mouse click has happened into a child, let's tell this sprite it got a click.
  **/
  for (var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i].isMouseHover()) {
      this.childrens[i]._mouseRelease(button, position);
      return;
    }
  }
};

/**
* @public {void} onMouseHover - Function that gets called when the canvas got hovered.
* @event This function only gets called from the engine, you shouldn't trigger it manually.
* @param {Vector} position - The mouse position, calculated properly using Engine.getCanvasPos().
**/
Scene.prototype.onMouseHover = function (position) {
  Game.setCursor('default');
  for (var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i].isMouseHover()) {
      if (this.childrens[i].buttonMode) {
        Game.setCursor('pointer');
      }
      this.childrens[i]._mouseHover(position);
    }
    this.childrens[i]._mouseMove(position);
  }
};

/**
* @public {void} onMouseOut - Function that gets called when the mouse goes off the canvas.
* @event This function only gets called from the engine, you shouldn't trigger it manually.
**/
Scene.prototype.onMouseOut = function (button, position) {
  for (var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i].isMouseHover() === false) {
      this.childrens[i]._mouseOut(button, position);
    } else { // If mouse goes offscreen
      if (this.childrens[i].selected) {
        this.childrens[i].selected = false; // Help us to avoid drag&drop being crazy when mouse is off canvas.
        if (this.childrens[i].physics && this.static) {
          this.childrens[i].static = false;
        }
      }
    }
  }
};

/**
* @public {bool} collide - The scene collide function. Called whenever a sprite collides with another one.
* @event This function only gets called from the CollisionSolver, you shouldn't trigger it manually.
* @param {Physics.CollisionDirection} direction - The collision direction.
* @param {HitBox} shape1 - The first shape. This shape is the one that collided.
* @param {HitBox} shape2 - The second shape.
* @return {bool} Returns true to confirm the collision, false to invalidate it.
**/
Scene.prototype.collide = function (direction, shape1, shape2) {
  return true;
};

// Export Scene as Game.Scene.
Game.Scene = Scene;

