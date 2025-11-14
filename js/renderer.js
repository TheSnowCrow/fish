// Retro pixel renderer

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Disable anti-aliasing for crisp pixels
        this.ctx.imageSmoothingEnabled = false;
    }

    clear(color = Utils.COLORS.BLACK) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawBackground(level) {
        // Clear with level background
        this.clear(level.background);

        // Add retro scanlines
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let y = 0; y < this.height; y += 4) {
            this.ctx.fillRect(0, y, this.width, 2);
        }

        // World-specific background details
        this.drawWorldBackground(level.world);
    }

    drawWorldBackground(world) {
        switch (world) {
            case 1: // Fish Tank
                // Bubbles
                for (let i = 0; i < 10; i++) {
                    const x = (i * 80 + Date.now() * 0.02) % this.width;
                    const y = (i * 60) % this.height;
                    this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
                break;

            case 2: // Bathroom
                // Tiles
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                for (let x = 0; x < this.width; x += 40) {
                    for (let y = 0; y < this.height; y += 40) {
                        this.ctx.strokeRect(x, y, 40, 40);
                    }
                }
                break;

            case 3: // Bathtub
                // Water ripples
                this.ctx.strokeStyle = 'rgba(0, 150, 255, 0.2)';
                for (let i = 0; i < 5; i++) {
                    const y = this.height - 100 + i * 20;
                    this.ctx.beginPath();
                    for (let x = 0; x < this.width; x += 10) {
                        const wave = Math.sin(x * 0.1 + Date.now() * 0.002 + i) * 5;
                        this.ctx.lineTo(x, y + wave);
                    }
                    this.ctx.stroke();
                }
                break;

            case 4: // Sewer
                // Drips
                const time = Date.now() * 0.001;
                for (let i = 0; i < 8; i++) {
                    const x = i * 100 + 50;
                    const y = (time * 50 + i * 30) % this.height;
                    this.ctx.fillStyle = 'rgba(100, 255, 150, 0.3)';
                    this.ctx.fillRect(x, y, 2, 10);
                }
                break;

            case 5: // Beach/Ocean
                // Shells and sand
                this.ctx.fillStyle = 'rgba(255, 255, 200, 0.2)';
                for (let i = 0; i < 15; i++) {
                    const x = (i * 53 + 20) % this.width;
                    const y = this.height - 100 + (i * 37) % 50;
                    this.ctx.fillRect(x, y, 3, 3);
                }
                break;
        }
    }

    drawSlingshotAim(fish, input) {
        if (!input.isDragging) return;

        const dragVec = input.getDragVector();
        const distance = input.getDragDistance();

        if (distance < 5) return;

        const maxPower = 20;
        const power = Math.min(distance / 10, maxPower);
        const angle = Math.atan2(dragVec.y, dragVec.x);

        // Draw aim line
        this.ctx.strokeStyle = Utils.COLORS.YELLOW;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(fish.body.pos.x, fish.body.pos.y);
        const endX = fish.body.pos.x + Math.cos(angle) * power * 10;
        const endY = fish.body.pos.y + Math.sin(angle) * power * 10;
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw power indicator
        const segments = Math.floor(power / 2);
        for (let i = 0; i < segments; i++) {
            const segmentX = fish.body.pos.x + Math.cos(angle) * (i * 20 + 20);
            const segmentY = fish.body.pos.y + Math.sin(angle) * (i * 20 + 20);

            const color = i < 5 ? Utils.COLORS.GREEN :
                         i < 8 ? Utils.COLORS.YELLOW : Utils.COLORS.RED;
            this.ctx.fillStyle = color;
            this.ctx.fillRect(segmentX - 3, segmentY - 3, 6, 6);
        }

        // Draw pull-back line
        this.ctx.strokeStyle = Utils.COLORS.CYAN;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(fish.body.pos.x, fish.body.pos.y);
        this.ctx.lineTo(input.dragCurrent.x, input.dragCurrent.y);
        this.ctx.stroke();
    }

    drawHUD(strokes, strokeLimit, stars, collectibles) {
        const padding = 10;

        // Strokes counter
        this.ctx.fillStyle = Utils.COLORS.WHITE;
        this.ctx.font = '16px "Courier New"';
        this.ctx.fillText(`STROKES: ${strokes}/${strokeLimit}`, padding, 30);

        // Stars
        for (let i = 0; i < 3; i++) {
            const x = padding + i * 25;
            const y = 50;
            this.ctx.fillStyle = i < stars ? Utils.COLORS.YELLOW : Utils.COLORS.DARK_GRAY;
            this.drawStar(x, y, 8);
        }

        // Collectibles
        const collected = collectibles.filter(c => c.collected).length;
        const total = collectibles.length;
        if (total > 0) {
            this.ctx.fillText(`SHELLS: ${collected}/${total}`, padding, 100);
        }

        // Boost indicator
        this.ctx.fillText('TAP: BOOST', this.width - 150, 30);
    }

    drawStar(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawMenuFish(x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Scale up for menu
        const scale = 3;
        this.ctx.scale(scale, scale);

        // Draw a simple pixel art fish
        this.ctx.fillStyle = Utils.COLORS.ORANGE;

        // Body
        this.ctx.fillRect(-8, -8, 16, 16);

        // Tail
        this.ctx.fillRect(-12, -4, 4, 8);

        // Fins
        this.ctx.fillRect(4, -10, 4, 4);
        this.ctx.fillRect(4, 6, 4, 4);

        // Eye white
        this.ctx.fillStyle = Utils.COLORS.WHITE;
        this.ctx.fillRect(2, -3, 4, 4);

        // Pupil
        this.ctx.fillStyle = Utils.COLORS.BLACK;
        this.ctx.fillRect(4, -1, 2, 2);

        this.ctx.restore();
    }

    drawLevelComplete(stars, collected, total) {
        // Overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.fillStyle = Utils.COLORS.YELLOW;
        this.ctx.font = 'bold 32px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL COMPLETE!', this.width / 2, this.height / 2 - 80);

        // Stars
        for (let i = 0; i < 3; i++) {
            const x = this.width / 2 - 50 + i * 50;
            const y = this.height / 2 - 20;
            this.ctx.fillStyle = i < stars ? Utils.COLORS.YELLOW : Utils.COLORS.DARK_GRAY;
            this.drawStar(x, y, 15);
        }

        // Stats
        this.ctx.font = '16px "Courier New"';
        this.ctx.fillStyle = Utils.COLORS.WHITE;
        this.ctx.fillText(`Shells: ${collected}/${total}`, this.width / 2, this.height / 2 + 40);

        // Continue button
        this.drawButton(this.width / 2 - 80, this.height / 2 + 70, 160, 40, 'CONTINUE', Utils.COLORS.GREEN);

        this.ctx.textAlign = 'left';
    }

    drawLevelFailed() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.fillStyle = Utils.COLORS.RED;
        this.ctx.font = 'bold 32px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('OUT OF STROKES!', this.width / 2, this.height / 2 - 40);

        // Retry button
        this.drawButton(this.width / 2 - 80, this.height / 2 + 20, 160, 40, 'RETRY', Utils.COLORS.BLUE);

        this.ctx.textAlign = 'left';
    }

    drawButton(x, y, width, height, text, color) {
        // Shadow
        this.ctx.fillStyle = Utils.COLORS.BLACK;
        this.ctx.fillRect(x + 4, y + 4, width, height);

        // Button
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = Utils.COLORS.WHITE;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Text
        this.ctx.fillStyle = Utils.COLORS.WHITE;
        this.ctx.font = 'bold 16px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + width / 2, y + height / 2);

        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'alphabetic';
    }

    drawMenu(title, options, selectedIndex) {
        this.clear(Utils.COLORS.DARK_BLUE);

        // Title
        this.ctx.fillStyle = Utils.COLORS.CYAN;
        this.ctx.font = 'bold 48px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.width / 2, 100);

        // Fish animation
        const fishX = this.width / 2 + Math.sin(Date.now() * 0.003) * 50;
        const fishY = 180;
        this.drawMenuFish(fishX, fishY);

        // Options
        this.ctx.font = '20px "Courier New"';
        options.forEach((option, i) => {
            const y = 280 + i * 60;
            const isSelected = i === selectedIndex;

            if (isSelected) {
                this.ctx.fillStyle = Utils.COLORS.YELLOW;
                this.ctx.fillText('>', this.width / 2 - 120, y);
            }

            this.drawButton(
                this.width / 2 - 100,
                y - 25,
                200,
                40,
                option.text,
                isSelected ? Utils.COLORS.YELLOW : Utils.COLORS.BLUE
            );
        });

        this.ctx.textAlign = 'left';
    }
}
