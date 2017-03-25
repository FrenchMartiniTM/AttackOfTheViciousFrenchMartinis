class Bartender extends Phaser.Sprite {
  constructor(game, image) {
    super(game, PLAYER.STARTING_POSITION_X, PLAYER.STARTING_POSITION_Y, image);
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    game.add.existing(this);
  }

  update() {
    //  Stop at screen edges
    if (player.x > game.width - 50) {
      player.x = game.width - 50;
      playerHead.x = player.x - 3;
    }

    if (player.x < 50) {
      player.x = 50;
      playerHead.x = player.x - 3;
    }
  }

  moveLeft() {
    this.body.velocity.x = -PLAYER.MAX_SPEED;
  }

  moveRight() {
    this.body.velocity.x = PLAYER.MAX_SPEED;
  }
}