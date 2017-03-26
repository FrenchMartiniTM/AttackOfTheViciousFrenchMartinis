class GameManager {
    constructor() {
        this._highscores = [
                ["Bartender", 0],
                ["Bartender", 0],
                ["Bartender", 0],
                ["Bartender", 0],
                ["Bartender", 0]
        ];
        this._playerName = "Bartender";
        this._playerScore = 0;
        this._scripts = {
                "lib": "./scripts/libraries/phaser.js",
                "menu": "./scripts/main-menu.js",
                "constants": "./scripts/common/constants.js",
                "game": "./scripts/game.js"
        };
        this._styles = [ "styles/stylesheet.css" ];
        this.load();
    }

    load() {
        this.loadStyle(this._styles[0]);
        this.loadScript("constants", this._scripts["constants"]);
        this.loadScript("lib", this._scripts["lib"]);
        this.loadScript("menu", this._scripts["menu"]);
    }

    loadScript(id, source) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = source;
        script.id = id;
        document.head.appendChild(script);
    }

    loadStyle(source) {
        const link = document.createElement("link");
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = source;
        document.head.appendChild(link);
    }

    updateHighscores(highscore) {
        this._highscores.push([this._playerName, highscore]);

        this._highscores.sort(function(a, b) {
            return b[1] - a[1];
        });

        this._highscores.pop();
    }

    launchMenu(input) {
        if (typeof input === 'number') {
            this.updateHighscores(input);
        }
        else if (typeof input === 'string') {
            this._playerName = input;
        }
        
        this._menu = new MainMenu(this._playerName, this._highscores);
        this._menu.launch();
    }
}

var gameManager = new GameManager();