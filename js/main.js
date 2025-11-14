// Main entry point

window.addEventListener('load', () => {
    // Get canvas
    const canvas = document.getElementById('gameCanvas');
    const loadingScreen = document.getElementById('loadingScreen');

    // Initialize audio
    Audio.init();

    // Create game
    const game = new Game(canvas);

    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        game.showMenu();
        game.run();
    }, 500);

    // Handle window resize (optional)
    window.addEventListener('resize', () => {
        // Could add responsive canvas sizing here
    });

    // Debug mode (press D key)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            window.DEBUG = !window.DEBUG;
            console.log('Debug mode:', window.DEBUG);
        }
    });

    // Prevent context menu on canvas
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    console.log('%cFish Putt Adventure', 'font-size: 24px; color: #00ffff;');
    console.log('%cLoaded and ready!', 'color: #00ff00;');
    console.log('Press D to toggle debug mode');
});
