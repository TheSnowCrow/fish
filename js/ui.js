// UI system for menus and screens

class UIManager {
    constructor(renderer, input) {
        this.renderer = renderer;
        this.input = input;
        this.currentScreen = 'menu';
        this.selectedOption = 0;
        this.menuOptions = [];
        this.callbacks = {};
    }

    showMainMenu() {
        this.currentScreen = 'menu';
        this.menuOptions = [
            { text: 'PLAY', action: 'startGame' },
            { text: 'LEVEL SELECT', action: 'levelSelect' },
            { text: 'CUSTOMIZE', action: 'customize' }
        ];
        this.selectedOption = 0;

        this.input.on('onClick', (pos) => {
            this.handleMenuClick(pos);
        });
    }

    showLevelSelect(currentLevel = 0) {
        this.currentScreen = 'levelSelect';
        this.currentLevel = currentLevel;

        this.input.on('onClick', (pos) => {
            this.handleLevelSelectClick(pos);
        });
    }

    handleMenuClick(pos) {
        const startY = 280;
        const buttonHeight = 60;

        this.menuOptions.forEach((option, i) => {
            const y = startY + i * buttonHeight;
            const buttonRect = {
                x: this.renderer.width / 2 - 100,
                y: y - 25,
                width: 200,
                height: 40
            };

            if (Utils.pointInRect(pos, buttonRect)) {
                Audio.playClick();
                this.selectedOption = i;

                if (this.callbacks[option.action]) {
                    setTimeout(() => {
                        this.callbacks[option.action]();
                    }, 100);
                }
            }
        });
    }

    handleLevelSelectClick(pos) {
        const totalLevels = getTotalLevels();
        const cols = 5;
        const rows = Math.ceil(totalLevels / cols);
        const buttonSize = 60;
        const spacing = 80;
        const startX = this.renderer.width / 2 - (cols * spacing) / 2;
        const startY = 200;

        for (let i = 0; i < totalLevels; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * spacing;
            const y = startY + row * spacing;

            const buttonRect = {
                x: x - buttonSize / 2,
                y: y - buttonSize / 2,
                width: buttonSize,
                height: buttonSize
            };

            if (Utils.pointInRect(pos, buttonRect)) {
                Audio.playClick();
                if (this.callbacks.selectLevel) {
                    this.callbacks.selectLevel(i);
                }
                break;
            }
        }

        // Back button
        const backButton = {
            x: 50,
            y: this.renderer.height - 80,
            width: 120,
            height: 40
        };

        if (Utils.pointInRect(pos, backButton)) {
            Audio.playClick();
            if (this.callbacks.back) {
                this.callbacks.back();
            }
        }
    }

    drawMainMenu() {
        this.renderer.drawMenu('FISH PUTT', this.menuOptions, this.selectedOption);
    }

    drawLevelSelect() {
        const ctx = this.renderer.ctx;
        this.renderer.clear(Utils.COLORS.DARK_BLUE);

        // Title
        ctx.fillStyle = Utils.COLORS.CYAN;
        ctx.font = 'bold 32px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('SELECT LEVEL', this.renderer.width / 2, 80);

        // Level grid
        const totalLevels = getTotalLevels();
        const cols = 5;
        const rows = Math.ceil(totalLevels / cols);
        const buttonSize = 60;
        const spacing = 80;
        const startX = this.renderer.width / 2 - (cols * spacing) / 2;
        const startY = 200;

        for (let i = 0; i < totalLevels; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * spacing;
            const y = startY + row * spacing;

            // Level button
            const isSelected = i === this.currentLevel;
            const color = isSelected ? Utils.COLORS.YELLOW : Utils.COLORS.BLUE;

            // Shadow
            ctx.fillStyle = Utils.COLORS.BLACK;
            ctx.fillRect(x - buttonSize / 2 + 4, y - buttonSize / 2 + 4, buttonSize, buttonSize);

            // Button
            ctx.fillStyle = color;
            ctx.fillRect(x - buttonSize / 2, y - buttonSize / 2, buttonSize, buttonSize);

            // Border
            ctx.strokeStyle = Utils.COLORS.WHITE;
            ctx.lineWidth = 2;
            ctx.strokeRect(x - buttonSize / 2, y - buttonSize / 2, buttonSize, buttonSize);

            // Level number
            ctx.fillStyle = Utils.COLORS.WHITE;
            ctx.font = 'bold 20px "Courier New"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((i + 1).toString(), x, y);

            // World indicator
            const level = getLevelByIndex(i);
            if (level) {
                ctx.font = '10px "Courier New"';
                ctx.fillText(`W${level.world}`, x, y + 20);
            }
        }

        // Back button
        this.renderer.drawButton(50, this.renderer.height - 80, 120, 40, 'BACK', Utils.COLORS.RED);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }

    drawCustomize() {
        const ctx = this.renderer.ctx;
        this.renderer.clear(Utils.COLORS.DARK_BLUE);

        ctx.fillStyle = Utils.COLORS.CYAN;
        ctx.font = 'bold 32px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('CUSTOMIZE FISH', this.renderer.width / 2, 100);

        ctx.font = '16px "Courier New"';
        ctx.fillText('(Feature coming soon!)', this.renderer.width / 2, 300);

        this.renderer.drawButton(
            this.renderer.width / 2 - 80,
            400,
            160,
            40,
            'BACK',
            Utils.COLORS.RED
        );

        ctx.textAlign = 'left';
    }

    draw() {
        switch (this.currentScreen) {
            case 'menu':
                this.drawMainMenu();
                break;
            case 'levelSelect':
                this.drawLevelSelect();
                break;
            case 'customize':
                this.drawCustomize();
                break;
        }
    }

    on(event, callback) {
        this.callbacks[event] = callback;
    }
}
