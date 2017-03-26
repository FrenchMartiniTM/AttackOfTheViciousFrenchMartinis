class Weapon extends Phaser.Group {
  constructor(game, bullets) {
    super(game);
    this.game = game;
    this.enableBody = true;
    this.timer = 0,
      this.addMultiple(bullets);
    this.setAll('exists', false);
    this.physicsBodyType = Phaser.Physics.ARCADE;
    game.add.existing(this);
  }

  fireBullet(weaponLevel, player, factorDifficulty) {
    if (this.game.time.now < this.timer) {
      return false;
    }

    switch (weaponLevel) {
      case 1:
        {
          let bullet = this.getFirstExists(false);

          if (bullet) {
            bullet.reset(player.x, player.y); //The Reset component allows a Game Object to be reset and repositioned to a new location.
            bullet.body.velocity.y = -BULLET.SPEED * factorDifficulty;

            this.timer = this.game.time.now + (BULLET.SPACING / factorDifficulty);
          }
        }
        break;

      case 2:
        {
          for (let i = 0; i < 3; i += 1) {
            let bullet = this.getFirstExists(false);
            if (bullet) {
              //  Make bullet come out of tip of ship with right angle
              let bulletOffset = 20 * Math.sin(this.game.math.degToRad(player.angle));
              bullet.reset(player.x + bulletOffset, player.y);
              //  "Spread" angle of 1st and 3rd bullets
              let spreadAngle;
              if (i === 0) spreadAngle = -20;
              if (i === 1) spreadAngle = 0;
              if (i === 2) spreadAngle = 20;
              bullet.angle = player.angle + spreadAngle;
              this.game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET.SPEED, bullet.body.velocity);
              bullet.body.velocity.y = -BULLET.SPEED * factorDifficulty;
            }
            this.timer = game.time.now + ((BULLET.SPACING + 300) / factorDifficulty);
          }
        }
        break;

      case 3:
        {
          for (let i = 0; i < 5; i += 1) {
            let bullet = this.getFirstExists(false);
            if (bullet) {
              //  Make bullet come out of tip of ship with right angle
              let bulletOffset = 20 * Math.sin(this.game.math.degToRad(player.angle));
              bullet.reset(player.x + bulletOffset, player.y);
              //  "Spread" angle of 1st and 3rd bullets
              var spreadAngle;
              if (i === 0) spreadAngle = -20;
              if (i === 1) spreadAngle = 0;
              if (i === 2) spreadAngle = 20;
              if (i === 3) spreadAngle = 40;
              if (i === 4) spreadAngle = -40;
              bullet.angle = player.angle + spreadAngle;
              this.game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET.SPEED, bullet.body.velocity);
              bullet.body.velocity.y = -BULLET.SPEED * factorDifficulty;
            }
            this.timer = game.time.now + ((BULLET.SPACING + 300) / factorDifficulty);
          }
        }
        break;

      default:
        throw new Error("Weapon level not defined.");
    }
  }
}