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
    constructor(playerName, highscores) {
        this._playerName = playerName;
        this._highscores = highscores;
    }

    launch() {
        window.addEventListener("load", this.onBodyResize, false);
        window.addEventListener("resize", this.onBodyResize, false);

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

        //////////
        const logo = SvgUtils.createSVG("image", { "id": "logo",
				"width": 756,
				"height": 152,
                "x": "22",
                "y": "50"
        });
        logo.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/logo.png");
        svg.appendChild(logo);

        for (let i = 1; i <= 10; i += 1) {
            const backgroundGlass = SvgUtils.createSVG("image", { "class": "background-glass", "y": -200,
					"style": "pointer-events: none;",
					"width": "80",
					"height": "115"
			});
            
            if ((i % 3) === 0) {
                backgroundGlass.setAttribute("transform", "rotate(45)");
            }
            
            if ((i % 2) === 0) {
                backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/glass_80_115.png");
                backgroundGlass.setAttribute("x", "-200");
                const animateX = SvgUtils.createSVG("animate", { "attributeName": "x",
                        "from": -40 * i,
                        "to": 800 + (40 * i),
                        "dur": (i % 5) + i + 5 + "s",
                        "attributeType": "CSS",
                        "repeatCount": "indefinite",
                        "begin": (i % 3) + i + "s"
                });
                backgroundGlass.appendChild(animateX);
            }
            else {
                backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/glass_80_115_rotated.png");
                backgroundGlass.setAttribute("x", "1000");
                const animateX = SvgUtils.createSVG("animate", { "attributeName": "x",
                        "from": 800 + (40 * i),
                        "to": -40 * i,
                        "dur": (i % 6) + i + "s",
                        "attributeType": "CSS",
                        "repeatCount": "indefinite",
                        "begin": (i % 3) + i + "s"
                });
                backgroundGlass.appendChild(animateX);
            }

            const animateY = SvgUtils.createSVG("animate", { "attributeName": "y",
                    "from": -200,
                    "to": 900,
                    "dur": (i % 5) + i + 5 + "s",
                    "attributeType": "CSS",
                    "repeatCount": "indefinite",
                    "begin": (i % 3) + i + "s"
            });
            backgroundGlass.appendChild(animateY);

            svg.appendChild(backgroundGlass);
        }
        //////////////
        for (let i in buttonLabels) {
            const button = SvgUtils.createSVG("rect", { "class": "button-menu",
                    "width": buttonWidth,
                    "height": buttonHight,
                    "id": buttonIds[i],
                    "rx": "10",
                    "ry": "10",
                    "x": buttonsStartX,
                    "y": i * step + buttonsStartY
            });
            
            button.addEventListener("click", this.onClick, false);

            const buttonLabel = SvgUtils.createSVG("text", { "class": "button-text",
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

<<<<<<< HEAD
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

    onClick(e) {
        const targetId = e.target.id;
        if (targetId === "start" || targetId == "quit") {

            Array.from(document.getElementsByClassName("button-menu"))
                    .forEach(ele =>
                    ele.removeEventListener('click', this.onClick, false));
            document.getElementById("top").innerHTML = "";
            window.onload = null;
            window.onresize = null;
            setTimeout(this.removeWindowListners, 1000);

            if (targetId === "start") {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "./scripts/game.js";
                script.id = "game";
                document.head.appendChild(script);
            }
            else {
                document.getElementById("top").outerHTML = "";
                document.head.innerHTML = "";
            }
=======
    onClick() {
        const targetId = this.id;
        if (targetId === "start") {
            document.getElementById('svgCon').style.display = 'none';
            startGame();
>>>>>>> origin/master
        }
        else if (targetId === "controls" || targetId === "highscores" || targetId === "credits") {
            const svg = document.getElementById("svgCon");
            let infoPanel = SvgUtils.createSVG("rect", {"class": "info-panel",
                    "width": 600,
                    "height": 480,
                    "id": "info",
                    "rx": "20",
                    "ry": "20",
                    "x": 100,
                    "y": 100,
                    "z-index": 1
            });

            const buttonHight = 40,
                    buttonWidth = 180,
                    svgWidth = 800,
                    svgHight = 600,
                    buttonText = "Close";

            const closeButtonLabel = SvgUtils.createSVG("text", { "class": "button-text",
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

            const button = SvgUtils.createSVG("rect", {"class": "button-close",
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
                let nickname = document.getElementById("nickname-input").value;
                contents.forEach(e => e.remove());
                this.removeEventListener("click", function(){});

                if (nickname !== gameManager._playerName) {
                    gameManager._playerName = nickname;
                    gameManager._menu._playerName = nickname;
                }
            });

            svg.appendChild(infoPanel);
            svg.appendChild(closeButtonLabel);
            svg.appendChild(button);

           if (targetId === "controls") {
                const title = SvgUtils.createSVG("text", { "class": "title-text",
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

                const nicknameInput = SvgUtils.createSVG("foreignObject", { "class": "title-text",
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
                input.setAttribute("value", gameManager._menu._playerName);
                xmlnsDiv.appendChild(input);
                nicknameInput.appendChild(xmlnsDiv);
                contents.push(nicknameInput);

                const inputLabel = SvgUtils.createSVG("text", { "class": "title-text",
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

                contents.forEach(e => svg.appendChild(e));
           }
        }
    }

    loadContolsContent() {
        const svg = document.getElementById("svgCon");
        const title = SvgUtils.createSVG("text", { "class": "title-text",
                "x": 320,
                "y": 555,
                "id": "button-label",
                "lengthAdjust": "spacingAndGlyphs",
                "fill": "#fff",
                "stroke": "#ff0000",
                "font-family": "Copperplate Gothic Light",
                "font-size": "36px"
        });
    }

    removeWindowListners() {
        window.removeEventListener('load', this.onBodyResize, false);
        window.removeEventListener('resize', this.onBodyResize, false);
    }
}

<<<<<<< HEAD
gameManager.launchMenu();
=======
window.onload = function(){
let mainMenu = new MainMenu();
mainMenu.load();
}
>>>>>>> origin/master
