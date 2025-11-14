// Main game engine

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputSystem(canvas);
        this.particles = new ParticleSystem();
        this.ui = new UIManager(this.renderer, this.input);

        this.state = 'menu'; // menu, playing, complete, failed
        this.currentLevelIndex = 0;
        this.level = null;
        this.fish = null;
        this.physics = null;

        this.strokes = 0;
        this.stars = 0;
        this.isAiming = false;

        this.obstacleEntities = [];
        this.collectibleEntities = [];
        this.waterZoneEntities = [];

        this.setupUI();
    }

    setupUI() {
        this.ui.on('startGame', () => {
            this.startLevel(0);
        });

        this.ui.on('levelSelect', () => {
            this.ui.showLevelSelect(this.currentLevelIndex);
        });

        this.ui.on('customize', () => {
            this.ui.currentScreen = 'customize';
        });

        this.ui.on('selectLevel', (index) => {
            this.startLevel(index);
        });

        this.ui.on('back', () => {
            this.state = 'menu';
            this.ui.showMainMenu();
        });
    }

    showMenu() {
        this.state = 'menu';
        this.ui.showMainMenu();
    }

    startLevel(index) {
        this.currentLevelIndex = index;
        this.level = getLevelByIndex(index);

        if (!this.level) {
            console.error('Level not found:', index);
            this.showMenu();
            return;
        }

        // Initialize physics
        this.physics = new PhysicsWorld(this.canvas.width, this.canvas.height);

        // Create fish
        this.fish = new Fish(this.level.fishStart.x, this.level.fishStart.y);

        // Create walls
        this.level.walls.forEach(wallData => {
            const wall = new Wall(
                wallData.x,
                wallData.y,
                wallData.width,
                wallData.height,
                wallData.surface
            );
            this.physics.addStatic(wall);
        });

        // Create obstacles
        this.obstacleEntities = [];
        if (this.level.obstacles) {
            this.level.obstacles.forEach(obsData => {
                let obstacle;
                switch (obsData.type) {
                    case 'bumper':
                        obstacle = new Bumper(obsData.x, obsData.y, obsData.radius, obsData.bounciness);
                        this.physics.addStatic(obstacle);
                        break;
                    case 'rotating':
                        obstacle = new RotatingObstacle(obsData.x, obsData.y, obsData.length, obsData.speed);
                        break;
                    case 'paw':
                        obstacle = new SwingingPaw(obsData.x, obsData.y, obsData.length, obsData.speed);
                        break;
                    case 'bubble':
                        obstacle = new Bubble(obsData.x, obsData.y, obsData.strength);
                        break;
                    case 'platform':
                        obstacle = new MovingPlatform(
                            obsData.x, obsData.y, obsData.width, obsData.height,
                            obsData.endX, obsData.endY, obsData.speed
                        );
                        this.physics.addStatic(obstacle);
                        break;
                }
                if (obstacle) {
                    this.obstacleEntities.push(obstacle);
                }
            });
        }

        // Create collectibles
        this.collectibleEntities = [];
        if (this.level.collectibles) {
            this.level.collectibles.forEach(colData => {
                this.collectibleEntities.push(new Collectible(colData.x, colData.y, colData.type));
            });
        }

        // Create water zones
        this.waterZoneEntities = [];
        if (this.level.waterZones) {
            this.level.waterZones.forEach(zoneData => {
                this.waterZoneEntities.push(new WaterZone(
                    zoneData.x, zoneData.y, zoneData.width, zoneData.height, zoneData.isGoal
                ));
            });
        }

        // Create goal
        this.goalZone = new WaterZone(
            this.level.goal.x,
            this.level.goal.y,
            this.level.goal.width,
            this.level.goal.height,
            true
        );

        // Reset game state
        this.strokes = 0;
        this.stars = 0;
        this.state = 'playing';
        this.isAiming = false;
        this.particles.clear();

        // Setup input
        this.setupGameInput();

        Audio.playClick();
    }

    setupGameInput() {
        this.input.on('onDragStart', (pos) => {
            if (this.state !== 'playing') return;

            // Check if clicking on fish
            const dist = Utils.distance(pos, this.fish.body.pos);
            if (dist < 30 && this.fish.state === 'idle' || this.fish.state === 'stopped') {
                this.isAiming = true;
                this.fish.state = 'aiming';
            }
        });

        this.input.on('onDragMove', (start, current) => {
            // Just visual feedback handled in render
        });

        this.input.on('onDragEnd', (start, end) => {
            if (!this.isAiming || this.state !== 'playing') return;

            const dragVec = Utils.sub(start, end);
            const distance = Utils.length(dragVec);

            if (distance > 5) {
                const maxPower = 20;
                const power = Math.min(distance / 10, maxPower);
                const angle = Math.atan2(dragVec.y, dragVec.x);

                this.fish.launch(power, angle);
                this.strokes++;

                this.particles.splash(this.fish.body.pos.x, this.fish.body.pos.y);
            } else {
                this.fish.state = 'idle';
            }

            this.isAiming = false;
        });

        this.input.on('onClick', (pos) => {
            if (this.state === 'complete') {
                this.handleComplete();
            } else if (this.state === 'failed') {
                this.retryLevel();
            } else if (this.state === 'playing' && this.fish.state === 'flying') {
                // Boost
                if (this.fish.boost()) {
                    this.particles.bubbles(this.fish.body.pos.x, this.fish.body.pos.y);
                }
            }
        });
    }

    update(dt) {
        if (this.state === 'menu') {
            return;
        }

        if (this.state !== 'playing') {
            return;
        }

        // Update fish
        this.fish.update(dt, this.particles, { width: this.canvas.width, height: this.canvas.height });

        // Check fish collision with walls
        if (this.fish.state === 'flying') {
            this.level.walls.forEach(wallData => {
                this.checkFishWallCollision(wallData);
            });
        }

        // Update physics (for obstacles only now)
        this.physics.update(dt);

        // Update obstacles
        this.obstacleEntities.forEach(obs => {
            obs.update(dt);

            // Check collision with fish
            if (obs.checkCollision) {
                obs.checkCollision(this.fish);
            }
        });

        // Update collectibles
        this.collectibleEntities.forEach(col => {
            col.update(dt);
            if (col.checkCollision(this.fish)) {
                this.particles.sparkle(col.x, col.y);
            }
        });

        // Update water zones
        this.waterZoneEntities.forEach(zone => {
            zone.update(dt);
            if (zone.checkCollision(this.fish)) {
                this.particles.splash(this.fish.body.pos.x, this.fish.body.pos.y, zone.color);
            }
        });

        // Update goal
        this.goalZone.update(dt);
        if (this.goalZone.checkCollision(this.fish)) {
            this.completeLevel();
        }

        // Update particles
        this.particles.update(dt);

        // Check fail conditions
        if (this.fish.state === 'stopped' && this.strokes >= this.level.strokeLimit) {
            this.failLevel();
        }

        // Check if fish fell off screen
        if (this.fish.body.pos.y > this.canvas.height + 50) {
            this.fish.reset();
            if (this.strokes >= this.level.strokeLimit) {
                this.failLevel();
            }
        }
    }

    completeLevel() {
        if (this.state === 'complete') return;

        this.state = 'complete';

        // Calculate stars
        if (this.strokes <= this.level.strokeLimit - 2) {
            this.stars = 3;
        } else if (this.strokes <= this.level.strokeLimit) {
            this.stars = 2;
        } else {
            this.stars = 1;
        }

        Audio.playGoal();
        this.particles.sparkle(this.fish.body.pos.x, this.fish.body.pos.y);

        // Save progress
        const progress = Utils.loadData('progress', {});
        if (!progress[this.currentLevelIndex] || progress[this.currentLevelIndex] < this.stars) {
            progress[this.currentLevelIndex] = this.stars;
            Utils.saveData('progress', progress);
        }
    }

    failLevel() {
        if (this.state === 'failed') return;

        this.state = 'failed';
        Audio.playFail();
    }

    retryLevel() {
        this.startLevel(this.currentLevelIndex);
    }

    nextLevel() {
        const nextIndex = this.currentLevelIndex + 1;
        if (nextIndex < getTotalLevels()) {
            this.startLevel(nextIndex);
        } else {
            // Game complete!
            this.showMenu();
        }
    }

    checkFishWallCollision(wall) {
        const fish = this.fish.body;

        // Find closest point on rectangle to circle
        const closestX = Utils.clamp(fish.pos.x, wall.x, wall.x + wall.width);
        const closestY = Utils.clamp(fish.pos.y, wall.y, wall.y + wall.height);

        const dx = fish.pos.x - closestX;
        const dy = fish.pos.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < fish.radius) {
            // Collision detected - push fish out
            if (distance > 0) {
                const nx = dx / distance;
                const ny = dy / distance;

                // Push fish outside the wall
                const overlap = fish.radius - distance;
                fish.pos.x += nx * overlap;
                fish.pos.y += ny * overlap;

                // Bounce with energy loss
                const dotProduct = fish.vel.x * nx + fish.vel.y * ny;
                fish.vel.x -= 2 * dotProduct * nx;
                fish.vel.y -= 2 * dotProduct * ny;
                fish.vel.x *= 0.5; // Energy loss on bounce
                fish.vel.y *= 0.5;

                Audio.playBounce(0.7);
                this.particles.splash(fish.pos.x, fish.pos.y);
            }
        }
    }

    handleComplete() {
        this.nextLevel();
    }

    draw() {
        if (this.state === 'menu') {
            this.ui.draw();
            return;
        }

        // Draw background
        this.renderer.drawBackground(this.level);

        // Draw walls
        this.level.walls.forEach(wallData => {
            const wall = new Wall(wallData.x, wallData.y, wallData.width, wallData.height, wallData.surface);
            wall.draw(this.renderer.ctx);
        });

        // Draw water zones
        this.waterZoneEntities.forEach(zone => zone.draw(this.renderer.ctx));

        // Draw goal
        this.goalZone.draw(this.renderer.ctx);

        // Draw collectibles
        this.collectibleEntities.forEach(col => col.draw(this.renderer.ctx));

        // Draw obstacles
        this.obstacleEntities.forEach(obs => obs.draw(this.renderer.ctx));

        // Draw particles
        this.particles.draw(this.renderer.ctx);

        // Draw fish
        this.fish.draw(this.renderer.ctx);

        // Draw aiming line
        if (this.isAiming && this.fish.state === 'aiming') {
            this.renderer.drawSlingshotAim(this.fish, this.input);
        }

        // Draw HUD
        const collected = this.collectibleEntities.filter(c => c.collected).length;
        this.renderer.drawHUD(this.strokes, this.level.strokeLimit, this.stars, this.collectibleEntities);

        // Draw overlays
        if (this.state === 'complete') {
            this.renderer.drawLevelComplete(this.stars, collected, this.collectibleEntities.length);
        } else if (this.state === 'failed') {
            this.renderer.drawLevelFailed();
        }
    }

    run() {
        let lastTime = performance.now();

        const gameLoop = (currentTime) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;

            this.update(dt);
            this.draw();

            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }
}
