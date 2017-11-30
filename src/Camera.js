import * as SVG from './SVG';

export default class Camera {
  constructor() {
    this.center = [0, 0];
    this.radius = 100;
    this.dirty = true;

    // Listen for window resize events to to trigger a camera update
    window.addEventListener('resize', _.throttle(() => {
      this.dirty = true;
    }, 1000 / 20));
  }

  render() {
    let x, y, w, h, ratio;
    const root = SVG.getRoot();
    const viewportRect = root.getBoundingClientRect();
    if (viewportRect.width > viewportRect.height) {
      ratio = viewportRect.width / viewportRect.height;
      w = this.radius * 2 * ratio;
      h = this.radius * 2;
    } else {
      ratio = viewportRect.height / viewportRect.width;
      w = this.radius * 2;
      h = this.radius * 2 * ratio;
    }
    x = this.center[0] - w / 2;
    y = this.center[1] - h / 2;
    root.setAttribute('viewBox', [x, y, w, h].join(' '))
  }
}