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

  this._now = 0;
  this._then = Date.now();
  this._interval = 1000 / this.maxFPS;

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
  if (typeof child !== 'object') return false;

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
  if (this.childrens[index] === undefined) return false;

  this.childrens.splice(index, 1);

  if (this.childrens[index] === undefined) {
    return true;
  }
  return false;
};

/**
* @public {void} update - The scene update function. MUST be used by extended scenes instead of _loop.
* @param {int} delta - Scene's delta time.
**/
Scene.prototype.update = function (delta) {};

/**
* @public {void} onClick - Function that gets called when the canvas got clicked.
* @event This function only gets called from the engine, you shouldn't trigger it manually, use Engine.click() instead.
* @param {Vector} position - The click position, calculated properly using Engine.getCanvasPos().
**/
Scene.prototype.onClick = function (position) {};

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

/**
* @private {void} _loop - The scene loop. Uses requestAnimationFrame.
**/
Scene.prototype._loop = function () {
  // Let's run requestAnimationFrame.
  this.raf = requestAnimationFrame(this._loop.bind(this));

  this._now = Date.now();
  this.delta = this._now - this._then;

  if (this.delta > this._interval) {
    this._then = this._now - (this.delta % this._interval);
    this.fps = Math.floor(1 * this.delta);

    Game.context.clearRect(0, 0, Game.Config.canvas.width, Game.Config.canvas.height);

    Game.context.fillText('FPS: ' + (this.fps * 3), 10, 20);

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
* @public {void} stop - Stop the scene loop.
*
* @note May not work properly on some browsers.
* @TODO: Write a polyfill that fallback to removeInterval/removeTimeout.
**/
Scene.prototype.stop = function () {
  cancelAnimationFrame(this.raf);
};

// Export Scene as Game.Scene.
Game.Scene = Scene;

