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
  if (child instanceof Game.Sprite === false) throw new Error('Child must be a Sprite or should be extended from Sprite.');

  if (child._parent !== undefined) { // If the children already has a parent, let's remove it.
    child._parent.removeChild(child);
  }

  this.childrens.push(child);
  var index = this.childrens.length - 1;

  if (this.childrens[index] !== child) { // There was an error while pushing the object.
    return false;
  }

  this.childrens[index]._index = index; // Wow such swag line. o/
  this.childrens[index]._parent = this; // Here we pass an instance of this to the children. Dad's here.
  
  this.onChildrenAdded(index, child);
  return index;
};

/**
* @public {Boolean} removeChild - Removes a children from this.
* @public {Sprite|Number} child - The children, can be an instance of Sprite, or the children index in this.
**/
Container.prototype.removeChild  = function (child) {
  var index = -1;

  if (child instanceof Game.Sprite) { // Here we handle the case in which `child` is a Sprite (or extended class from Sprite).
    index = this.childrens.indexOf(child);
  } else if (child instanceof Number) { // Here we handle the case in which `child` is a Number (the child index).
    index = child;
  } else { // Error bro!
    throw new Error('Invalid argument. Child must be a Sprite or a Number.');
    return false;
  }
  
  if (index !== -1) {
    this.removeItems(this.childrens, index, 1);
    this.onChildrenRemoved(index);
    
    if (this.childrens[index] === undefined)  return true;
  }
  
  return false;
};

/**
* @public {void} removeItems - Remove n items at i position in the array.
* @from https://github.com/pixijs/pixi.js/blob/ace34bfeec0a5035c50555f3fb1c84a78eb8d246/src/core/utils/index.js#L193
* @param {Array<*>} array - The array to remove items from.
* @param {Number} startIndex - The index to remove from (inclusive).
* @param {Number} removeCount - The number of items to remove.
**/
Container.prototype.removeItems = function (array, startIndex, removeCount) {
  var length = array.length;
  if (startIndex >= length || removeCount === 0) return;
  
  removeCount = (startIndex + removeCount > length) ? length - startIndex : removeCount;
  for (var i = startIndex, len = length - removeCount; i < len; i++) {
    arr[i] = arr[i + removeCount];
  }
  
  arr.length = len;
};

/**
* @event onChildrenAdded - Emited once a children get added to the container.
* @param {Number} index - The index of the child that got added.
* @param {Sprite} child - The child that got added.
**/
Container.prototype.onChildrenAdded = function (index, child) {};

/**
* @event onChildrenRemoved - Emited once a children gets removed from the container.
* @param {Number} index - The index of the child that got removed.
**/
Container.prototype.onChildrenRemoved = function (index) {};

