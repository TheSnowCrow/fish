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

        // Test canvas rendering
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 100, 100);
        console.log('Test rectangle drawn');

        // Create game
        const game = new Game(canvas);
        console.log('Game created');

        // Hide loading screen
        setTimeout(() => {
            try {
                console.log('Hiding loading screen and starting game...');
                console.log('Loading screen classes before:', loadingScreen.className);
                loadingScreen.classList.add('hidden');
                console.log('Loading screen classes after:', loadingScreen.className);
                console.log('Loading screen display:', window.getComputedStyle(loadingScreen).display);

                game.showMenu();
                console.log('Menu shown, game state:', game.state);

                game.run();
                console.log('Game running');

                // Force a manual first render
                setTimeout(() => {
                    console.log('Manual render check, state:', game.state);
                    game.draw();
                }, 100);
            } catch (error) {
                console.error('Error starting game:', error);
                console.error('Stack:', error.stack);
                loadingScreen.innerHTML = '<div style="color: red;">Error: ' + error.message + '<br><pre>' + error.stack + '</pre></div>';
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
