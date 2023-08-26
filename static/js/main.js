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


function toggleFullScreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

document.querySelector('a[href="/vvs/changelog/"]').addEventListener('click', function(event) {
  // Only call toggleFullScreen. Don't prevent the default behavior.
  toggleFullScreen();
});

