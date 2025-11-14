// Utility functions for Fish Putt Adventure

const Utils = {
    // Vector operations
    vec2: (x, y) => ({ x, y }),

    add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),

    sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),

    mul: (v, scalar) => ({ x: v.x * scalar, y: v.y * scalar }),

    dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,

    length: (v) => Math.sqrt(v.x * v.x + v.y * v.y),

    normalize: (v) => {
        const len = Utils.length(v);
        return len > 0 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 };
    },

    distance: (v1, v2) => Utils.length(Utils.sub(v1, v2)),

    lerp: (a, b, t) => a + (b - a) * t,

    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),

    // Collision detection
    circleCircle: (c1, r1, c2, r2) => {
        return Utils.distance(c1, c2) < (r1 + r2);
    },

    circleRect: (circle, radius, rect) => {
        const closestX = Utils.clamp(circle.x, rect.x, rect.x + rect.width);
        const closestY = Utils.clamp(circle.y, rect.y, rect.y + rect.height);
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        return (dx * dx + dy * dy) < (radius * radius);
    },

    pointInRect: (point, rect) => {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
               point.y >= rect.y && point.y <= rect.y + rect.height;
    },

    // Angle utilities
    angleBetween: (v1, v2) => Math.atan2(v2.y - v1.y, v2.x - v1.x),

    // Random utilities
    randomRange: (min, max) => min + Math.random() * (max - min),

    randomInt: (min, max) => Math.floor(Utils.randomRange(min, max + 1)),

    randomChoice: (array) => array[Math.floor(Math.random() * array.length)],

    // Color utilities for retro palette
    COLORS: {
        // Retro CGA/EGA inspired palette
        BLACK: '#000000',
        DARK_BLUE: '#0000aa',
        DARK_GREEN: '#00aa00',
        DARK_CYAN: '#00aaaa',
        DARK_RED: '#aa0000',
        DARK_MAGENTA: '#aa00aa',
        BROWN: '#aa5500',
        LIGHT_GRAY: '#aaaaaa',
        DARK_GRAY: '#555555',
        BLUE: '#5555ff',
        GREEN: '#55ff55',
        CYAN: '#55ffff',
        RED: '#ff5555',
        MAGENTA: '#ff55ff',
        YELLOW: '#ffff55',
        WHITE: '#ffffff',

        // Fish colors
        ORANGE: '#ff8800',
        TEAL: '#00ffaa',
        GOLD: '#ffdd00',

        // Water colors
        WATER: '#0088ff',
        WATER_LIGHT: '#00aaff',
        WATER_DARK: '#0066cc',

        // Surface colors
        GLASS: '#88ccff',
        TILE: '#cccccc',
        SOAP: '#ffccff',
        SPONGE: '#ffff88',
        TOWEL: '#ff8888',
    },

    // Save/Load utilities
    saveData: (key, data) => {
        try {
            localStorage.setItem('fishputt_' + key, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save data:', e);
        }
    },

    loadData: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem('fishputt_' + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn('Failed to load data:', e);
            return defaultValue;
        }
    }
};
