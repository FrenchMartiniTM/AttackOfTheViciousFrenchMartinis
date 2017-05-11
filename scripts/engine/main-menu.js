class SvgUtils {
    static createSVG(tag, attrs) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (let attr in attrs) {
            el.setAttribute(attr, attrs[attr]);
        }

        return el;
    }
}

class MainMenu {
    constructor() {
        this.playerName = "Bartender";
        this.highscores = [
            ["Bartender", 10000],
            ["Bartender", 1000],
            ["Bartender", 100],
            ["Bartender", 10],
            ["Bartender", 0]
        ];
    }

    updateHighscores(score) {
        this.highscores.push([this.playerName, score]);
        this.highscores.sort(function (a, b) {
            return b[1] - a[1];
        });

        this.highscores.pop();
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

        let top = document.getElementById("top");
        if (top === null) {
            top = document.createElement("div");
            top.setAttribute("id", "top");
            document.body.appendChild(top);
        }
        top.appendChild(svg);

        (function createRandomMartiniBackground() {
            for (let i = 1; i <= 20; i += 1) {
                const backgroundGlass = SvgUtils.createSVG("image", {
                    "class": "background-glass",
                    "y": -200,
                    "style": "pointer-events: none;",
                    "width": 80,
                    "height": 115
                });

                function createAnimation(options) {
                    const { attributeName, from, to, animationCounter } = options;

                    const animation = {
                        attributeName,
                        from,
                        to,
                        dur: ((animationCounter % 5) + animationCounter) + 's',
                        attributeType: 'XML',
                        repeatCount: 'indefinite',
                        begin: ((animationCounter % 3) + animationCounter) + 's'
                    }

                    return animation;
                }

                let animateX,
                    animateY;

                if ((i % 3) === 0) {
                    backgroundGlass.setAttribute("transform", "rotate(45)");
                }

                if ((i % 2) === 0) {
                    backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/glass_80_115.png");
                    backgroundGlass.setAttribute("x", "-200");

                    animateX = SvgUtils.createSVG("animate", createAnimation({
                        attributeName: 'x',
                        from: (-40 * i) - 100,
                        to: 900 + (40 * i),
                        animationCounter: i
                    }));
                } else {
                    backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/redmartini.png");
                    backgroundGlass.setAttribute("x", "1000");

                    animateX = SvgUtils.createSVG("animate", createAnimation({
                        attributeName: 'x',
                        from: 900 + (40 * i),
                        to: (-40 * i) - 100,
                        animationCounter: i
                    }));
                }

                animateY = SvgUtils.createSVG("animate", createAnimation({
                    attributeName: 'y',
                    from: -300,
                    to: 1000,
                    animationCounter: i
                }));

                backgroundGlass.appendChild(animateX);
                backgroundGlass.appendChild(animateY);

                svg.appendChild(backgroundGlass);
            }
        }());

        (function createMenuButtons() {
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

                button.addEventListener("click", this.onClick);

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

                buttonLabel.textContent = buttonLabels[i];
                svg.appendChild(buttonLabel);
                svg.appendChild(button);
            }
        }.bind(this)());
    }

    onBodyResize() {
        const resizedWidth = this.innerWidth;
        const resizedHeight = this.innerHeight;
        const resizedX = (((resizedWidth - 800) / 2) | 0) < 0 ? 0 : (((resizedWidth - 800) / 2) | 0);
        const resizedY = (((resizedHeight - 600) / 2) | 0) < 0 ? 0 : (((resizedHeight - 600) / 2) | 0);
        const topCon = this.document.getElementById("top");

        if (topCon) {
            topCon.setAttribute("style", "margin-left: " + resizedX + "px; margin-top: " + resizedY + "px;");
        }
    }

    onClick() {
        const targetId = this.id;

        if (targetId === "start") {
            document.getElementById('svgCon').style.display = 'none';
            GameManager.startGame();
        } else if (targetId === "controls" || targetId === "highscores" || targetId === "credits") {
            const svg = document.getElementById("svgCon"),
                contents = [],
                buttonHight = 40,
                buttonWidth = 180,
                buttonText = "Close";

            (function createMenuPanels() {
                const infoPanel = SvgUtils.createSVG("rect", {
                    "class": "info-panel",
                    "width": 600,
                    "height": 480,
                    "id": "info",
                    "rx": "20",
                    "ry": "20",
                    "x": 100,
                    "y": 100
                });

                const svgWidth = 800,
                    svgHight = 600;

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

                closeButtonLabel.textContent = buttonText;

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

                button.addEventListener("click", function () {
                    document.getElementById("button-label").remove();
                    document.getElementById("close").remove();
                    document.getElementById("info").remove();

                    const nicknameInput = document.getElementById("nickname-input");
                    contents.forEach(x => x.remove());

                    if ((nicknameInput !== null) && (nicknameInput.value !== mainMenu.playerName)) {
                        mainMenu.playerName = nicknameInput.value;
                    }
                });

                svg.appendChild(infoPanel);
                svg.appendChild(closeButtonLabel);
                svg.appendChild(button);
            }());

            function createTitle(x, y, length, fontSize) {
                return SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": x || 240,
                    "y": y || 160,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "textLength": length || (2 * buttonWidth - ((buttonWidth / buttonText.length) | 0)),
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": fontSize || "40pt"
                });
            }

            function createLabel(x, y) {
                return SvgUtils.createSVG("text", {
                    "class": "title-text",
                    "x": x,
                    "y": y,
                    "id": "controls-title",
                    "lengthAdjust": "spacingAndGlyphs",
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Copperplate Gothic Light",
                    "font-size": "24pt"
                });
            }

            function createImg(x, y, w, h) {
                return SvgUtils.createSVG("image", {
                    "class": "control-image",
                    "x": x,
                    "y": y,
                    "width": w || 48,
                    "height": h || 48,
                    "style": "pointer-events: none;"
                });
            }

            function createAnimation(values, dur) {
                return SvgUtils.createSVG("animate", {
                    "attributeName": "opacity",
                    "values": values,
                    "dur": dur,
                    "repeatCount": "indefinite"
                });
            }

            if (targetId === "controls") {
                const title = createTitle();
                title.textContent = "Controls";
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

                const inputLabel = createTitle(240, 260, (buttonWidth - ((buttonWidth / buttonText.length) | 0)), '24pt');
                inputLabel.textContent = "Nickname:";
                contents.push(inputLabel);

                const leftArrow = createImg(210, 320);
                leftArrow.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/leftArrow.png");
                const leftArrowAnimate = createAnimation("1;0;1", '2s');
                leftArrow.appendChild(leftArrowAnimate);
                contents.push(leftArrow);

                const rightArrow = createImg(370, 320);
                rightArrow.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/rightArrow.png");
                const rightArrowAnimate = createAnimation("0;1;0", '2s');
                rightArrow.appendChild(rightArrowAnimate);
                contents.push(rightArrow);

                const movementLabel = createLabel(480, 350);
                movementLabel.textContent = "Movement";
                contents.push(movementLabel);

                const space = createImg(140, 380, 331, 47);
                space.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/space.png");
                const spaceAnimate = createAnimation("0;1;0", '1s');
                space.appendChild(spaceAnimate);
                contents.push(space);

                const attackLabel = createLabel(500, 410);
                attackLabel.textContent = "Attack";
                contents.push(attackLabel);

                const escImg = createImg(290, 440);
                escImg.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/esc.png");
                const escAnimate = createAnimation("0;1;0", '3s');
                escImg.appendChild(escAnimate);
                contents.push(escImg);

                const pauseLabel = createLabel(440, 470);
                pauseLabel.textContent = "Pause / Menu";
                contents.push(pauseLabel);

                contents.forEach(x => svg.appendChild(x));
            }

            if (targetId === "highscores") {
                const title = createTitle();
                title.textContent = "Highscores";
                contents.push(title);

                const symbol = SvgUtils.createSVG("symbol", { "id": "text-symbol" });
                for (let i = 0; i < mainMenu.highscores.length; i += 1) {
                    const userText = SvgUtils.createSVG("text", {
                        "class": "highscore-text-username",
                        "x": 140,
                        "y": 250 + (i * 50)
                    });
                    userText.textContent = "" + (i + 1) + ". " + mainMenu.highscores[i][0];
                    symbol.appendChild(userText);

                    let scoresText = "" + mainMenu.highscores[i][1];
                    const userScore = SvgUtils.createSVG("text", {
                        "class": "highscore-text-username",
                        "x": 660 - (scoresText.length * 30),
                        "y": 250 + (i * 50)
                    });
                    userScore.textContent = scoresText;
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
                const title = createTitle();
                title.textContent = "Credits";
                contents.push(title);

                const names = ["Arnaudov_St", "gchankov", "ludzhev", "martinboykov", "rosen.urkov"];
                for (let i = 0; i < names.length; i += 1) {
                    const name = SvgUtils.createSVG("path", { "id": "path" + i }),
                        nameAnimate = SvgUtils.createSVG("animate", {
                            "attributeName": "d",
                            "from": "m280,500 h0",
                            "to": "m280,200 h300",
                            "dur": "24s",
                            "begin": (i * 3) + "s",
                            "repeatCount": "indefinite"
                        });
                    name.appendChild(nameAnimate);
                    contents.push(name);

                    const creditsLine = SvgUtils.createSVG("text", {
                        "fill": "#7FFF00",
                        "font-family": "Copperplate Gothic Light",
                        "font-size": "24pt"
                    });

                    const textPath = SvgUtils.createSVG("textPath");
                    textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#path" + i);
                    textPath.textContent = names[i];
                    creditsLine.appendChild(textPath);
                    contents.push(creditsLine);
                }
            }

            contents.forEach(x => svg.appendChild(x));
        } else if (targetId === "quit") {
            window.location.href = GAME_VARIABLES.repositoryHref;
        }
    }
}