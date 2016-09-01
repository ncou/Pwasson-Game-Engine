/**
* @class Container - A simple object that can have childrens.
*
* @property {Array} childrens - The container childrens.
* @property {Vector} position - The container position within the scene.
* @property {Vector} size - The container size within the scene. A container bigger than the scene will needs a Camera.
**/
function Container () {
  this._className = 'Container';

  this.childrens = [];
  this.position = new Game.Vector(x, y);
  this.size = new Game.Vector(width, height);
  /**
  * TODO: Implement Camera.
  * The Camera must have a setTarget method that will set the tracked children the camera has to follow.
  **/
  // this.camera = new Game.Camera();
  // this.camera.setTarget(this.childrens[0]);
}

/**
* @public {Number|Boolean} addChild - Add a children to this.
* @param {Sprite} child - The children sprite to add.
* @return Returns the child index if succeed, false if not.
**/
Container.prototype.addChild = function (child) {
  if (child instanceof Object === false) throw new Error('Child is not an Object.');
  if (child instanceof Game.Sprite === false) throw new Error('Child is not (extended from) a Sprite.');

  var index = this.childrens.push(child);
  if (this.childrens[index] !== child) return false; // There was an error while pushing the object.

  this.childrens[index]._index = index; // Wow such swag line. o/
  this.childrens[index]._parent = this; // Here we pass an instance of this to the children. Dad's here.

  return index;
};

/**
* @public {Boolean} removeChild - Removes a children from this.
* @public {Sprite|Number} child - The children, can be an instance of Sprite, or the children index in this.
**/
Container.prototype.removeChild  = function (child) {
  if (child instanceof Game.Sprite) { // Here we handle the case in which `child` is a Sprite (or extended class from Sprite).
    if (this.childrens[child._index] === undefined) return false;
    this.childrens.splice(child._index, 1);
    if (this.childrens[child._index] === undefined) return true;
  } else if (child instanceof Number) { // Here we handle the case in which `child` is a Number (the child index).
    if (this.childrens[child] === undefined) return false;
    this.childrens.splice(child, 1);
    if (this.childrens[child] === undefined) return true;
  } else { // Error bro!
    throw new Error('Invalid argument. Child must be a Sprite or a Number.');
    return false;
  }
};
