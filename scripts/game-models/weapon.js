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
            return;
        }

        let bulletsCount = weaponLevel + weaponLevel - 1,
            fireSpeed = bulletsCount * 100,
            angles = [0, 20, -20, 40, -40],
            bullet;

        for (let i = 0; i < bulletsCount; i += 1) {
            bullet = this.getFirstExists(false);
            if (bullet) {
                bullet.reset(player.x, player.y);
                bullet.angle = angles[i];

                this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET.SPEED, bullet.body.velocity);
                bullet.body.velocity.y = -BULLET.SPEED * factorDifficulty;
            }
            this.timer = game.time.now + ((BULLET.SPACING + fireSpeed) / factorDifficulty);
        }
    }
}