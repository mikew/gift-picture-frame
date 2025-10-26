import "./index.css";

interface MediaItem {
  type: "image" | "video" | "text";
  filename: string;
  content: string;
}

declare global {
  const frameConfig: {
    frameId: string;
    serverUrl: string;
  };
}

declare global {
  interface Window {
    PICTURE_FRAME_CONFIG: {
      mode: "development" | "production";
    };
  }
}

const FRAME_SERVER_BASE =
  window.PICTURE_FRAME_CONFIG.mode === "development"
    ? "http://localhost:6376"
    : "";

class PictureFrame {
  media: MediaItem[] = [];
  currentIndex = 0;
  isPlaying = true;
  slideInterval: ReturnType<typeof setInterval> | null = null;
  slideDuration = 3_000;

  constructor() {
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
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const playPauseBtn = document.getElementById("play-pause-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.previousSlide());
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextSlide());
    }
    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    }

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.previousSlide();
          break;
        case "ArrowRight":
        case " ":
          this.nextSlide();
          break;
        case "p":
        case "P":
          this.togglePlayPause();
          break;
        case "r":
        case "R":
          this.loadMedia();
          break;
      }
    });

    // Touch/swipe controls
    let startX = 0;
    let startY = 0;

    document.addEventListener("touchstart", (e) => {
      startX = e.touches[0]?.clientX || 0;
      startY = e.touches[0]?.clientY || 0;
    });

    document.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0]?.clientX || 0;
      const endY = e.changedTouches[0]?.clientY || 0;
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
    let cursorTimeout: ReturnType<typeof setTimeout>;

    const showCursor = () => {
      document.body.style.cursor = "default";
      clearTimeout(cursorTimeout);
      cursorTimeout = setTimeout(() => {
        document.body.style.cursor = "none";
      }, 3000);
    };

    document.addEventListener("mousemove", showCursor);
    document.addEventListener("click", showCursor);

    // Initially hide cursor after 3 seconds
    cursorTimeout = setTimeout(() => {
      document.body.style.cursor = "none";
    }, 3000);
  }

  async loadMedia() {
    try {
      const response = await fetch(`${FRAME_SERVER_BASE}/api/media`);
      if (!response.ok) throw new Error("Failed to fetch media");

      const newMedia = await response.json();

      // Only update if media has changed
      if (JSON.stringify(newMedia) !== JSON.stringify(this.media)) {
        this.media = newMedia;
        this.updateDisplay();
        this.updateCounter();
      }
    } catch (error) {
      console.error("Failed to load media:", error);
      this.showNoMediaMessage();
    }
  }

  updateDisplay() {
    const display = document.getElementById("media-display");

    if (!display) {
      return;
    }

    if (this.media.length === 0) {
      this.showNoMediaMessage();
      return;
    }

    // Clear existing content
    display.innerHTML = "";

    // Create media elements
    this.media.forEach((item, index) => {
      const element = this.createMediaElement(item, index);
      if (element) {
        display.appendChild(element);
      }
    });

    // Show first item
    this.currentIndex = Math.min(this.currentIndex, this.media.length - 1);
    this.showSlide(this.currentIndex);
  }

  createMediaElement(item: MediaItem, index: number) {
    let createdElement: HTMLElement | undefined;

    if (item.type === "image") {
      const element = document.createElement("img");
      element.src = `${frameConfig.serverUrl}/files/${frameConfig.frameId}/${item.filename}`;
      element.alt = item.filename;
      element.className = "media-item";

      // Handle image load errors
      element.onerror = () => {
        console.error("Failed to load image:", item.filename);
        element.style.display = "none";
      };

      createdElement = element;
    } else if (item.type === "video") {
      const element = document.createElement("video");
      element.src = `${frameConfig.serverUrl}/files/${frameConfig.frameId}/${item.filename}`;
      element.className = "media-item";
      element.muted = true;
      element.loop = true;
      element.controls = false;

      // Handle video load errors
      element.onerror = () => {
        console.error("Failed to load video:", item.filename);
        element.style.display = "none";
      };

      createdElement = element;
    } else if (item.type === "text") {
      const element = document.createElement("div");
      element.className = "media-item text-message";

      try {
        const textData = JSON.parse(item.content);
        element.textContent = textData.content;
        element.style.color = textData.color || "#ffffff";
        element.style.background = textData.background || "#000000";
        element.style.fontSize = `${textData.fontSize || 36}px`;
      } catch (e) {
        // Fallback for plain text
        element.textContent = item.content;
        element.style.color = "#ffffff";
        element.style.background = "#000000";
        element.style.fontSize = "36px";
      }

      createdElement = element;
    }

    if (!createdElement) {
      throw new Error("Unsupported media type");
    }

    createdElement.dataset.index = String(index);
    return createdElement;
  }

  showSlide(index: number) {
    const items = document.querySelectorAll<HTMLVideoElement | HTMLElement>(
      ".media-item",
    );

    // Hide all items
    items.forEach((item) => {
      item.classList.remove("active");
      if (item instanceof HTMLVideoElement) {
        item.pause();
      }
    });

    // Show current item
    if (items[index]) {
      items[index].classList.add("active");

      // Auto-play videos
      if (items[index] instanceof HTMLVideoElement) {
        items[index].play().catch((e) => {
          console.error("Failed to play video:", e);
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

    this.currentIndex =
      this.currentIndex === 0 ? this.media.length - 1 : this.currentIndex - 1;
    this.showSlide(this.currentIndex);

    // Reset slideshow timer
    if (this.isPlaying) {
      this.resetSlideshow();
    }
  }

  togglePlayPause() {
    const playPauseBtn = document.getElementById("play-pause-btn");

    if (!playPauseBtn) {
      return;
    }

    if (this.isPlaying) {
      this.pauseSlideshow();
      playPauseBtn.textContent = "▶";
      playPauseBtn.title = "Play";
    } else {
      this.startSlideshow();
      playPauseBtn.textContent = "⏸";
      playPauseBtn.title = "Pause";
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
    const counter = document.getElementById("media-counter");

    if (!counter) {
      return;
    }

    if (this.media.length === 0) {
      counter.textContent = "0 / 0";
    } else {
      counter.textContent = `${this.currentIndex + 1} / ${this.media.length}`;
    }
  }

  updateProgressBar() {
    const progressBar = document.querySelector(".progress-fill");
    if (!progressBar) {
      // Create progress bar if it doesn't exist
      const container = document.createElement("div");
      container.className = "progress-bar";
      const fill = document.createElement("div");
      fill.className = "progress-fill";
      container.appendChild(fill);
      document.querySelector(".frame-container")?.appendChild(container);
    }

    const fill = document.querySelector<HTMLElement>(".progress-fill");
    if (!fill) {
      return;
    }

    if (this.isPlaying && this.media.length > 1) {
      fill.style.transition = `width ${this.slideDuration}ms linear`;
      fill.style.width = "100%";

      // Reset for next slide
      setTimeout(() => {
        fill.style.transition = "none";
        fill.style.width = "0%";
      }, this.slideDuration);
    } else {
      fill.style.width = "0%";
    }
  }

  showNoMediaMessage() {
    const display = document.getElementById("media-display");

    if (!display) {
      return;
    }

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
document.addEventListener("DOMContentLoaded", () => {
  new PictureFrame();
});
