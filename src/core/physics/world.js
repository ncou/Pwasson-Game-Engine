/**
* @class World - Physical world.
* @param {Scene} parentScene - The scene in which the world has been initialized.
* @param {Vector} gravity - The world gravity.
* @param {Object} properties - The world properties.
*
* @property {Vector} friction - The world friction. Defaults to x: 0.3, y: 0.3
* @property {Vector} gravity - The world gravity. Defaults to x: 0, y: 9.8
* @property {Vector} restitution - The world restitution. Defaults to x: 0.2, y: 0.2
* @property {Array<Sprite>} childrens - The Sprites that are affected by this world.
**/
function World (parentScene, gravity, properties) {
  this._className = 'World';
  this._parent = parentScene;

  this.friction = new Game.Vector(0.3, 0.3);
  this.gravity = gravity || new Game.Vector(0, (9.8 * 2));
  this.restitution = new Game.Vector(0.2, 0.2);

  this.childrens = [];
  this._solver = new Game.Physics.CollisionSolver();
  
  this._childCountCached = 0;
  this._childCountChanged = true;

  Game.merge(this, properties);
  this._init();
}

/**
* @private {void} _init - Initialize the world.
**/
World.prototype._init = function () {
  console.log('Initialized a new Game.Physics.World');
};

/**
* @private {void} _update - Update the world.
* @param {double} delta - The scene delta time.
**/
World.prototype._update = function (delta) {
  for (var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i] === undefined) continue;
  
    var child = this.childrens[i];
    if (child.needsUpdate === true) {
      if (child.static == false) {
        this.childrens[i].velocity.x *= this.friction.x;
        
        if (child.gravityAffected) {
          this.childrens[i].velocity.y += this.gravity.y * delta;
        }
        
        // Let's check for collisions.
        for (var j = 0; j < this.childrens.length; j++) {
          if (this.childrens[j] === undefined) continue;
        
          var oChild = this.childrens[j];
          if (oChild != child) {
            this._solver.solve(child, oChild, delta);
          }
        }
        
        this.childrens[i].position.add(this.childrens[i].velocity);
      }
    }
  }
};

/**
* @public {void} addChild - Add a child to this world.
* @param {Sprite} sprite - The sprite to be added to the world.
**/
World.prototype.addChild = function (sprite) {
  if (typeof sprite !== 'object') throw new Error('Child is not an Object.');
  if (sprite._className !== 'Sprite') throw new Error('Child is not a Sprite.');

  sprite._worldIndex = this.childrens.length;
  sprite._world = this;
  sprite.removeFromWorld = function () { this._world.removeChild(this._worldIndex); };

  var index = this.childrens.push(sprite);
  if (
    this.childrens[index] !== undefined &&
    this.childrens[index]._className === 'Sprite'
  ) {
    this._childCountChanged = true;
    return true;
  }
  return false;
};

/**
* @public {void} removeChild - Remove a children from this world.
* @param {int} index - The children index. (sprite._worldIndex)
**/
World.prototype.removeChild = function (index) {
  if (this.childrens[index] === undefined) return;/*throw new Error('Child at index ' + index + ' doesn\'t exists.');*/

  delete this.childrens[index];

  if (this.childrens[index] === undefined) {
    this._childCountChanged = true;
    return true;
  }
  return false;
};

/**
* @public {Number} getChildCount - Return the number of childrens the world has.
**/
World.prototype.getChildCount = function () {
  if (this._childCountChanged === false) return this._childCountCached;

  var counter = 0;
  for (var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i] === undefined) continue;
    counter++;
  }
  
  this._childCountCached = counter;
  this._childCountChanged = false;
  
  return counter;
};

// Export World as Game.Physics.World
Game.Physics.World = World;

