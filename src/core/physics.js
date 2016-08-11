/**
* @namespace Physics - The game engine built-in physic engine.
**/
var Physics = {};

/**
* @enum CollisionDirection - The possible collision directions the CollisionSolver can use.
**/
Physics.CollisionDirection = {
  NONE: -1,
  TOP: 0,
  LEFT: 1,
  RIGHT: 2,
  DOWN: 3,
};

// Export Physics as Game.Physics
Game.Physics = Physics;

