class GameManager {
    static startGame() {
        if (!game) {
            document.getElementById("svgCon").style.display = 'none';
            game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameContainer', gameState);
        } else {
            GameManager.togglePause();
        }
    }
    static togglePause() {
        game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
        if (game.physics.arcade.isPaused) {
            showMenu();
        } else {
            removeMenu();
        }

        function removeMenu() {
            document.getElementById("svgCon").style.display = 'none';
            document.getElementsByTagName("canvas")[0].style.display = 'block';
        }

        function showMenu() {
            document.getElementsByTagName("canvas")[0].style.display = 'none';
            document.getElementById("svgCon").style.display = 'inline-block';
        }
    }
    static toggleFullScreen() {
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        } else {
            game.scale.startFullScreen(true);
        }
    }

    static addHighscore() {
        mainMenu.updateHighscores(GAME_VARIABLES.score);
    }
}