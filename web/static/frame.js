class PictureFrame {
    constructor() {
        this.media = [];
        this.currentIndex = 0;
        this.isPlaying = true;
        this.slideInterval = null;
        this.slideDuration = 10000; // 10 seconds per slide
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMedia();
        this.startSlideshow();
        
        // Refresh media every 30 seconds
        setInterval(() => this.loadMedia(), 30000);
        
        // Hide cursor after inactivity
        this.setupCursorHiding();
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const playPauseBtn = document.getElementById('play-pause-btn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case ' ':
                    this.nextSlide();
                    break;
                case 'p':
                case 'P':
                    this.togglePlayPause();
                    break;
                case 'r':
                case 'R':
                    this.loadMedia();
                    break;
            }
        });

        // Touch/swipe controls
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }

    setupCursorHiding() {
        let cursorTimeout;
        
        const showCursor = () => {
            document.body.style.cursor = 'default';
            clearTimeout(cursorTimeout);
            cursorTimeout = setTimeout(() => {
                document.body.style.cursor = 'none';
            }, 3000);
        };

        document.addEventListener('mousemove', showCursor);
        document.addEventListener('click', showCursor);
        
        // Initially hide cursor after 3 seconds
        cursorTimeout = setTimeout(() => {
            document.body.style.cursor = 'none';
        }, 3000);
    }

    async loadMedia() {
        try {
            const response = await fetch('/api/media');
            if (!response.ok) throw new Error('Failed to fetch media');
            
            const newMedia = await response.json();
            
            // Only update if media has changed
            if (JSON.stringify(newMedia) !== JSON.stringify(this.media)) {
                this.media = newMedia;
                this.updateDisplay();
                this.updateCounter();
            }
        } catch (error) {
            console.error('Failed to load media:', error);
            this.showNoMediaMessage();
        }
    }

    updateDisplay() {
        const display = document.getElementById('media-display');
        
        if (this.media.length === 0) {
            this.showNoMediaMessage();
            return;
        }

        // Clear existing content
        display.innerHTML = '';
        
        // Create media elements
        this.media.forEach((item, index) => {
            const element = this.createMediaElement(item, index);
            display.appendChild(element);
        });

        // Show first item
        this.currentIndex = Math.min(this.currentIndex, this.media.length - 1);
        this.showSlide(this.currentIndex);
    }

    createMediaElement(item, index) {
        let element;
        
        if (item.type === 'image') {
            element = document.createElement('img');
            element.src = `${frameConfig.serverUrl}/files/${item.filename}`;
            element.alt = item.filename;
            element.className = 'media-item';
            
            // Handle image load errors
            element.onerror = () => {
                console.error('Failed to load image:', item.filename);
                element.style.display = 'none';
            };
            
        } else if (item.type === 'video') {
            element = document.createElement('video');
            element.src = `${frameConfig.serverUrl}/files/${item.filename}`;
            element.className = 'media-item';
            element.muted = true;
            element.loop = true;
            element.controls = false;
            
            // Handle video load errors
            element.onerror = () => {
                console.error('Failed to load video:', item.filename);
                element.style.display = 'none';
            };
            
        } else if (item.type === 'text') {
            element = document.createElement('div');
            element.className = 'media-item text-message';
            
            try {
                const textData = JSON.parse(item.content);
                element.textContent = textData.content;
                element.style.color = textData.color || '#ffffff';
                element.style.background = textData.background || '#000000';
                element.style.fontSize = (textData.fontSize || 36) + 'px';
            } catch (e) {
                // Fallback for plain text
                element.textContent = item.content;
                element.style.color = '#ffffff';
                element.style.background = '#000000';
                element.style.fontSize = '36px';
            }
        }

        element.dataset.index = index;
        return element;
    }

    showSlide(index) {
        const items = document.querySelectorAll('.media-item');
        
        // Hide all items
        items.forEach(item => {
            item.classList.remove('active');
            if (item.tagName === 'VIDEO') {
                item.pause();
            }
        });

        // Show current item
        if (items[index]) {
            items[index].classList.add('active');
            
            // Auto-play videos
            if (items[index].tagName === 'VIDEO') {
                items[index].play().catch(e => {
                    console.error('Failed to play video:', e);
                });
            }
        }

        this.updateCounter();
        this.updateProgressBar();
    }

    nextSlide() {
        if (this.media.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.media.length;
        this.showSlide(this.currentIndex);
        
        // Reset slideshow timer
        if (this.isPlaying) {
            this.resetSlideshow();
        }
    }

    previousSlide() {
        if (this.media.length === 0) return;
        
        this.currentIndex = this.currentIndex === 0 ? this.media.length - 1 : this.currentIndex - 1;
        this.showSlide(this.currentIndex);
        
        // Reset slideshow timer
        if (this.isPlaying) {
            this.resetSlideshow();
        }
    }

    togglePlayPause() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        
        if (this.isPlaying) {
            this.pauseSlideshow();
            playPauseBtn.textContent = '▶';
            playPauseBtn.title = 'Play';
        } else {
            this.startSlideshow();
            playPauseBtn.textContent = '⏸';
            playPauseBtn.title = 'Pause';
        }
    }

    startSlideshow() {
        if (this.media.length <= 1) return;
        
        this.isPlaying = true;
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }

    pauseSlideshow() {
        this.isPlaying = false;
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    resetSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        this.startSlideshow();
    }

    updateCounter() {
        const counter = document.getElementById('media-counter');
        if (this.media.length === 0) {
            counter.textContent = '0 / 0';
        } else {
            counter.textContent = `${this.currentIndex + 1} / ${this.media.length}`;
        }
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        if (!progressBar) {
            // Create progress bar if it doesn't exist
            const container = document.createElement('div');
            container.className = 'progress-bar';
            const fill = document.createElement('div');
            fill.className = 'progress-fill';
            container.appendChild(fill);
            document.querySelector('.frame-container').appendChild(container);
        }

        const fill = document.querySelector('.progress-fill');
        if (this.isPlaying && this.media.length > 1) {
            fill.style.transition = `width ${this.slideDuration}ms linear`;
            fill.style.width = '100%';
            
            // Reset for next slide
            setTimeout(() => {
                fill.style.transition = 'none';
                fill.style.width = '0%';
            }, this.slideDuration);
        } else {
            fill.style.width = '0%';
        }
    }

    showNoMediaMessage() {
        const display = document.getElementById('media-display');
        display.innerHTML = `
            <div class="no-media-message">
                <h2>📸 No Photos Yet</h2>
                <p>Your picture frame is ready and waiting for memories!</p>
                <div class="upload-instructions">
                    <p>To add photos, videos, or messages:</p>
                    <span class="upload-url">${frameConfig.serverUrl}/${frameConfig.frameId}</span>
                </div>
            </div>
        `;
        
        this.pauseSlideshow();
        this.updateCounter();
    }
}

// Initialize the picture frame when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PictureFrame();
});