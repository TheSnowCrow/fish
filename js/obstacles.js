// Environmental obstacles and hazards

class Wall {
    constructor(x, y, width, height, surface = SurfaceType.COUNTERTOP) {
        this.type = 'rect';
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.surface = surface;
    }

    update(dt) {}

    draw(ctx) {
        const props = SurfaceProperties[this.surface];
        ctx.fillStyle = props.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Add texture pattern
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for (let i = 0; i < this.width; i += 4) {
            for (let j = 0; j < this.height; j += 4) {
                if ((i + j) % 8 === 0) {
                    ctx.fillRect(this.x + i, this.y + j, 2, 2);
                }
            }
        }
    }
}

class Bumper {
    constructor(x, y, radius = 12, bounciness = 1.5) {
        this.type = 'circle';
        this.pos = { x, y };
        this.radius = radius;
        this.bounciness = bounciness;
        this.hitAnimation = 0;
    }

    update(dt) {
        if (this.hitAnimation > 0) {
            this.hitAnimation -= dt * 5;
        }
    }

    onCollide(body) {
        this.hitAnimation = 1;
        Audio.playBounce(1.5);
    }

    draw(ctx) {
        const size = this.radius + this.hitAnimation * 4;

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        // Outer ring
        ctx.fillStyle = Utils.COLORS.RED;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.fillStyle = Utils.COLORS.YELLOW;
        ctx.beginPath();
        ctx.arc(0, 0, size - 4, 0, Math.PI * 2);
        ctx.fill();

        // Center
        ctx.fillStyle = Utils.COLORS.WHITE;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class RotatingObstacle {
    constructor(x, y, length = 40, speed = 1) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.speed = speed;
        this.angle = 0;
        this.width = 8;
    }

    update(dt) {
        this.angle += this.speed * dt * Math.PI;
    }

    getEndPoints() {
        const x1 = this.x + Math.cos(this.angle) * this.length;
        const y1 = this.y + Math.sin(this.angle) * this.length;
        const x2 = this.x - Math.cos(this.angle) * this.length;
        const y2 = this.y - Math.sin(this.angle) * this.length;
        return { x1, y1, x2, y2 };
    }

    checkCollision(fish) {
        // Simple distance check to rotating bar
        const dx = fish.body.pos.x - this.x;
        const dy = fish.body.pos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.length + fish.body.radius) {
            // Project onto the rotating bar
            const angle = Math.atan2(dy, dx);
            const angleDiff = Math.abs(angle - this.angle);
            const normalizedDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);

            if (normalizedDiff < 0.3 && dist > 10) {
                // Hit by the bar
                const nx = Math.cos(this.angle + Math.PI / 2);
                const ny = Math.sin(this.angle + Math.PI / 2);

                fish.body.vel.x += nx * 8 * this.speed;
                fish.body.vel.y += ny * 8 * this.speed;
                Audio.playBounce(1);
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Toothbrush bristles
        ctx.fillStyle = Utils.COLORS.CYAN;
        for (let i = -this.length; i < this.length; i += 4) {
            ctx.fillRect(i, -this.width / 2 - 4, 3, 4);
        }

        // Handle
        ctx.fillStyle = Utils.COLORS.BLUE;
        ctx.fillRect(-this.length, -this.width / 2, this.length * 2, this.width);

        // Center pivot
        ctx.fillStyle = Utils.COLORS.DARK_GRAY;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class SwingingPaw {
    constructor(x, y, length = 50, speed = 1.5) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.speed = speed;
        this.angle = -Math.PI / 4;
        this.direction = 1;
        this.maxAngle = Math.PI / 4;
    }

    update(dt) {
        this.angle += this.direction * this.speed * dt;

        if (this.angle > this.maxAngle) {
            this.angle = this.maxAngle;
            this.direction = -1;
        } else if (this.angle < -this.maxAngle) {
            this.angle = -this.maxAngle;
            this.direction = 1;
        }
    }

    getPawPosition() {
        return {
            x: this.x + Math.cos(this.angle + Math.PI / 2) * this.length,
            y: this.y + Math.sin(this.angle + Math.PI / 2) * this.length
        };
    }

    checkCollision(fish) {
        const paw = this.getPawPosition();
        const dist = Utils.distance(fish.body.pos, paw);

        if (dist < 15 + fish.body.radius) {
            // Push fish away
            const dx = fish.body.pos.x - paw.x;
            const dy = fish.body.pos.y - paw.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0) {
                fish.body.vel.x += (dx / len) * 10;
                fish.body.vel.y += (dy / len) * 10;
                Audio.playBounce(1.2);
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        const paw = this.getPawPosition();

        // String/arm
        ctx.strokeStyle = Utils.COLORS.DARK_GRAY;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(paw.x, paw.y);
        ctx.stroke();

        // Paw
        ctx.save();
        ctx.translate(paw.x, paw.y);

        // Main pad
        ctx.fillStyle = Utils.COLORS.MAGENTA;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Toe beans
        ctx.fillStyle = Utils.COLORS.DARK_MAGENTA;
        const toePositions = [
            { x: -6, y: -8 },
            { x: 0, y: -10 },
            { x: 6, y: -8 }
        ];
        toePositions.forEach(toe => {
            ctx.beginPath();
            ctx.arc(toe.x, toe.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}

class MovingPlatform {
    constructor(x, y, width, height, endX, endY, speed = 1) {
        this.type = 'rect';
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.endX = endX;
        this.endY = endY;
        this.speed = speed;
        this.surface = SurfaceType.TILE;
        this.t = 0;
        this.direction = 1;
    }

    update(dt) {
        this.t += this.direction * this.speed * dt;

        if (this.t > 1) {
            this.t = 1;
            this.direction = -1;
        } else if (this.t < 0) {
            this.t = 0;
            this.direction = 1;
        }

        this.x = Utils.lerp(this.startX, this.endX, this.t);
        this.y = Utils.lerp(this.startY, this.endY, this.t);
    }

    draw(ctx) {
        ctx.fillStyle = SurfaceProperties[this.surface].color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Direction indicators
        ctx.fillStyle = Utils.COLORS.DARK_GRAY;
        ctx.fillRect(this.x + 4, this.y + this.height / 2 - 2, 4, 4);
        ctx.fillRect(this.x + this.width - 8, this.y + this.height / 2 - 2, 4, 4);
    }
}

class Bubble {
    constructor(x, y, strength = 5) {
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.strength = strength;
        this.animation = 0;
        this.active = true;
    }

    update(dt) {
        this.animation += dt * 2;
    }

    checkCollision(fish) {
        if (!this.active) return false;

        const dist = Utils.distance(fish.body.pos, { x: this.x, y: this.y });
        if (dist < this.radius + fish.body.radius) {
            fish.body.vel.y -= this.strength;
            this.active = false;
            Audio.playBubble();
            return true;
        }
        return false;
    }

    draw(ctx) {
        if (!this.active) return;

        const size = this.radius + Math.sin(this.animation * 2) * 2;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Bubble outline
        ctx.strokeStyle = Utils.COLORS.CYAN;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.stroke();

        // Shine
        ctx.fillStyle = Utils.COLORS.WHITE;
        ctx.fillRect(-4, -8, 4, 4);

        ctx.restore();
    }
}
