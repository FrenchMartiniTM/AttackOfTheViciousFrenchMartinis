var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-demo', {
    preload: preload,
    create: create,
    update: update,
    render: render

});

var player;
var starfield;
var cursors;
var ACCLERATION = 300;
var DRAG = 400;
var MAXSPEED = 400;
//var bank; //to rotate player
//var shipTrail;
var bullets;
var fireButton;
var bulletTimer = 0;
var greenEnemies;
var FACTOR_DIFFICULTY = 1;//TODO: Set with score or etc.
var explosions;
var EXPLOSION_SPEED = 5;


function preload() {
    game.load.image('starfield', '/assets/bar.png');
    game.load.image('ship', '/assets/Bartender_80_88_invert.png');
    game.load.image('bullet', '/assets/green_olive_15_19.png');
    game.load.image('enemy-green', '/assets/glass_80_115_rotated.png');
     game.load.spritesheet('explosion', '/assets/explode.png',128, 128);

}

function create() {
    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(10, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
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
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach(function (explosion) {
        explosion.animations.add('explosion');
    });
    //  The baddies!
    greenEnemies = game.add.group();
    greenEnemies.enableBody = true;
    greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
    greenEnemies.createMultiple(5 * FACTOR_DIFFICULTY, 'enemy-green'); //TODO: can add factor to number of enemies in dependence to difficutly level
    greenEnemies.setAll('anchor.x', 0.5);//TODO: What is this for
    greenEnemies.setAll('anchor.y', 0.5);//TODO: What is this for
    greenEnemies.setAll('scale.x', 0.5);
    greenEnemies.setAll('scale.y', 0.5);
    greenEnemies.setAll('angle', 180);
    greenEnemies.setAll('outOfBoundsKill', true);
    greenEnemies.setAll('checkWorldBounds', true);


    launchGreenEnemy();
    function launchGreenEnemy() {
        //*/moved to main variables for modification of difficulty by score or other
        var MIN_ENEMY_SPACING = 1000 / FACTOR_DIFFICULTY; //TODO: can work with difficulty
        var MAX_ENEMY_SPACING = 3000 / FACTOR_DIFFICULTY; //TODO: can work with difficulty
        var ENEMY_SPEED = 100 * FACTOR_DIFFICULTY; //TODO: can work with difficulty
        var enemy = greenEnemies.getFirstExists(false);
        if (enemy) {
            enemy.reset(game.rnd.integerInRange(+100, game.width - 100), 0); //TODO: What is this for
            enemy.body.velocity.x = game.rnd.integerInRange(0, 0);
            enemy.body.velocity.y = ENEMY_SPEED;
            enemy.body.drag.x = 100;


            //  Send another enemy soon
            game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGreenEnemy);
        }


    }
}
function update() {
    //  Scroll the background
    //starfield.tilePosition.y = 2; //ours is stationary

    //  Reset the player, then check for movement keys
    player.body.velocity.setTo(0, 0);
    player.body.acceleration.x = 0;

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
    game.physics.arcade.overlap(player, greenEnemies, shipCollide, null, this); //TODO: Player live is set to false => GAME OVER
    game.physics.arcade.overlap(greenEnemies, bullets, hitEnemy, null, this);

    function fireBullet() {


        //Variant I
        //  Grab the first bullet we can from the pool


        /*var bullet = bullets.getFirstExists(false);

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
        if (game.time.now > bulletTimer) {
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 450;
            //  Grab the first bullet we can from the pool
            var bullet = bullets.getFirstExists(false);

            if (bullet) {
                //  And fire it
                //  Make bullet come out of tip of ship with right angle
                bullet.reset(player.x, player.y + 0); //The Reset component allows a Game Object to be reset and repositioned to a new location.
                bullet.body.velocity.y = -500;

                //Create offset if object under angle
                /*var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                 bullet.reset(player.x + bulletOffset, player.y);
                 bullet.angle = player.angle;
                 game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                 bullet.body.velocity.x += player.body.velocity.x;*/

                bulletTimer = game.time.now + BULLET_SPACING;
            }
        }
    }

    if (cursors.left.isDown) {
        player.body.velocity.x = -MAXSPEED; //without smootness of movement
        //player.body.acceleration.x = -ACCLERATION; //with up
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = MAXSPEED;//without smootness of movement
        //player.body.acceleration.x = ACCLERATION;
    }
//  Fire bullet
    if (fireButton.isDown || game.input.activePointer.isDown) {
        fireBullet();
    }


//  Stop at screen edges
    if (player.x > game.width - 50) {
        player.x = game.width - 50;
        //player.body.acceleration.x = 0;//with smootness of movement
    }
    if (player.x < 50) {
        player.x = 50;
        //player.body.acceleration.x = 0;//with smootness of movement
    }


}

function render() {

}
function shipCollide(player, enemy) {//TODO: Player live is set to false => GAME OVER
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', EXPLOSION_SPEED, false, true);
    enemy.kill();
}
function hitEnemy(enemy, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', EXPLOSION_SPEED, false, true);
    enemy.kill();
    bullet.kill()
}
