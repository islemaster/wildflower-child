import * as SVG from './SVG';
import Board, {DIRECTIONS, scale} from './Board';
import Camera from './Camera';
import Flower, {Genome} from './Flower';

const entities = [];
let board = null;

function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

  SVG.init(document.getElementById('svg-root'));

  entities.push(new Camera());

  board = new Board();
  entities.push(board);

  // Fill the board
  // let lastGenome = new Genome();
  // board.forEachCell(({x, y, z}) => {
  //   const flower = new Flower(new Genome().mix(lastGenome));
  //   lastGenome = flower.genome;
  //   const center = board.center({x, y, z});
  //   flower.x = center.x;
  //   flower.y = center.y;
  //   entities.push(flower);
  // });

  // Flowers in board corners
  for (let i = 0; i < 6; i++) {
    const cell = scale(DIRECTIONS[i], board.radius).toJS();
    const flower = new Flower();
    board.set(cell, flower);
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
