// Game entities - Fish and collectibles

class Fish {
    constructor(x, y) {
        this.startX = x;
        this.startY = y;
        this.body = new PhysicsBody(x, y, 8);
        this.state = 'idle'; // idle, aiming, flying, stopped
        this.angle = 0;
        this.squashStretch = { x: 1, y: 1 };
        this.color = Utils.COLORS.ORANGE;
        this.trailColor = Utils.COLORS.CYAN;
        this.eyeAngle = 0;
        this.blinkTimer = 0;
        this.isBlinking = false;

        // Customization
        this.skin = 'default';
        this.hat = null;
        this.trail = 'bubbles';

        // Abilities
        this.boosts = 1;
        this.hasBoost = true;
    }

    reset() {
        this.body.pos.x = this.startX;
        this.body.pos.y = this.startY;
        this.body.vel.x = 0;
        this.body.vel.y = 0;
        this.body.acc.x = 0;
        this.body.acc.y = 0;
        this.state = 'idle';
        this.hasBoost = true;
    }

    launch(power, angle) {
        const vx = Math.cos(angle) * power;
        const vy = Math.sin(angle) * power;
        this.body.vel.x = vx;
        this.body.vel.y = vy;
        this.state = 'flying';
        this.angle = angle;
        Audio.playLaunch();
    }

    boost() {
        if (this.hasBoost && this.state === 'flying') {
            const speed = Utils.length(this.body.vel);
            if (speed > 0) {
                const normalized = Utils.normalize(this.body.vel);
                this.body.vel.x += normalized.x * 5;
                this.body.vel.y += normalized.y * 5;
                this.hasBoost = false;
                Audio.playBubble();
                return true;
            }
        }
        return false;
    }

    update(dt, particles) {
        const wasMoving = this.body.getSpeed() > 0.5;
        this.body.update(dt);

        // Update angle based on velocity
        if (this.state === 'flying') {
            this.angle = Math.atan2(this.body.vel.y, this.body.vel.x);

            // Trail particles
            if (Math.random() < 0.3) {
                particles.trail(this.body.pos.x, this.body.pos.y, this.trailColor);
            }

            // Check if stopped
            if (this.body.isStopped()) {
                this.state = 'stopped';
            }
        }

        // Squash and stretch animation
        const speed = this.body.getSpeed();
        const targetSquashX = Utils.clamp(1 + speed * 0.02, 0.8, 1.3);
        const targetSquashY = Utils.clamp(1 - speed * 0.01, 0.7, 1.2);
        this.squashStretch.x = Utils.lerp(this.squashStretch.x, targetSquashX, 0.2);
        this.squashStretch.y = Utils.lerp(this.squashStretch.y, targetSquashY, 0.2);

        // Blink animation
        this.blinkTimer += dt;
        if (this.blinkTimer > 3 && !this.isBlinking) {
            this.isBlinking = true;
            setTimeout(() => {
                this.isBlinking = false;
                this.blinkTimer = 0;
            }, 200);
        }

        // Eye tracking
        if (this.state === 'idle' || this.state === 'stopped') {
            this.eyeAngle = Utils.lerp(this.eyeAngle, 0, 0.1);
        } else {
            this.eyeAngle = this.angle;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.body.pos.x, this.body.pos.y);
        ctx.rotate(this.angle);

        // Apply squash and stretch
        ctx.scale(this.squashStretch.x, this.squashStretch.y);

        // Draw fish body (retro pixel style)
        ctx.fillStyle = this.color;

        // Main body (rounded)
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-8, -4);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-8, 4);
        ctx.fill();

        // Fins
        ctx.fillStyle = this.color;
        ctx.fillRect(0, -8, 4, 3);
        ctx.fillRect(0, 5, 4, 3);

        // Stripe (for some skins)
        if (this.skin === 'clownfish') {
            ctx.fillStyle = Utils.COLORS.WHITE;
            ctx.fillRect(-2, -8, 4, 16);
        }

        // Eye white
        ctx.fillStyle = Utils.COLORS.WHITE;
        if (!this.isBlinking) {
            ctx.fillRect(2, -3, 4, 4);
        }

        // Pupil
        if (!this.isBlinking) {
            ctx.fillStyle = Utils.COLORS.BLACK;
            const pupilX = 3 + Math.cos(this.eyeAngle) * 1;
            const pupilY = -1 + Math.sin(this.eyeAngle) * 1;
            ctx.fillRect(pupilX, pupilY, 2, 2);
        }

        // Hat (if equipped)
        if (this.hat) {
            this.drawHat(ctx);
        }

        ctx.restore();

        // Debug: draw physics circle
        if (window.DEBUG) {
            ctx.strokeStyle = Utils.COLORS.RED;
            ctx.beginPath();
            ctx.arc(this.body.pos.x, this.body.pos.y, this.body.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    drawHat(ctx) {
        ctx.save();
        ctx.rotate(-this.angle); // Un-rotate for hat

        switch (this.hat) {
            case 'chef':
                ctx.fillStyle = Utils.COLORS.WHITE;
                ctx.fillRect(-6, -14, 12, 4);
                ctx.fillRect(-4, -18, 8, 4);
                break;
            case 'goggles':
                ctx.strokeStyle = Utils.COLORS.YELLOW;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, -2, 6, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'crown':
                ctx.fillStyle = Utils.COLORS.GOLD;
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(-6 + i * 4, -12 - (i % 2) * 2, 3, 4);
                }
                break;
        }

        ctx.restore();
    }
}

class Collectible {
    constructor(x, y, type = 'shell') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.collected = false;
        this.radius = 6;
        this.bobOffset = 0;
        this.bobSpeed = 2;
    }

    update(dt) {
        this.bobOffset += dt * this.bobSpeed;
    }

    checkCollision(fish) {
        if (!this.collected) {
            const dist = Utils.distance(
                { x: this.x, y: this.y + Math.sin(this.bobOffset) * 2 },
                fish.body.pos
            );
            if (dist < this.radius + fish.body.radius) {
                this.collected = true;
                Audio.playCollect();
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        if (this.collected) return;

        const y = this.y + Math.sin(this.bobOffset) * 2;

        ctx.save();
        ctx.translate(this.x, y);

        if (this.type === 'shell') {
            // Draw shell
            ctx.fillStyle = Utils.COLORS.YELLOW;
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = Utils.COLORS.BROWN;
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const x = Math.cos(angle) * 3;
                const y = Math.sin(angle) * 3;
                ctx.fillRect(x - 1, y - 1, 2, 2);
            }
        } else if (this.type === 'star') {
            // Draw starfish
            ctx.fillStyle = Utils.COLORS.MAGENTA;
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 6;
                const y = Math.sin(angle) * 6;
                ctx.fillRect(x - 2, y - 2, 4, 4);
            }
            ctx.fillRect(-2, -2, 4, 4);
        }

        ctx.restore();
    }
}

class WaterZone {
    constructor(x, y, width, height, isGoal = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isGoal = isGoal;
        this.animation = 0;
    }

    update(dt) {
        this.animation += dt * 3;
    }

    checkCollision(fish) {
        return Utils.pointInRect(fish.body.pos, this);
    }

    draw(ctx) {
        // Animated water
        ctx.fillStyle = Utils.COLORS.WATER_DARK;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Water waves
        ctx.fillStyle = Utils.COLORS.WATER;
        for (let i = 0; i < this.width; i += 8) {
            const waveHeight = Math.sin(this.animation + i * 0.2) * 2;
            ctx.fillRect(this.x + i, this.y + waveHeight, 8, 4);
        }

        // Goal indicator
        if (this.isGoal) {
            ctx.fillStyle = Utils.COLORS.YELLOW;
            const pulseSize = Math.sin(this.animation * 2) * 2 + 4;
            ctx.fillRect(
                this.x + this.width / 2 - pulseSize / 2,
                this.y + this.height / 2 - pulseSize / 2,
                pulseSize,
                pulseSize
            );
        }
    }
}
