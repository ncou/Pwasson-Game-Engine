/**
* @class Button - Defines a simple button with text.
* @extends Sprite
* @param {String} text - The button text.
* @param {Number} x - The button position in X.
* @param {Number} y - The button position in Y.
* @param {Number} width - The button width.
* @param {Number} height - The button height.
* @param {Object} properties - The button properties. You can use any Sprite properties here.
*
* @property {Vector} padding - The padding between the text and the button.
**/
function Button (text, x, y, width, height, properties) {
  this._className = 'Button';

  this.text = text;
  this.position = new Game.Vector(x, y);
  this.size = new Game.Vector(width, height);
  this.anchor = new Game.Vector(.5, .5);
  this.padding = new Game.Vector(0, 0);
  Game.merge(this, properties);
  
  this._init();
}

// Javascript shit to extend another "class"...
Button.prototype = Object.create(Game.Sprite.prototype);
Button.prototype.constructor = Button;

/**
* @public {void} draw - Draw the Button.
* @param {Number} delta - The scene delta time.
**/
Button.prototype.draw = function (delta) {
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
            Game.context.rect(
              this.position.x, this.position.y,
              this.size.x + this.padding.x, this.size.y + this.padding.y
            );
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
        
        if (this.shadowColor !== null) {
          Game.context.shadowBlur = this.shadowBlur;
          Game.context.shadowColor = this.shadowColor;
          Game.context.shadowOffsetX = this.shadowOffset.x;
          Game.context.shadowOffsetY = this.shadowOffset.y;
        }
        
        if (this.texture != null && Game.Engine.loader.getTexture(this.texture) != false) {
          Game.context.clip();
          var image = Game.Engine.loader.getTexture(this.texture);
          if (image.type == 'svg') { // SVG files needs a width/height to be properly drawn. :x
            image.width = this.size.x + this.padding.x;
            image.height = this.size.y + this.padding.y;
            Game.context.drawImage(
              image,
              this.position.x, this.position.y,
              this.size.x + this.padding.x, this.size.y + this.padding.y
            );
          } else {
            Game.context.drawImage(
              image,
              this.position.x, this.position.y,
              this.size.x + this.padding.x, this.size.y + this.padding.y
            );
          }
        } else {
          if (this.bgColor !== null) {
            Game.context.fillStyle = this.bgColor;
            Game.context.fill();
          }
          if (this.borderSize > 0 && this.borderColor !== null) {
            Game.context.strokeStyle = this.borderColor;
            Game.context.lineWidth = this.borderSize;
            Game.context.lineJoin = this.lineJoin;
            Game.context.stroke();
          }
        }
        
        Game.context.font = [
          this.fontStyle,
          this.fontSize + 'pt',
          this.fontFamily
        ].join(' ');
        this.computeBounds();
        
        if (this.fontColor !== null) {
          Game.context.fillStyle = this.fontColor;
          
          // Needed else Google Chrome doesn't display text when maxWidth is null.
          if (this.maxWidth == null) {
            Game.context.fillText(
              this.text, this.position.x + this.padding.x,
              (this.position.y + this.fontSize) + this.padding.y
            );
          } else {
            Game.context.fillText(
              this.text, this.position.x + this.padding.x,
              (this.position.y + this.fontSize) + this.padding.y, this.maxWidth
            );
          }
        }

        if (this.borderSize > 0 && this.borderColor !== null) {
          Game.context.strokeStyle = this.borderColor;
          Game.context.lineWidth = this.borderSize;
          Game.context.lineJoin = this.lineJoin;
          
          // Needed else Google Chrome doesn't display text when maxWidth is null.
          if (this.maxWidth == null) {
            Game.context.strokeText(
              this.text, this.position.x + this.padding.x,
              (this.position.y + this.fontSize) + this.padding.y
            );
          } else {
            Game.context.strokeText(
              this.text, this.position.x + this.padding.x,
              (this.position.y + this.fontSize) + this.padding.y, this.maxWidth
            );
          }
        }
      Game.context.closePath();
    Game.context.restore();
};

// Export Button as Game.Button:
Game.Button = Button;

