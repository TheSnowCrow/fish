// Level definitions for all 5 worlds

class Level {
    constructor(config) {
        this.name = config.name;
        this.world = config.world;
        this.number = config.number;
        this.strokeLimit = config.strokeLimit || 5;
        this.background = config.background || Utils.COLORS.DARK_BLUE;

        this.fishStart = config.fishStart;
        this.walls = config.walls || [];
        this.obstacles = config.obstacles || [];
        this.collectibles = config.collectibles || [];
        this.waterZones = config.waterZones || [];
        this.goal = config.goal;
    }
}

const LEVELS = {
    // ==================
    // WORLD 1: FISH TANK ESCAPE
    // ==================
    world1: [
        new Level({
            name: "First Splash",
            world: 1,
            number: 1,
            strokeLimit: 3,
            background: '#1a3a4a',
            fishStart: { x: 100, y: 300 },
            walls: [
                { x: 50, y: 350, width: 200, height: 20, surface: SurfaceType.GLASS },
                { x: 400, y: 250, width: 150, height: 20, surface: SurfaceType.GLASS }
            ],
            goal: { x: 650, y: 200, width: 80, height: 60 },
            collectibles: [
                { x: 300, y: 300, type: 'shell' }
            ]
        }),

        new Level({
            name: "Tank Bounce",
            world: 1,
            number: 2,
            strokeLimit: 4,
            background: '#1a3a4a',
            fishStart: { x: 100, y: 500 },
            walls: [
                { x: 0, y: 550, width: 800, height: 50, surface: SurfaceType.GLASS },
                { x: 300, y: 400, width: 200, height: 20, surface: SurfaceType.GLASS }
            ],
            obstacles: [
                { type: 'bumper', x: 250, y: 450 },
                { type: 'bumper', x: 450, y: 350 }
            ],
            goal: { x: 650, y: 100, width: 80, height: 60 },
            collectibles: [
                { x: 400, y: 500, type: 'shell' },
                { x: 550, y: 250, type: 'star' }
            ]
        }),

        new Level({
            name: "Gravel Path",
            world: 1,
            number: 3,
            strokeLimit: 5,
            background: '#1a3a4a',
            fishStart: { x: 100, y: 400 },
            walls: [
                { x: 0, y: 450, width: 300, height: 20, surface: SurfaceType.GLASS },
                { x: 350, y: 350, width: 150, height: 20, surface: SurfaceType.SPONGE },
                { x: 550, y: 280, width: 200, height: 20, surface: SurfaceType.GLASS }
            ],
            obstacles: [
                { type: 'rotating', x: 300, y: 250, length: 50, speed: 0.8 }
            ],
            goal: { x: 680, y: 180, width: 80, height: 60 }
        })
    ],

    // ==================
    // WORLD 2: BATHROOM COUNTER
    // ==================
    world2: [
        new Level({
            name: "Slippery Slope",
            world: 2,
            number: 1,
            strokeLimit: 4,
            background: '#e8f4f8',
            fishStart: { x: 100, y: 500 },
            walls: [
                { x: 0, y: 550, width: 400, height: 50, surface: SurfaceType.SOAP },
                { x: 450, y: 450, width: 300, height: 20, surface: SurfaceType.TILE }
            ],
            goal: { x: 650, y: 350, width: 80, height: 60 },
            collectibles: [
                { x: 200, y: 500, type: 'shell' },
                { x: 550, y: 400, type: 'shell' }
            ]
        }),

        new Level({
            name: "Brush Spin",
            world: 2,
            number: 2,
            strokeLimit: 5,
            background: '#e8f4f8',
            fishStart: { x: 100, y: 450 },
            walls: [
                { x: 0, y: 500, width: 250, height: 20, surface: SurfaceType.TILE },
                { x: 550, y: 350, width: 250, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'rotating', x: 400, y: 400, length: 60, speed: 1 }
            ],
            goal: { x: 650, y: 250, width: 80, height: 60 }
        }),

        new Level({
            name: "Towel Trap",
            world: 2,
            number: 3,
            strokeLimit: 6,
            background: '#e8f4f8',
            fishStart: { x: 100, y: 450 },
            walls: [
                { x: 0, y: 500, width: 200, height: 20, surface: SurfaceType.TILE },
                { x: 250, y: 450, width: 150, height: 20, surface: SurfaceType.TOWEL },
                { x: 450, y: 400, width: 150, height: 20, surface: SurfaceType.SOAP },
                { x: 650, y: 300, width: 150, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'bumper', x: 350, y: 350 }
            ],
            goal: { x: 680, y: 200, width: 80, height: 60 },
            collectibles: [
                { x: 320, y: 400, type: 'shell' },
                { x: 550, y: 350, type: 'star' }
            ]
        })
    ],

    // ==================
    // WORLD 3: BATHTUB RUN
    // ==================
    world3: [
        new Level({
            name: "Duck Pond",
            world: 3,
            number: 1,
            strokeLimit: 4,
            background: '#d0e8ff',
            fishStart: { x: 100, y: 450 },
            walls: [
                { x: 0, y: 500, width: 300, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'bumper', x: 300, y: 400, bounciness: 2 },
                { type: 'bumper', x: 500, y: 300, bounciness: 2 }
            ],
            waterZones: [
                { x: 100, y: 150, width: 200, height: 80, isGoal: false }
            ],
            goal: { x: 600, y: 150, width: 120, height: 80 },
            collectibles: [
                { x: 400, y: 350, type: 'shell' }
            ]
        }),

        new Level({
            name: "Bubble Lift",
            world: 3,
            number: 2,
            strokeLimit: 5,
            background: '#d0e8ff',
            fishStart: { x: 100, y: 500 },
            walls: [
                { x: 0, y: 550, width: 250, height: 50, surface: SurfaceType.TILE },
                { x: 550, y: 200, width: 250, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'bubble', x: 200, y: 400 },
                { type: 'bubble', x: 350, y: 350 },
                { type: 'bubble', x: 500, y: 300 }
            ],
            goal: { x: 600, y: 100, width: 120, height: 80 }
        }),

        new Level({
            name: "Swinging Danger",
            world: 3,
            number: 3,
            strokeLimit: 6,
            background: '#d0e8ff',
            fishStart: { x: 100, y: 450 },
            walls: [
                { x: 0, y: 500, width: 250, height: 20, surface: SurfaceType.TILE },
                { x: 550, y: 350, width: 250, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'paw', x: 400, y: 50, length: 80, speed: 1.2 }
            ],
            goal: { x: 650, y: 250, width: 100, height: 80 },
            collectibles: [
                { x: 400, y: 250, type: 'star' }
            ]
        })
    ],

    // ==================
    // WORLD 4: SEWER PUTT-PUTT
    // ==================
    world4: [
        new Level({
            name: "Pipe Dream",
            world: 4,
            number: 1,
            strokeLimit: 5,
            background: '#2a4a3a',
            fishStart: { x: 100, y: 450 },
            walls: [
                { x: 0, y: 500, width: 300, height: 20, surface: SurfaceType.TILE },
                { x: 200, y: 400, width: 20, height: 100, surface: SurfaceType.TILE },
                { x: 400, y: 350, width: 200, height: 20, surface: SurfaceType.SPONGE },
                { x: 650, y: 250, width: 150, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'bumper', x: 350, y: 420 }
            ],
            goal: { x: 680, y: 150, width: 80, height: 60 },
            collectibles: [
                { x: 150, y: 450, type: 'shell' },
                { x: 500, y: 300, type: 'star' }
            ]
        }),

        new Level({
            name: "Slime Time",
            world: 4,
            number: 2,
            strokeLimit: 6,
            background: '#2a4a3a',
            fishStart: { x: 100, y: 500 },
            walls: [
                { x: 0, y: 550, width: 800, height: 50, surface: SurfaceType.TILE },
                { x: 200, y: 450, width: 200, height: 20, surface: SurfaceType.SOAP },
                { x: 500, y: 350, width: 150, height: 20, surface: SurfaceType.SPONGE }
            ],
            obstacles: [
                { type: 'rotating', x: 350, y: 350, length: 50, speed: 1.2 }
            ],
            goal: { x: 650, y: 250, width: 80, height: 60 }
        }),

        new Level({
            name: "The Gauntlet",
            world: 4,
            number: 3,
            strokeLimit: 7,
            background: '#2a4a3a',
            fishStart: { x: 100, y: 450 },
            walls: [
                { x: 0, y: 500, width: 200, height: 20, surface: SurfaceType.TILE },
                { x: 300, y: 400, width: 150, height: 20, surface: SurfaceType.SOAP },
                { x: 550, y: 300, width: 150, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'paw', x: 300, y: 50, length: 70 },
                { type: 'bumper', x: 450, y: 350 }
            ],
            goal: { x: 650, y: 200, width: 80, height: 60 },
            collectibles: [
                { x: 375, y: 350, type: 'shell' },
                { x: 625, y: 250, type: 'star' }
            ]
        })
    ],

    // ==================
    // WORLD 5: BEACH + OCEAN
    // ==================
    world5: [
        new Level({
            name: "Sandy Shores",
            world: 5,
            number: 1,
            strokeLimit: 5,
            background: '#ffffcc',
            fishStart: { x: 100, y: 500 },
            walls: [
                { x: 0, y: 550, width: 400, height: 50, surface: SurfaceType.SAND },
                { x: 500, y: 450, width: 300, height: 20, surface: SurfaceType.SAND }
            ],
            obstacles: [
                { type: 'bumper', x: 250, y: 480, bounciness: 1.8 },
                { type: 'bumper', x: 600, y: 380, bounciness: 1.8 }
            ],
            goal: { x: 650, y: 300, width: 120, height: 100 },
            collectibles: [
                { x: 200, y: 500, type: 'shell' },
                { x: 550, y: 400, type: 'star' }
            ]
        }),

        new Level({
            name: "Coral Maze",
            world: 5,
            number: 2,
            strokeLimit: 6,
            background: '#88ccff',
            fishStart: { x: 100, y: 450 },
            walls: [
                { x: 0, y: 500, width: 200, height: 20, surface: SurfaceType.TILE },
                { x: 250, y: 400, width: 20, height: 120, surface: SurfaceType.TILE },
                { x: 400, y: 350, width: 20, height: 100, surface: SurfaceType.TILE },
                { x: 550, y: 300, width: 200, height: 20, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'bubble', x: 150, y: 350 },
                { type: 'rotating', x: 500, y: 400, length: 40 }
            ],
            goal: { x: 600, y: 150, width: 120, height: 100 }
        }),

        new Level({
            name: "Freedom!",
            world: 5,
            number: 3,
            strokeLimit: 8,
            background: '#88ccff',
            fishStart: { x: 100, y: 500 },
            walls: [
                { x: 0, y: 550, width: 800, height: 50, surface: SurfaceType.TILE }
            ],
            obstacles: [
                { type: 'paw', x: 250, y: 50, length: 80, speed: 1.5 },
                { type: 'rotating', x: 450, y: 350, length: 60, speed: 1.2 },
                { type: 'bumper', x: 600, y: 400 },
                { type: 'bubble', x: 350, y: 450 }
            ],
            waterZones: [
                { x: 200, y: 200, width: 150, height: 80, isGoal: false }
            ],
            goal: { x: 600, y: 100, width: 150, height: 120 },
            collectibles: [
                { x: 200, y: 500, type: 'shell' },
                { x: 400, y: 400, type: 'star' },
                { x: 650, y: 300, type: 'star' }
            ]
        })
    ]
};

// Helper to get all levels in order
function getAllLevels() {
    const all = [];
    for (let world = 1; world <= 5; world++) {
        const worldLevels = LEVELS[`world${world}`];
        all.push(...worldLevels);
    }
    return all;
}

function getLevelByIndex(index) {
    const all = getAllLevels();
    return all[index] || null;
}

function getTotalLevels() {
    return getAllLevels().length;
}
