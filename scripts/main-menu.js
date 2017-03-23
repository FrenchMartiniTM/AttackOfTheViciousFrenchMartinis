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

        this._highscores = highscores;
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

        const top = document.createElement("div");
        top.setAttribute("id", "top");
        document.body.appendChild(top);

        const logo = SvgUtils.createSVG("image", { "id": "logo",
                "x": "22",
                "y": "50",
        });
        logo.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/logo.png");
        svg.appendChild(logo);
        
        for (let i in buttonLabels) {
            const buttonLabel = SvgUtils.createSVG("text", { "class": "button-text",
                    "x": labelsStartX + buttonWidth / (4 * buttonLabels[i].length),
                    "y": i * step + labelsStartY,
                    "textLength": (buttonWidth - (buttonWidth / (2 * buttonLabels[i].length) | 0)),
                    "lengthAdjust": "spacingAndGlyphs",
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Verdana",
                    "font-size": "36px"
            });
            
            buttonLabel.innerHTML = buttonLabels[i];
            svg.appendChild(buttonLabel);

            const button = SvgUtils.createSVG("rect", {"class": "button",
                    "width": buttonWidth,
                    "height": buttonHight,
                    "id": buttonIds[i],
                    "rx": "10",
                    "ry": "10",
                    "x": buttonsStartX,
                    "y": i * step + buttonsStartY,
            });
            
            button.addEventListener("click", this.onClick);
            svg.appendChild(button);
        }

        for (let i = 0; i <= 9; i += 1) {
            const backgroundGlass = SvgUtils.createSVG("image", { "y": -200 });
            
            if ((i % 3) === 0) {
                backgroundGlass.setAttribute("transform", "rotate(45)");
            }
            
            if ((i % 2) === 0) {
                backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/glass_80_115.png");
                backgroundGlass.setAttribute("x", "-200");
                const animateX = SvgUtils.createSVG("animate", { "attributeName": "x",
                        "from": -200,
                        "to": 1000,
                        "dur": (i % 5) + 5 + "s",
                        "attributeType": "CSS",
                        "repeatCount": "indefinite",
                        "begin": (i % 3) + "s"
                });
                backgroundGlass.appendChild(animateX);
            }
            else {
                backgroundGlass.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/images/glass_80_115_rotated.png");
                backgroundGlass.setAttribute("x", "1000");
                const animateX = SvgUtils.createSVG("animate", { "attributeName": "x",
                        "from": 1000,
                        "to": -200,
                        "dur": (i % 6) + "s",
                        "attributeType": "CSS",
                        "repeatCount": "indefinite",
                        "begin": (i % 3) + "s"
                });
                backgroundGlass.appendChild(animateX);
            }

            const animateY = SvgUtils.createSVG("animate", { "attributeName": "y",
                    "from": -200,
                    "to": 900,
                    "dur": (i % 5) + 5 + "s",
                    "attributeType": "CSS",
                    "repeatCount": "indefinite",
                    "begin": (i % 3) + "s"
            });
            backgroundGlass.appendChild(animateY);

            svg.appendChild(backgroundGlass);
        }

        top.appendChild(svg);
    }

    onClick() {
        const targetId = this.id;
        if (targetId === "start") {

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

            const animation = SvgUtils.createSVG("animate", { "attributeName": "opacity",
                    "from": "1",
                    "to": "0",
                    "dur": "2s",
                    "attributeType": "CSS",
                    "repeatCount": "1",
                    "begin": "0s"
            });

            infoPanel.appendChild(animation);

            const buttonHight = 40,
                    buttonWidth = 200,
                    svgWidth = 800,
                    svgHight = 600,
                    buttonText = "Close";

            const closeButtonLabel = SvgUtils.createSVG("text", { "class": "button-text",
                    "x": 320,
                    "y": 555,
                    "id": "button-label",
                    "textLength": (buttonWidth - ((buttonWidth / buttonText.length) | 0)),
                    "lengthAdjust": "spacingAndGlyphs",
                    "fill": "#fff",
                    "stroke": "#ff0000",
                    "font-family": "Verdana",
                    "font-size": "36px"
            });
            
            closeButtonLabel.innerHTML = buttonText;

            const button = SvgUtils.createSVG("rect", {"class": "button",
                    "width": buttonWidth,
                    "height": buttonHight,
                    "id": "close",
                    "rx": "10",
                    "ry": "10",
                    "x": 300,
                    "y": 520,
            });
            
            button.addEventListener("click", function() {
                const label = document.getElementById("button-label");
                const button = document.getElementById("close");
                const infoPanel = document.getElementById("info");
                label.remove();
                button.remove();
                infoPanel.remove();
            });

            svg.appendChild(infoPanel);
            svg.appendChild(closeButtonLabel);
            svg.appendChild(button);
        }
        else if (targetId == "quit") {

        }
    }

    startGame() {
        console.log("ok");
    }

    quitGame() {
        console.log("ok");
    }

}

let mainMenu = new MainMenu();
mainMenu.load();