class SvgUtils {
    static createSVG(tag, attrs) {
        let el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (let attr in attrs) {
            el.setAttribute(attr, attrs[attr]);
        }

        return el;
    }
}

class MainMenu {
    constructor(highscores) {
        if (typeof highscores === "undefind") {
            highscores = [];
        }
        this._playerName = "Bartender"
        this._highscores = [
            ["Bartender", 10000],
            ["Bartender", 1000],
            ["Bartender", 100],
            ["Bartender", 10],
            ["Bartender", 0]
        ];
    }

    get playerName() {
        return this._playerName;
    }

    set playerName(value) {
        this._playerName = value;
    }

    updateHighscores(score) {
        this._highscores.push([this._playerName, score]);

        this._highscores.sort(function(a, b) {
            return b[1] - a[1];
        });

        this._highscores.pop();
    }

    load() {
        const buttonLabels = ["Start Game", "Controls", "Highscores", "Credits", "Quit Game"],
            buttonIds = ["start", "controls", "highscores", "credits", "quit"],
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            buttonHight = 50,
            buttonWidth = 240,
            svgWidth = 800,
            svgHight = 600,
            buttonsStartX = 270,
            buttonsStartY = 210,
            labelsStartX = 270,
            labelsStartY = 250,
            step = 80;
        svg.setAttribute("id", "svgCon");
        svg.setAttribute("width", svgWidth);
        svg.setAttribute("height", svgHight);
        svg.setAttribute("viewBox", "0 0 800 600");
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

        const logo = SvgUtils.createSVG("image", {
            "id": "logo",
            "width": 756,
            "height": 152,
            "x": "22",
            "y": "50"
        });
        logo.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/logo.png");
        svg.appendChild(logo);

        for (let i = 1; i <= 20; i += 1) {
            const backgroundGlass = SvgUtils.createSVG("image", {
                "class": "background-glass",
                "y": -200,
                "style": "pointer-events: none;",
                "width": 80,
                "height": 115
            });
            if ((i % 3) === 0) {
                backgroundGlass.setAttribute("transform", "rotate(45)");
            }

            if ((i % 2) === 0) {
                backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/glass_80_115.png");
                backgroundGlass.setAttribute("x", "-200");
                const animateX = SvgUtils.createSVG("animate", {
                    "attributeName": "x",
                    "from": (-40 * i) - 100,
                    "to": 900 + (40 * i),
                    "dur": (i % 5) + i + "s",
                    "attributeType": "XML",
                    "repeatCount": "indefinite",
                    "begin": (i % 3) + i + "s"
                });
                backgroundGlass.appendChild(animateX);
            } else {
                backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/redmartini.png");
                backgroundGlass.setAttribute("x", "1000");
                const animateX = SvgUtils.createSVG("animate", {
                    "attributeName": "x",
                    "from": 900 + (40 * i),
                    "to": (-40 * i) - 100,
                    "dur": (i % 6) + i + "s",
                    "attributeType": "XML",
                    "repeatCount": "indefinite",
                    "begin": (i % 3) + i + "s"
                });
                backgroundGlass.appendChild(animateX);
            }

            const animateY = SvgUtils.createSVG("animate", {
                "attributeName": "y",
                "from": -300,
                "to": 1000,
                "dur": (i % 5) + i + "s",
                "attributeType": "XML",
                "repeatCount": "indefinite",
                "begin": (i % 3) + i + "s"
            });
            backgroundGlass.appendChild(animateY);

            svg.appendChild(backgroundGlass);
        }

        for (let i in buttonLabels) {
            const button = SvgUtils.createSVG("rect", {
                "class": "button-menu",
                "width": buttonWidth,
                "height": buttonHight,
                "id": buttonIds[i],
                "rx": "10",
                "ry": "10",
                "x": buttonsStartX,
                "y": i * step + buttonsStartY
            });

            button.addEventListener("click", this.onClick, false);

            const buttonLabel = SvgUtils.createSVG("text", {
                "class": "button-text",
                "x": labelsStartX + buttonWidth / (4 * buttonLabels[i].length),
                "y": i * step + labelsStartY,
                "textLength": (buttonWidth - (buttonWidth / (2 * buttonLabels[i].length) | 0)),
                "lengthAdjust": "spacingAndGlyphs",
                "stroke": "#ff0000",
                "font-family": "Copperplate Gothic Light",
                "font-size": "40px"
            });

            buttonLabel.innerHTML = buttonLabels[i];
            svg.appendChild(buttonLabel);
            svg.appendChild(button);
        }

        let top = document.getElementById("top");
        if (top === null) {
            top = document.createElement("div");
            top.setAttribute("id", "top");
            document.body.appendChild(top);
        }
        top.appendChild(svg);
    }

    onBodyResize() {
        const resizedWidth = this.innerWidth;
        const resizedHeight = this.innerHeight;
        const resizedX = (((resizedWidth - 800) / 2) | 0) < 0 ? 0 : (((resizedWidth - 800) / 2) | 0);
        const resizedY = (((resizedHeight - 600) / 2) | 0) < 0 ? 0 : (((resizedHeight - 600) / 2) | 0);
        const topCon = this.document.getElementById("top");
        if (topCon !== null) {
            topCon.setAttribute("style", "margin-left: " + resizedX + "px; margin-top: " + resizedY + "px;");
        }
    }

    onClick() {
        const targetId = this.id;
        if (targetId === "start") {
            document.getElementById('svgCon').style.display = 'none';
            startGame();
        } else if (targetId === "controls" || targetId === "highscores" || targetId === "credits") {
            const svg = document.getElementById("svgCon");
            let infoPanel = SvgUtils.createSVG("rect", {
                "class": "info-panel",
                "width": 600,
                "height": 480,
                "id": "info",
                "rx": "20",
                "ry": "20",
                "x": 100,
                "y": 100
            });

            const buttonHight = 40,
                buttonWidth = 180,
                svgWidth = 800,
                svgHight = 600,
                buttonText = "Close";

            const closeButtonLabel = SvgUtils.createSVG("text", {
                "class": "button-text",
                "x": 320,
                "y": 555,
                "id": "button-label",
                "textLength": (buttonWidth - ((buttonWidth / buttonText.length) | 0)),
                "lengthAdjust": "spacingAndGlyphs",
                "stroke": "#ff0000",
                "font-family": "Copperplate Gothic Light",
                "font-size": "30px"
            });

            closeButtonLabel.innerHTML = buttonText;

            const button = SvgUtils.createSVG("rect", {
                "class": "button-close",
                "width": buttonWidth,
                "height": buttonHight,
                "id": "close",
                "rx": "10",
                "ry": "10",
                "x": 300,
                "y": 520,
            });

            let contents = [];

            button.addEventListener("click", function() {
                const label = document.getElementById("button-label");
                const button = document.getElementById("close");
                const infoPanel = document.getElementById("info");
                label.remove();
                button.remove();
                infoPanel.remove();
                let nicknameInput = document.getElementById("nickname-input");
                contents.forEach(e => e.remove());
                this.removeEventListener("click", function() {});

                if ((nicknameInput !== null) && (nicknameInput.value !== mainMenu.playerName)) {
                    mainMenu.playerName = nicknameInput.value;
                }
            });

            svg.appendChild(infoPanel);
            svg.appendChild(closeButtonLabel);
            svg.appendChild(button);

            if (targetId === "controls") {
                const title = SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": 240,
                    "y": 160,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "textLength": (2 * buttonWidth - ((buttonWidth / buttonText.length) | 0)),
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "40pt"
                });
                title.innerHTML = "Controls";
                contents.push(title);

                const nicknameInput = SvgUtils.createSVG("foreignObject", {
                    "class": "title-text",
                    "x": 400,
                    "y": 220,
                    "width": 280,
                    "height": 50
                });

                const xmlnsDiv = document.createElement("div");
                xmlnsDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

                const input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("id", "nickname-input");
                input.setAttribute("value", mainMenu.playerName);
                xmlnsDiv.appendChild(input);
                nicknameInput.appendChild(xmlnsDiv);
                contents.push(nicknameInput);

                const inputLabel = SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": 240,
                    "y": 260,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "textLength": (buttonWidth - ((buttonWidth / buttonText.length) | 0)),
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "24pt"
                });
                inputLabel.innerHTML = "Nickname:";
                contents.push(inputLabel);

                const leftArrow = SvgUtils.createSVG("image", {
                    "class": "control-image",
                    "x": 210,
                    "y": 320,
                    "style": "pointer-events: none;"
                });
                leftArrow.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/leftArrow.png");
                const leftArrowAnimate = SvgUtils.createSVG("animate", {
                    "attributeName": "opacity",
                    "values": "1;0;1",
                    "dur": "2s",
                    "repeatCount": "indefinite"
                });
                leftArrow.appendChild(leftArrowAnimate);
                contents.push(leftArrow);

                const rightArrow = SvgUtils.createSVG("image", {
                    "class": "control-image",
                    "x": 370,
                    "y": 320,
                    "style": "pointer-events: none;"
                });
                rightArrow.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/rightArrow.png");
                const rightArrowAnimate = SvgUtils.createSVG("animate", {
                    "attributeName": "opacity",
                    "values": "0;1;0",
                    "dur": "2s",
                    "repeatCount": "indefinite"
                });
                rightArrow.appendChild(rightArrowAnimate);
                contents.push(rightArrow);

                const movementLabel = SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": 480,
                    "y": 350,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "24pt"
                });
                movementLabel.innerHTML = "Movement";
                contents.push(movementLabel);

                const space = SvgUtils.createSVG("image", {
                    "class": "control-image",
                    "x": 140,
                    "y": 380,
                    "style": "pointer-events: none;"
                });
                space.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/space.png");
                const spaceAnimate = SvgUtils.createSVG("animate", {
                    "attributeName": "opacity",
                    "values": "0;1;0",
                    "dur": "1s",
                    "repeatCount": "indefinite"
                });
                space.appendChild(spaceAnimate);
                contents.push(space);

                const attackLabel = SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": 500,
                    "y": 410,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "24pt"
                });
                attackLabel.innerHTML = "Attack";
                contents.push(attackLabel);

                const escImg = SvgUtils.createSVG("image", {
                    "class": "control-image",
                    "x": 290,
                    "y": 440,
                    "style": "pointer-events: none;"
                });
                escImg.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/esc.png");
                const escAnimate = SvgUtils.createSVG("animate", {
                    "attributeName": "opacity",
                    "values": "0;1;0",
                    "dur": "3s",
                    "repeatCount": "indefinite"
                });
                escImg.appendChild(escAnimate);
                contents.push(escImg);

                const pauseLabel = SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": 440,
                    "y": 470,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "24pt"
                });
                pauseLabel.innerHTML = "Pause / Menu";
                contents.push(pauseLabel);

                contents.forEach(e => svg.appendChild(e));
            }

            if (targetId === "highscores") {
                const title = SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": 240,
                    "y": 160,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "textLength": (2 * buttonWidth - ((buttonWidth / buttonText.length) | 0)),
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "40pt"
                });
                title.innerHTML = "Highscores";
                contents.push(title);

                const symbol = SvgUtils.createSVG("symbol", { "id": "text-symbol" });

                for (let i = 0; i < mainMenu._highscores.length; i += 1) {
                    const userText = SvgUtils.createSVG("text", {
                        "class": "highscore-text-username",
                        "x": 140,
                        "y": 250 + (i * 50)
                    });
                    userText.innerHTML = "" + (i + 1) + ". " + mainMenu._highscores[i][0];
                    symbol.appendChild(userText);

                    let scoresText = "" + mainMenu._highscores[i][1];
                    const userScore = SvgUtils.createSVG("text", {
                        "class": "highscore-text-username",
                        "x": 660 - (scoresText.length * 30),
                        "y": 250 + (i * 50)
                    });
                    userScore.innerHTML = scoresText;
                    symbol.appendChild(userScore);
                }
                contents.push(symbol);

                for (let i = 0; i < 5; i += 1) {
                    const use = SvgUtils.createSVG("use", { "class": "text-username-use" });
                    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#text-symbol");
                    contents.push(use);
                }
            }

            if (targetId === "credits") {
                let paths = ["Arnaudov_St", "bobi_dobroto", "dreadlocker", "gchankov", "ludzhev", "martinboykov", "rosen.urkov"];

                const title = SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": 240,
                    "y": 160,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "textLength": (2 * buttonWidth - ((buttonWidth / buttonText.length) | 0)),
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "40pt"
                });
                title.innerHTML = "Credits";
                contents.push(title);

                for (let i = 0; i < paths.length; i += 1) {
                    const path = SvgUtils.createSVG("path", { "id": "path" + i });
                    const pathAnimate = SvgUtils.createSVG("animate", {
                        "attributeName": "d",
                        "from": "m280,200 h0",
                        "to": "m280,500 h400",
                        "dur": "24s",
                        "begin": (i * 3) + "s",
                        "repeatCount": "indefinite"
                    });
                    path.appendChild(pathAnimate);
                    contents.push(path);


                    const creditsLine = SvgUtils.createSVG("text", {
                        "fill": "#7FFF00",
                        "font-family": "Copperplate Gothic Light",
                        "font-size": "24pt"
                    });
                    const textPath = SvgUtils.createSVG("textPath");
                    textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#path" + i);
                    textPath.innerHTML = paths[i];
                    creditsLine.appendChild(textPath);
                    contents.push(creditsLine);
                }
            }

            contents.forEach(e => svg.appendChild(e));
        } else if (targetId === "quit") {
            window.removeEventListener("load", function() {});
            window.removeEventListener("resize", mainMenu.onBodyResize);
            window.location.href = GAME_VARIABLES.repositoryHref;
        }
    }
}


const mainMenu = new MainMenu();
window.onload = function() {
    mainMenu.load();
    mainMenu.onBodyResize.call(this);
    this.addEventListener("resize", mainMenu.onBodyResize, false);
}