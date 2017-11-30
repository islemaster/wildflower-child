import _ from 'lodash';
import * as SVG from './SVG';
import Camera from './Camera';
import Flower from './Flower';

const entities = [];

function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

  SVG.init(document.getElementById('svg-root'));

  entities.push(new Camera());

  const flowerCount = 25;
  for (let i = 0; i < flowerCount; i++) {
    const flower = new Flower();
    flower.x = -80 + (i % 5) * (200 / 5);
    flower.y = -80 + Math.floor(i / 5) * (200 / 5);
    flower.rpm = Math.round(-20 + Math.random() * 40);
    entities.push(flower);
  }

  // Copy the genome of the first flower, and make a copy
  for (var i = 0; i < 5; i++) {
    const copiedFlower = new Flower(entities[1+5*i].genome);
    copiedFlower.x = -120;
    copiedFlower.y = -80 + i * (200 / 5);
    entities.push(copiedFlower);
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

  lastRender = timestamp;
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
