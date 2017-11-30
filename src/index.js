import _ from 'lodash';
import * as SVG from './SVG';
import Flower from './Flower';

const camera = {
  center: [0, 0],
  radius: 100,
  dirty: true,
};

const entities = [];

function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

  SVG.init(document.getElementById('svg-root'));

  // Listen for window resize events to to trigger a camera update
  window.addEventListener('resize', () => {
    camera.dirty = true;
  });

  const flowerCount = 25;
  for (let i = 0; i < flowerCount; i++) {
    const petalCount = 3 + Math.floor(25 * Math.random());
    const flower = new Flower(petalCount);
    flower.x = -80 + (i % 5) * (200 / 5);
    flower.y = -80 + Math.floor(i / 5) * (200 / 5);
    flower.rpm = Math.round(-20 + Math.random() * 40);
    entities.push(flower);
  }

  // Start the render loop
  window.requestAnimationFrame(render);
}

let lastRender = performance.now();
const MAX_FPS = 40;
function render(timestamp) {
  requestAnimationFrame(render);
  const dt = timestamp - lastRender;

  // Limit frame rate
  if (dt < 1000 / MAX_FPS) return;

  for (var i = 0; i < entities.length; i++) {
    if (entities[i].dirty) {
      entities[i].dirty = false;
      entities[i].render(dt);
    }
  }

  if (camera.dirty) {
    camera.dirty = false;
    let x, y, w, h, ratio;
    const root = SVG.getRoot();
    const viewportRect = root.getBoundingClientRect();
    if (viewportRect.width > viewportRect.height) {
      ratio = viewportRect.width / viewportRect.height;
      w = camera.radius * 2 * ratio;
      h = camera.radius * 2;
    } else {
      ratio = viewportRect.height / viewportRect.width;
      w = camera.radius * 2;
      h = camera.radius * 2 * ratio;
    }
    x = camera.center[0] - w / 2;
    y = camera.center[1] - h / 2;
    root.setAttribute('viewBox', [x, y, w, h].join(' '))
  }

  lastRender = timestamp;
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
