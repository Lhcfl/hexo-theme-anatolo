function darkLightToggle() {
    if (document.getElementById("theme-light-mode") != null) {
        document.getElementById("theme-light-mode").id="theme-dark-mode";
        return;
    }
    if (document.getElementById("theme-dark-mode") != null) {
        document.getElementById("theme-dark-mode").id="theme-light-mode";
        return;
    }
}
