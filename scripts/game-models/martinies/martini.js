class Martini extends Phaser.Sprite {
  constructor(game, image) {
    super(game, 0, 0, image);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.5, 0.5);
    this.angle = 0;
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
  }  
}