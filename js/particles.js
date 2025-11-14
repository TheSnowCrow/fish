// Particle system for retro visual effects

class Particle {
    constructor(x, y, vx, vy, color, life, size = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.gravity = 0.2;
    }

    update(dt) {
        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;
        this.vy += this.gravity * dt * 60;
        this.life -= dt;
        return this.life > 0;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, config = {}) {
        const {
            color = Utils.COLORS.WHITE,
            speedMin = 1,
            speedMax = 3,
            angleMin = 0,
            angleMax = Math.PI * 2,
            life = 1,
            size = 2,
            gravity = true
        } = config;

        for (let i = 0; i < count; i++) {
            const angle = Utils.randomRange(angleMin, angleMax);
            const speed = Utils.randomRange(speedMin, speedMax);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            const particle = new Particle(x, y, vx, vy, color, life, size);
            if (!gravity) particle.gravity = 0;
            this.particles.push(particle);
        }
    }

    // Specific effect emitters
    splash(x, y, color = Utils.COLORS.WATER) {
        this.emit(x, y, 8, {
            color,
            speedMin: 2,
            speedMax: 5,
            angleMin: -Math.PI,
            angleMax: 0,
            life: 0.5,
            size: 3
        });
    }

    bubbles(x, y) {
        this.emit(x, y, 5, {
            color: Utils.COLORS.CYAN,
            speedMin: 0.5,
            speedMax: 1.5,
            angleMin: -Math.PI * 0.8,
            angleMax: -Math.PI * 0.2,
            life: 1,
            size: 2,
            gravity: false
        });
    }

    sparkle(x, y) {
        this.emit(x, y, 12, {
            color: Utils.COLORS.YELLOW,
            speedMin: 1,
            speedMax: 4,
            life: 0.6,
            size: 2
        });
    }

    trail(x, y, color = Utils.COLORS.CYAN) {
        this.emit(x, y, 2, {
            color,
            speedMin: 0,
            speedMax: 0.5,
            life: 0.3,
            size: 2
        });
    }

    update(dt) {
        this.particles = this.particles.filter(p => p.update(dt));
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}
