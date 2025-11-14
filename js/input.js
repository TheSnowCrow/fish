// Input handling for touch and mouse

class InputSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.mousePos = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragCurrent = { x: 0, y: 0 };
        this.callbacks = {
            onDragStart: null,
            onDragMove: null,
            onDragEnd: null,
            onClick: null
        };

        this.setupListeners();
    }

    setupListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleEnd(e));

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleStart(e.touches[0]);
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleMove(e.touches[0]);
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleEnd(e.changedTouches[0]);
        }, { passive: false });
    }

    getEventPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    handleStart(e) {
        const pos = this.getEventPosition(e);
        this.isDragging = true;
        this.dragStart = { ...pos };
        this.dragCurrent = { ...pos };
        this.mousePos = { ...pos };

        if (this.callbacks.onDragStart) {
            this.callbacks.onDragStart(pos);
        }

        // Resume audio context on first interaction
        Audio.resume();
    }

    handleMove(e) {
        const pos = this.getEventPosition(e);
        this.mousePos = { ...pos };

        if (this.isDragging) {
            this.dragCurrent = { ...pos };

            if (this.callbacks.onDragMove) {
                this.callbacks.onDragMove(this.dragStart, this.dragCurrent);
            }
        }
    }

    handleEnd(e) {
        if (this.isDragging) {
            const pos = this.getEventPosition(e);

            // Check if it was a click (minimal drag)
            const dragDistance = Utils.distance(this.dragStart, pos);
            if (dragDistance < 5) {
                if (this.callbacks.onClick) {
                    this.callbacks.onClick(pos);
                }
            } else {
                if (this.callbacks.onDragEnd) {
                    this.callbacks.onDragEnd(this.dragStart, pos);
                }
            }

            this.isDragging = false;
        }
    }

    getDragVector() {
        return Utils.sub(this.dragStart, this.dragCurrent);
    }

    getDragDistance() {
        return Utils.distance(this.dragStart, this.dragCurrent);
    }

    on(event, callback) {
        this.callbacks[event] = callback;
    }
}
