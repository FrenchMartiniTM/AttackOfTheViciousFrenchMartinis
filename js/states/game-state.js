class GameState {
    constructor(game) {
        this.game = game;
    }

    init() {
        this.ACCLERATION = 300;
        this.DRAG = 400;
        this.MAXSPEED = 400;
        this.FACTOR_DIFFICULTY = 1;  //TODO: Set with score or etc.
        this.EXPLOSION_SPEED = this.EXPLOSION_SPEED || 5;
    }

    create() {
        //  The scrolling bar background
        this.bar = this.game.add.tileSprite(0, 0, 800, 600, 'bar-background');
        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(10, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bulletTimer = 0;
        //  The hero!
        this.player = this.game.add.sprite(400, 500, 'bartender');
        this.player.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.player.body.maxVelocity.setTo(this.MAXSPEED, this.MAXSPEED);
        //player.body.drag.setTo(DRAG, DRAG);

        /*//  Add an emitter for the ship's trail
         shipTrail = game.add.emitter(player.x, player.y + 10, 400);
         shipTrail.width = 10;
         shipTrail.makeParticles('bullet');
         shipTrail.setXSpeed(30, -30);
         shipTrail.setYSpeed(200, 180);
         shipTrail.setRotation(50, -50);
         shipTrail.setAlpha(1, 0.01, 800);
         shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
         shipTrail.start(false, 5000, 10);*/
        //  An explosion pool
        this.explosions = this.game.add.group();
        this.explosions.enableBody = true;
        this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
        this.explosions.createMultiple(30, 'explosion');
        this.explosions.setAll('anchor.x', 0.5);
        this.explosions.setAll('anchor.y', 0.5);
        this.explosions.forEach(function (explosion) {
            explosion.animations.add('explosion');
        });
        //  The baddies!
        this.greenEnemies = this.game.add.group();
        this.greenEnemies.enableBody = true;
        this.greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.greenEnemies.createMultiple(5 * this.FACTOR_DIFFICULTY, 'enemy-green'); //TODO: can add factor to number of enemies in dependence to difficutly level
        this.greenEnemies.setAll('anchor.x', 0.5);//TODO: What is this for
        this.greenEnemies.setAll('anchor.y', 0.5);//TODO: What is this for
        this.greenEnemies.setAll('scale.x', 0.5);
        this.greenEnemies.setAll('scale.y', 0.5);
        this.greenEnemies.setAll('angle', 180);
        this.greenEnemies.setAll('outOfBoundsKill', true);
        this.greenEnemies.setAll('checkWorldBounds', true);

        this.launchGreenEnemy(this.FACTOR_DIFFICULTY, this.greenEnemies, this.game);

    }

    launchGreenEnemy(factor_difficylty, greenEnemies, game) {
        //*/moved to main variables for modification of difficulty by score or other
        var MIN_ENEMY_SPACING = 1000 / 1; //TODO: can work with difficulty
        var MAX_ENEMY_SPACING = 3000 / 1; //TODO: can work with difficulty
        var ENEMY_SPEED = 100 * 1; //TODO: can work with difficulty
        var enemy = this.greenEnemies.getFirstExists(false);
        if (enemy) {
            enemy.reset(this.game.rnd.integerInRange(+100, this.game.width - 100), 0); //TODO: What is this for
            enemy.body.velocity.x = game.rnd.integerInRange(0, 0);
            enemy.body.velocity.y = ENEMY_SPEED;
            enemy.body.drag.x = 100;

            //  Send another enemy soon
            game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), this.launchGreenEnemy, this, factor_difficylty, greenEnemies, game);
        }
    }

    update() {
        //  Scroll the background
        //bar.tilePosition.y = 2; //ours is stationary

        //  Reset the player, then check for movement keys
        this.player.body.velocity.setTo(0, 0);
        this.player.body.acceleration.x = 0;

        /*//  Move ship towards MOUSE pointer
         if (game.input.x < game.width - 1 &&
         game.input.x > 1 &&
         game.input.y > 1 &&
         game.input.y < game.height - 1) {
         var minDist = 100;
         var dist = game.input.x - player.x;
         player.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);
         }*/
        //  Update function for each enemy ship to update rotation etc


        //  Check collisions
        this.game.physics.arcade.overlap(this.player, this.greenEnemies, this.shipCollide, null, this); //TODO: Player live is set to false => GAME OVER
        this.game.physics.arcade.overlap(this.greenEnemies, this.bullets, this.hitEnemy, null, this);

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.MAXSPEED; //without smootness of movement
            //player.body.acceleration.x = -ACCLERATION; //with up
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.MAXSPEED;//without smootness of movement
            //player.body.acceleration.x = ACCLERATION;
        }
        //  Fire bullet
        if (this.fireButton.isDown || this.game.input.activePointer.isDown) {
            this.fireBullet();
        }

        //  Stop at screen edges
        if (this.player.x > this.game.width - 50) {
            this.player.x = this.game.width - 50;
            //player.body.acceleration.x = 0;//with smootness of movement
        }
        if (this.player.x < 50) {
            this.player.x = 50;
            //player.body.acceleration.x = 0;//with smootness of movement
        }
    }

    fireBullet() {


        //Variant I
        //  Grab the first bullet we can from the pool


        /*var bullet = this.bullets.getFirstExists(false);
 
         if (bullet) {
 
 
         /!*!//  And fire it
         bullet.reset(player.x, player.y + 0);//position
         bullet.body.velocity.y = -250;*!/
 
         //  And fire it
         bullet.reset(player.x, player.y + 0);
         bullet.body.velocity.y = -400;
         //  Make bullet come out of tip of ship with right angle
         var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
         bullet.reset(player.x + bulletOffset, player.y);
         bullet.angle = player.angle;
         game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
         bullet.body.velocity.x += player.body.velocity.x;*/


        //Variant II
        //  To avoid them being allowed to fire too fast we set a time limit
        if (this.game.time.now > this.bulletTimer) {
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 450;
            //  Grab the first bullet we can from the pool
            var bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                //  And fire it
                //  Make bullet come out of tip of ship with right angle
                bullet.reset(this.player.x, this.player.y + 0); //The Reset component allows a Game Object to be reset and repositioned to a new location.
                bullet.body.velocity.y = -500;

                //Create offset if object under angle
                /*var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                 bullet.reset(player.x + bulletOffset, player.y);
                 bullet.angle = player.angle;
                 game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                 bullet.body.velocity.x += player.body.velocity.x;*/

                this.bulletTimer = this.game.time.now + BULLET_SPACING;
            }
        }
    }

    shipCollide(player, enemy) {//TODO: Player live is set to false => GAME OVER
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', this.EXPLOSION_SPEED, false, true);
        enemy.kill();
    }

    hitEnemy(enemy, bullet) {
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', this.EXPLOSION_SPEED, false, true);
        enemy.kill();
        bullet.kill()
    }
}
