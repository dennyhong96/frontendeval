import { KITTENS, PUPPIES } from "./constant";
import "./styles.css";

/*
 * https://frontendeval.com/questions/scrolling-tiles
 *
 * Create infinitely scrolling rows of puppies and kittens
 */

class Slider {
  constructor(
    container,
    { images, scrollSpeed = 20, itemWidth = 150, itemHeight = 100, onSelect }
  ) {
    // state
    this.data = {
      images,
      scrollSpeed,
      scrolled: 0,
      itemWidth,
      itemHeight,
      nextLoopLeftStart: 0,
      isPaused: false,
      isHovered: false
    };
    this.onSelect = onSelect;

    // intersection observer
    this.buildObserver();

    // el
    this.$root = container;
    this.buildSlider();
    this.$track = document.createElement("ul");
    this.$prevImages = [];
    this.buildItems();

    // render
    this.render();

    // animation loop
    this.run();
  }

  buildObserver() {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.target.matches('[data-pos="start"]')) {
            if (entry.boundingClientRect.width !== 0 && !entry.isIntersecting) {
              [...this.$prevImages].forEach((prevImage) => prevImage.remove());
              this.$prevImages = [];
              observer.unobserve(entry.target);
            }
          } else if (entry.target.matches('[data-pos="end"]')) {
            if (entry.boundingClientRect.width !== 0 && entry.isIntersecting) {
              this.$prevImages = this.$images;
              this.buildItems();
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { root: this.$slider, rootMargin: "0px", threshold: 1.0 }
    );
  }

  buildSlider() {
    const { itemWidth, itemHeight } = this.data;
    const slider = document.createElement("div");
    slider.classList.add("slider");
    this.$slider = slider;
    this.$slider.style.setProperty("--item-width", `${itemWidth}px`);
    this.$slider.style.setProperty("--item-height", `${itemHeight}px`);
    this.$slider.addEventListener("mouseenter", (evt) => {
      this.isHover = true;
    });
    this.$slider.addEventListener("mouseleave", (evt) => {
      this.isHover = false;
    });
    this.$slider.addEventListener("click", (evt) => {
      if (evt.target.closest("[data-slide-item]")) {
        const item = evt.target.closest("[data-slide-item]");
        const index = Number(item.dataset.slideItem);
        this.onSelect?.({ src: this.data.images[index] });
      }
    });
  }

  buildItems() {
    const { images, itemWidth, nextLoopLeftStart } = this.data;
    this.$images = images.map((src, i) => {
      const item = document.createElement("li");
      item.style.setProperty(
        "--left",
        `${nextLoopLeftStart + i * itemWidth}px`
      );
      const button = document.createElement("button");
      const img = document.createElement("img");
      img.src = src;
      button.append(img);
      item.append(button);
      item.dataset.slideItem = i;
      if (i === 0) item.dataset.pos = "start";
      if (i === images.length - 1) item.dataset.pos = "end";
      if (i === 0 || i === images.length - 1) {
        this.observer.observe(item);
      }
      return item;
    });
    this.data.nextLoopLeftStart += images.length * itemWidth;
    this.$track.append(...this.$images);
  }

  pause() {
    this.data.isPaused = true;
  }

  continue() {
    this.data.isPaused = false;
  }

  render() {
    this.$slider.append(this.$track);
    this.$root.append(this.$slider);
  }

  run() {
    requestAnimationFrame(() => {
      const { isPaused, scrollSpeed } = this.data;
      if (!isPaused) {
        const speed = this.isHover ? scrollSpeed / 60 / 2 : scrollSpeed / 60;
        this.data.scrolled -= speed;
        this.$track.style.transform = `translate(${this.data.scrolled}px,0)`;
      }
      this.run();
    });
  }
}

class App {
  constructor(container) {
    // state
    this.data = {
      selected: null,
      isPaused: false
    };

    // el
    this.$root = container;
    this.buildPauseButton();
    this.$pupContainer = document.createElement("div");
    this.$kitContainer = document.createElement("div");
    this.$highlight = document.createElement("div");
    this.$highlight.classList.add("highlight");

    this.buildSliders();
    this.render();
  }

  buildPauseButton() {
    const button = document.createElement("button");
    button.classList.add("pause");
    button.textContent = "Paws";
    button.addEventListener("click", this.togglePause.bind(this));
    this.$pauseButton = button;
  }

  handleSelect({ src }) {
    this.$highlight.innerHTML = "";
    const img = document.createElement("img");
    img.src = src;
    this.$highlight.append(img);
  }

  togglePause(evt) {
    const { isPaused } = this.data;
    if (!isPaused) {
      this.data.isPaused = true;
      this.pupSlider.pause();
      this.kitSlider.pause();
      evt.currentTarget.textContent = "Play";
    } else {
      this.data.isPaused = false;
      this.pupSlider.continue();
      this.kitSlider.continue();
      evt.currentTarget.textContent = "Paws";
    }
  }

  buildSliders() {
    this.pupSlider = new Slider(this.$pupContainer, {
      images: PUPPIES,
      scrollSpeed: 60,
      onSelect: this.handleSelect.bind(this)
    });
    this.kitSlider = new Slider(this.$kitContainer, {
      images: KITTENS,
      scrollSpeed: 40,
      onSelect: this.handleSelect.bind(this)
    });
  }

  render() {
    this.$root.append(
      this.$pauseButton,
      this.$pupContainer,
      this.$kitContainer,
      this.$highlight
    );
  }
}
new App(document.getElementById("app"));
