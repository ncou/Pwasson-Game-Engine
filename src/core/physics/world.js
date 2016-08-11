/**
* @class World - Physical world.
* @param {Vector} gravity - The world gravity.
* @param {Object} properties - The world properties.
*
* @property {Vector} friction - The world friction. Defaults to x: 0.3, y: 0.3
* @property {Vector} gravity - The world gravity. Defaults to x: 0, y: 9.8
* @property {Vector} restitution - The world restitution. Defaults to x: 0.2, y: 0.2
* @property {Array<Sprite>} childrens - The Sprites that are affected by this world.
**/
function World (gravity, properties) {
  this._className = 'World';

  this.friction = new Game.Vector(0.3, 0.3);
  this.gravity = new Game.Vector(0, 9.8);
  this.restitution = new Game.Vector(0.2, 0.2);

  this.childrens = [];

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
* @public {void} addChild - Add a child to this world.
* @param {Sprite} sprite - The sprite to be added to the world.
**/
World.prototype.addChild = function (sprite) {
  if (typeof sprite !== 'object') return false;
  if (sprite._className !== 'Sprite') return false;

  sprite._worldIndex = this.childrens.length;
  sprite._world = this;
  sprite.removeFromWorld = function () { this._world.removeChild(this._worldIndex); };

  var index = this.childrens.push(child);
  if (
    this.childrens[index] !== undefined &&
    typeof this.childrens[index] === 'object' &&
    this.childrens[index]._className === 'Sprite'
  ) {
    return true;
  }
  return false;
};

/**
* @public {void} removeChild - Remove a children from this world.
* @param {int} index - The children index. (sprite._worldIndex)
**/
World.prototype.removeChild = function (index) {
  if (this.childrens[index] === undefined) return false;

  this.childrens.splice(index, 1);
  if (this.childrens[index] === undefined) {
    return true;
  }
  return false;
};

// Export World as Game.Physics.World
Game.Physics.World = World;

