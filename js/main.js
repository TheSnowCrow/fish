// Main entry point

window.addEventListener('load', () => {
    // Get canvas and loading screen
    const canvas = document.getElementById('gameCanvas');
    const loadingScreen = document.getElementById('loadingScreen');

    try {
        console.log('Canvas:', canvas);
        console.log('Loading screen:', loadingScreen);

        // Prevent context menu on canvas
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Initialize audio
        Audio.init();
        console.log('Audio initialized');

        // Create game
        const game = new Game(canvas);
        console.log('Game created');

        // Hide loading screen
        setTimeout(() => {
            try {
                console.log('Hiding loading screen and starting game...');
                loadingScreen.classList.add('hidden');
                game.showMenu();
                console.log('Menu shown');
                game.run();
                console.log('Game running');
            } catch (error) {
                console.error('Error starting game:', error);
                loadingScreen.innerHTML = '<div style="color: red;">Error: ' + error.message + '</div>';
            }
        }, 500);
    } catch (error) {
        console.error('Error initializing game:', error);
        if (loadingScreen) {
            loadingScreen.innerHTML = '<div style="color: red;">Error: ' + error.message + '</div>';
        }
    }

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

    console.log('%cFish Putt Adventure', 'font-size: 24px; color: #00ffff;');
    console.log('%cLoaded and ready!', 'color: #00ff00;');
    console.log('Press D to toggle debug mode');
});
