const mainMenu = new MainMenu();
window.onload = function() {
    mainMenu.load();
    mainMenu.onBodyResize.call(this);
    this.addEventListener("resize", mainMenu.onBodyResize, false);
}