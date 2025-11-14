// Physics engine for Fish Putt Adventure

const SurfaceType = {
    GLASS: 'glass',
    TILE: 'tile',
    COUNTERTOP: 'countertop',
    TOWEL: 'towel',
    SOAP: 'soap',
    SPONGE: 'sponge',
    SAND: 'sand',
    WATER: 'water'
};

const SurfaceProperties = {
    [SurfaceType.GLASS]: {
        friction: 0.98,
        bounciness: 0.7,
        color: Utils.COLORS.GLASS,
        name: 'Glass'
    },
    [SurfaceType.TILE]: {
        friction: 0.96,
        bounciness: 0.4,
        color: Utils.COLORS.TILE,
        name: 'Tile'
    },
    [SurfaceType.COUNTERTOP]: {
        friction: 0.94,
        bounciness: 0.3,
        color: '#ddddaa',
        name: 'Counter'
    },
    [SurfaceType.TOWEL]: {
        friction: 0.85,
        bounciness: 0.1,
        color: Utils.COLORS.TOWEL,
        name: 'Towel'
    },
    [SurfaceType.SOAP]: {
        friction: 0.99,
        bounciness: 0.5,
        color: Utils.COLORS.SOAP,
        name: 'Soap'
    },
    [SurfaceType.SPONGE]: {
        friction: 0.80,
        bounciness: 0.05,
        color: Utils.COLORS.SPONGE,
        name: 'Sponge'
    },
    [SurfaceType.SAND]: {
        friction: 0.88,
        bounciness: 0.1,
        color: '#ddaa77',
        name: 'Sand'
    },
    [SurfaceType.WATER]: {
        friction: 0.96,
        bounciness: 0,
        color: Utils.COLORS.WATER,
        name: 'Water'
    }
};

class PhysicsBody {
    constructor(x, y, radius) {
        this.pos = Utils.vec2(x, y);
        this.vel = Utils.vec2(0, 0);
        this.acc = Utils.vec2(0, 0);
        this.radius = radius;
        this.mass = 1;
        this.drag = 0.99;
        this.gravity = 0.15; // Reduced gravity for easier control
        this.onGround = false;
        this.currentSurface = SurfaceType.COUNTERTOP;
        this.enableGravity = false; // Only apply gravity when enabled
    }

    applyForce(force) {
        this.acc.x += force.x / this.mass;
        this.acc.y += force.y / this.mass;
    }

    update(dt) {
        // Apply gravity only if enabled
        if (this.enableGravity) {
            this.vel.y += this.gravity * dt * 60;
        }

        // Apply acceleration
        this.vel.x += this.acc.x * dt * 60;
        this.vel.y += this.acc.y * dt * 60;

        // Apply drag and surface friction
        const surface = SurfaceProperties[this.currentSurface];
        this.vel.x *= surface.friction;
        this.vel.y *= surface.friction;
        this.vel.x *= this.drag;
        this.vel.y *= this.drag;

        // Update position
        this.pos.x += this.vel.x * dt * 60;
        this.pos.y += this.vel.y * dt * 60;

        // Reset acceleration
        this.acc.x = 0;
        this.acc.y = 0;

        // Check if moving
        const speed = Utils.length(this.vel);
        return speed > 0.1; // Return true if still moving
    }

    getSpeed() {
        return Utils.length(this.vel);
    }

    isStopped() {
        return this.getSpeed() < 0.1;
    }
}

class PhysicsWorld {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.bodies = [];
        this.staticObjects = [];
    }

    addBody(body) {
        this.bodies.push(body);
        return body;
    }

    addStatic(obj) {
        this.staticObjects.push(obj);
        return obj;
    }

    checkCollision(body, obj) {
        if (obj.type === 'rect') {
            return Utils.circleRect(body.pos, body.radius, obj);
        } else if (obj.type === 'circle') {
            return Utils.circleCircle(body.pos, body.radius, obj.pos, obj.radius);
        }
        return false;
    }

    resolveCollision(body, obj) {
        if (obj.type === 'rect') {
            this.resolveRectCollision(body, obj);
        } else if (obj.type === 'circle') {
            this.resolveCircleCollision(body, obj);
        }
    }

    resolveRectCollision(body, rect) {
        // Find closest point on rectangle
        const closestX = Utils.clamp(body.pos.x, rect.x, rect.x + rect.width);
        const closestY = Utils.clamp(body.pos.y, rect.y, rect.y + rect.height);

        const dx = body.pos.x - closestX;
        const dy = body.pos.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < body.radius) {
            // Push body out
            const overlap = body.radius - distance;
            if (distance > 0) {
                const nx = dx / distance;
                const ny = dy / distance;
                body.pos.x += nx * overlap;
                body.pos.y += ny * overlap;

                // Bounce
                const surface = SurfaceProperties[rect.surface || SurfaceType.COUNTERTOP];
                const dotProduct = body.vel.x * nx + body.vel.y * ny;
                body.vel.x -= 2 * dotProduct * nx;
                body.vel.y -= 2 * dotProduct * ny;
                body.vel.x *= surface.bounciness;
                body.vel.y *= surface.bounciness;

                body.currentSurface = rect.surface || SurfaceType.COUNTERTOP;

                return true;
            }
        }
        return false;
    }

    resolveCircleCollision(body, circle) {
        const dx = body.pos.x - circle.pos.x;
        const dy = body.pos.y - circle.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = body.radius + circle.radius;

        if (distance < minDist) {
            // Push bodies apart
            const overlap = minDist - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            body.pos.x += nx * overlap * 0.5;
            body.pos.y += ny * overlap * 0.5;

            if (circle.pos) {
                circle.pos.x -= nx * overlap * 0.5;
                circle.pos.y -= ny * overlap * 0.5;
            }

            // Bounce
            const bounciness = circle.bounciness || 0.7;
            const dotProduct = body.vel.x * nx + body.vel.y * ny;
            body.vel.x -= 2 * dotProduct * nx * bounciness;
            body.vel.y -= 2 * dotProduct * ny * bounciness;

            return true;
        }
        return false;
    }

    update(dt) {
        this.bodies.forEach(body => {
            body.update(dt);

            // World bounds
            if (body.pos.x - body.radius < 0) {
                body.pos.x = body.radius;
                body.vel.x *= -0.5;
            }
            if (body.pos.x + body.radius > this.width) {
                body.pos.x = this.width - body.radius;
                body.vel.x *= -0.5;
            }
            if (body.pos.y - body.radius < 0) {
                body.pos.y = body.radius;
                body.vel.y *= -0.5;
            }
            if (body.pos.y + body.radius > this.height) {
                body.pos.y = this.height - body.radius;
                body.vel.y *= -0.5;
            }

            // Check collisions with static objects
            this.staticObjects.forEach(obj => {
                if (this.checkCollision(body, obj)) {
                    if (this.resolveCollision(body, obj)) {
                        // Collision occurred
                        if (obj.onCollide) {
                            obj.onCollide(body);
                        }
                    }
                }
            });
        });
    }
}
