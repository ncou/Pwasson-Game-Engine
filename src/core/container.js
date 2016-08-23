/**
* @class Container - A simple object that can have childrens.
**/
function Container () {
  this._className = 'Container';

  this.childrens = [];
  this.position = new Game.Vector(x, y);
  this.size = new Game.Vector(width, height);
}

/**
* @public {int|bool} addChild - Add a children to this.
* @param {Sprite} child - The children sprite to add.
* @return Returns the child index if succeed, false if not.
**/
Container.prototype.addChild = function (child) {
  if (typeof child !== 'object') throw new Error('Child is not an Object.');
  if (child._className != 'Sprite') throw new Error('Child is not a Sprite.');

  var index = this.childrens.push(child);
  if (this.childrens[index] !== child) return false; // There was an error while pushing the object.

  this.childrens[index]._index = index; // Wow such swag line. o/
  this.childrens[index]._parent = this; // Here we pass an instance of this to the children. Dad's here.

  return index;
};

/**
* @public {bool} removeChild - Removes a children from this.
* @public {Sprite|int} child - The children, can be an instance of Sprite, or the children index in this.
**/
Container.prototype.removeChild  = function (child) {
  if (child._className === 'Sprite') { // Here we handle the case in which `child` is a Sprite.
    if (this.childrens[child._index] === undefined) return false;
    this.childrens.splice(child._index, 1);
    if (this.childrens[child._index] === undefined) return true;
  } else if (typeof child === 'number') { // Here we handle the case in which `child` is a Number.
    if (this.childrens[child] === undefined) return false;
    this.childrens.splice(child, 1);
    if (this.childrens[child] === undefined) return true;
  } else { // Error bro!
    throw new Error('Invalid argument. Child must be a Sprite OR a Number.');
    return false;
  }
};
