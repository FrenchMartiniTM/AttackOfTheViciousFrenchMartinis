function startGame() {
    removeMenu();

    const game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameContainer', {
        preload,
        create,
        update,
        render
    });

    var player,
        playerHead,
        isAlive = true,

        bar,
        barborder,

        cursors,
        score = 0,
        scoreText,

        bullets,
        bulletTimer = 0,

        fireButton,
        explosions,
        greenEnemies,
        enemyLaunchTimer,

        pauseKey,
        pauseImage,

        hearts,
        livesCount = 3,

        gameOverMessage = 'GAME OVER!',
        gameOverText,

        fullScreenButton,
        fullScreenKey,

        highscores = [0, 0, 0, 0, 0];

    const ACCLERATION = 300, // Not in use
        DRAG = 400; // Not in use


    function preload() {
        game.load.image('bar', 'assets/images/bar.png');
        game.load.image('player', 'assets/images/Bartender_80_88_invert.png');
        game.load.image('bullet', 'assets/images/green_olive_15_19.png');
        game.load.image('enemy-green', 'assets/images/glass_80_115_rotated.png');
        game.load.spritesheet('explosion', 'assets/images/explode.png', 133, 95, 6);
        game.load.image('barborder', './assets/images/barborder.png');
        game.load.image('playerhead', './assets/images/playerhead.png');
        game.load.image('paused', './assets/images/paused.png');
        game.load.image('heart', './assets/images/heart.png');
        game.load.image('fullscreen', './assets/images/fullscreen.png')
    }

    function create() {
        //Alligning the game to the center of the window
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.forcePortrait = true;

        //Setting Arcade Physics system for all objects in the game
        game.physics.startSystem(Phaser.Physics.ARCADE);

        bar = game.add.tileSprite(0, 0, 800, 600, 'bar');
        barborder = game.add.sprite(BAR.BORDER_POSITION_X, BAR.BORDER_POSITION_Y, 'barborder');
        game.physics.enable(barborder, Phaser.Physics.ARCADE);
        barborder.body.immovable = true;
        //barborder.alpha = 0; // uncomment if you want the red line to disappear

        gameOverText = game.add.text(game.world.centerX, game.world.centerY, gameOverMessage, { font: '84px Arial', fill: '#fff' });
        gameOverText.anchor.setTo(0.5, 0.5);
        gameOverText.kill();

        scoreText = game.add.text(600, 550, 'score: 0', { fontSize: '32px', fill: '#F00' });

        //Hearts group
        hearts = game.add.group();
        addHearts();

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
        player = game.add.sprite(PLAYER.STARTING_POSITION_X, PLAYER.STARTING_POSITION_Y, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.events.onKilled.add(endGame);

        game.physics.enable(player, Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        player.body.maxVelocity.setTo(PLAYER.MAX_SPEED, PLAYER.MAX_SPEED);
        //player.body.drag.setTo(DRAG, DRAG);

        // Setting the player head. 
        playerHead = game.add.sprite(PLAYER.HEAD.STARTING_POSITION_X, PLAYER.HEAD.STARTING_POSITION_Y, 'playerhead');
        game.physics.enable(playerHead, Phaser.Physics.ARCADE);
        //playerHead.alpha = 0; // uncomment if you want the red line to disappear

        /*//  Add an emitter for the player's trail
         playerTrail = game.add.emitter(player.x, player.y + 10, 400);
         playerTrail.width = 10;
         playerTrail.makeParticles('bullet');
         playerTrail.setXSpeed(30, -30);
         playerTrail.setYSpeed(200, 180);
         playerTrail.setRotation(50, -50);
         playerTrail.setAlpha(1, 0.01, 800);
         playerTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
         playerTrail.start(false, 5000, 10);*/

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
        greenEnemies.createMultiple(5 * GLASS.FACTOR_DIFFICULTY, 'enemy-green'); //TODO: can add factor to number of enemies in dependence to difficutly level
        greenEnemies.setAll('anchor.x', 0.5); //places the anchor in the exact middle of the sprite, horizontally and vertically.
        greenEnemies.setAll('anchor.y', 0.5); //places the anchor in the exact middle of the sprite, horizontally and vertically.
        greenEnemies.setAll('scale.x', 0.5);
        greenEnemies.setAll('scale.y', 0.5);
        greenEnemies.setAll('angle', 180);
        greenEnemies.setAll('outOfBoundsKill', true); //the object is killed when out of the boundaries
        greenEnemies.setAll('checkWorldBounds', true); // it checks every time if it's out of the bounds

        greenEnemies.forEach(function (enemy) {
            enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
            enemy.events.onKilled.add(killEnemy);
        });

        launchGreenEnemy();

        pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
        pauseKey.onDown.add(togglePause, this);
        pauseImage = game.add.sprite(250, 100, 'paused');
        pauseImage.kill();

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        fullScreenButton = game.add.button(game.width - 32, 0, 'fullscreen', toggleFullScreen, this, null, null, null);
        fullScreenKey = this.input.keyboard.addKey(Phaser.Keyboard.F);
        fullScreenKey.onDown.add(toggleFullScreen, this);
    }

    function update() {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);
        //player.body.acceleration.x = 0;
        playerHead.body.velocity.setTo(0, 0);
        //playerHead.body.acceleration.x = 0;

        /*//  Move player towards MOUSE pointer
         if (game.input.x < game.width - 1 &&
         game.input.x > 1 &&
         game.input.y > 1 &&
         game.input.y < game.height - 1) {
         var minDist = 100;
         var dist = game.input.x - player.x;
         player.body.velocity.x = PLAYER.MAX_SPEED * game.math.clamp(dist / minDist, -1, 1);
         }*/
        //  Update function for each enemy player to update rotation etc

        //  Check collisions
        game.physics.arcade.overlap(playerHead, greenEnemies, playerCollide, null, this);
        game.physics.arcade.overlap(greenEnemies, bullets, hitEnemy, null, this);
        game.physics.arcade.overlap(barborder, greenEnemies, barCollide, null, this);

        function fireBullet() {
            //Variant I
            //  Grab the first bullet we can from the pool
            /*var bullet = bullets.getFirstExists(false);
    
             if (bullet) {
             bullet.reset(player.x, player.y); //The Reset component allows a Game Object to be reset and repositioned to a new location.
             bullet.body.velocity.y = -500;
             
             //  Make bullet come out of tip of player with right angle
             var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
             bullet.reset(player.x + bulletOffset, player.y);
             bullet.angle = player.angle;
             game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET.SPEED, bullet.body.velocity);
             bullet.body.velocity.x += player.body.velocity.x;*/

            //Variant II
            //  To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > bulletTimer) {
                var bullet = bullets.getFirstExists(false);

                if (bullet) {
                    bullet.reset(player.x, player.y); //The Reset component allows a Game Object to be reset and repositioned to a new location.
                    bullet.body.velocity.y = -500;

                    bulletTimer = game.time.now + BULLET.SPACING;
                }
            }
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -PLAYER.MAX_SPEED; //without smootness of movement
            //player.body.acceleration.x = -ACCLERATION; //with up
            playerHead.body.velocity.x = -PLAYER.MAX_SPEED;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = PLAYER.MAX_SPEED; //without smootness of movement
            //player.body.acceleration.x = ACCLERATION;
            playerHead.body.velocity.x = PLAYER.MAX_SPEED;
        }

        if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
            fireBullet();
        }

        //  Stop at screen edges
        if (player.x > game.width - 50) {
            player.x = game.width - 50;
            playerHead.x = player.x - 3;
            //player.body.acceleration.x = 0;//with smootness of movement
        }
        if (player.x < 50) {
            player.x = 50;
            playerHead.x = player.x - 3;
            //player.body.acceleration.x = 0;//with smootness of movement
        }
    }

    function render() {

    }

    function playerCollide(playerHead, enemy) {
        hearts.callAll('kill');
        player.kill();
    }

    function barCollide(bar, enemy) {
        enemy.kill();
        hearts.children.pop().kill();

        livesCount -= 1;
        if (livesCount <= 0) {
            player.kill();
        }
    }

    function hitEnemy(enemy, bullet) {
        enemy.kill();
        bullet.kill();

        score += 10;
        scoreText.text = 'Score: ' + score;
    }

    function killEnemy(enemy) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', EXPLOSION.SPEED, false, true);
    }

    function launchGreenEnemy() {
        var MIN_ENEMY_SPACING = 1000 / GLASS.FACTOR_DIFFICULTY, //TODO: can work with difficulty
            MAX_ENEMY_SPACING = 3000 / GLASS.FACTOR_DIFFICULTY, //TODO: can work with difficulty
            ENEMY_SPEED = 100 * GLASS.FACTOR_DIFFICULTY, //TODO: can work with difficulty
            enemy = greenEnemies.getFirstExists(false);

        if (enemy) {
            enemy.reset(game.rnd.integerInRange(+100, game.width - 100), 0); //The Reset component allows a Game Object to be reset 
            //and repositioned to a new location.
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = ENEMY_SPEED;
            enemy.body.drag.x = 100;

            //  Send another enemy soon
            enemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGreenEnemy);
        }
    }

    function addHearts() {
        for (var i = 0; i < livesCount; i += 1) {
            hearts.create(5 + i * 33, 560, 'heart');
        }
    }

    function togglePause() {
        if (!isAlive) {
            return;
        }

        game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
        if (game.physics.arcade.isPaused) {
            pauseImage.revive();
        } else {
            pauseImage.kill();
        }
    }

    function endGame() {
        isAlive = false;
        hearts.children = [];
        gameOverText.revive();
        playerHead.kill();
        greenEnemies.callAll('kill');
        game.time.events.remove(enemyLaunchTimer);

        spaceRestart = fireButton.onDown.addOnce(restart, this);
    }

    function restart() {
        isAlive = true;
        gameOverText.kill();
        launchGreenEnemy();
        player.reset(PLAYER.STARTING_POSITION_X, PLAYER.STARTING_POSITION_Y);
        playerHead.reset(PLAYER.HEAD.STARTING_POSITION_X, PLAYER.HEAD.STARTING_POSITION_Y);

        addHighscore();
        resetStartingGameStats();
    }

    function toggleFullScreen() {
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        }
        else {
            game.scale.startFullScreen(true);
        }
    }
    function resetStartingGameStats() {
        score = 0;
        scoreText.text = 'Score: 0';
        livesCount = 3;
        addHearts();
    }
    function addHighscore() {
        if (highscores.some(highscore => highscore < score)) {
            highscores[highscores.length - 1] = score;
            highscores.sort((a, b) => b - a);
        }
    }
    function removeMenu(){
        document.getElementById("svgCon").style.display = 'none';
    }
}