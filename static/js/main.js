function toggleDarkMode() {
    let theme = document.documentElement.getAttribute("data-theme");

    if(theme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem('darkMode', false);
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem('darkMode', true);
    }
}

window.onload = function() {
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));

    // Wenn der Benutzer eine Präferenz für den hellen Modus festgelegt hat, ändern Sie das Attribut
    if (isDarkMode === false) {
        document.documentElement.setAttribute("data-theme", "light");
    }
};
