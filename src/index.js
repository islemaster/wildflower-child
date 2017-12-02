import Board from './Board';
import Camera from './Camera';
import * as SVG from './SVG';

const entities = [];
let board = null;

function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

  SVG.init(document.getElementById('svg-root'));

  entities.push(new Camera());

  board = new Board();
  entities.push(board);

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
