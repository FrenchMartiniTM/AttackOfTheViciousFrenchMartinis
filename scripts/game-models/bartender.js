class Bartender extends Phaser.Sprite {
    constructor(game, image) {
        super(game, PLAYER.STARTING_POSITION_X, PLAYER.STARTING_POSITION_Y, image);
        this.anchor.setTo(0.5, 0.5);
        this.lives = 3;
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(10, 35);
        this.body.maxVelocity.setTo(PLAYER.MAX_SPEED, PLAYER.MAX_SPEED);
        game.add.existing(this);
    }

    update() {
        if (this.x > this.game.width - 50) {
            this.x = this.game.width - 50;
        }

        if (this.x < 50) {
            this.x = 50;
        }
    }

    moveLeft() {
        this.body.velocity.x = -PLAYER.MAX_SPEED;
    }

    moveRight() {
        this.body.velocity.x = PLAYER.MAX_SPEED;
    }
}