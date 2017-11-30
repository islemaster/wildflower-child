import _ from 'lodash';

let root;
let svgNS;

const camera = {
  center: [0, 0],
  radius: 100,
  dirty: true,
};

const entities = [];

function component({a, b}, ...args) {
  var element = document.createElement('div');
  element.innerHTML = _.join([a, b, ...args], ' ');
  return element;
}

function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

  root = document.getElementById('svg-root');
  svgNS = root.namespaceURI;

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
    flower.rpm = -20 + Math.random() * 40;
    entities.push(flower);
  }

  // Start the render loop
  window.requestAnimationFrame(render);
}

let lastRender = performance.now();
function render(timestamp) {
  const dt = timestamp - lastRender;
  lastRender = timestamp;
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].dirty) {
      entities[i].dirty = false;
      entities[i].render(dt);
    }
  }

  if (camera.dirty) {
    camera.dirty = false;
    let x, y, w, h, ratio;
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
  requestAnimationFrame(render)
}

class Flower {
  constructor(petalCount) {

    // Create elements
    this.root = document.createElementNS(svgNS, 'g');
    this.petals = _.range(petalCount).map(i => {
      const petal = document.createElementNS(svgNS, 'ellipse');
      this.root.appendChild(petal);
      return petal;
    });
    this.center = document.createElementNS(svgNS, 'circle');
    this.root.appendChild(this.center);
    root.appendChild(this.root);

    this.petalCount = petalCount;
    this.spin = 0;
    this.rpm = 0;

    this.dirty = true;
  }

  render(deltaT) {
    if (this.rpm != 0) {
      const rpDeltaT = this.rpm * deltaT / 60000;
      this.spin = (this.spin + 360 * rpDeltaT) % 360;
      this.dirty = true;
    }

    this.root.setAttribute(`transform`,`translate(${this.x} ${this.y})`);

    this.petals.forEach((petal, i) => {
      petal.setAttribute('cx',0);
      petal.setAttribute('cy',-10);
      petal.setAttribute('rx', 2.5 + 2.5 * (8 / this.petalCount));
      petal.setAttribute('ry',10);
      petal.setAttribute('fill','url(#Gradient2)');
      petal.setAttribute('transform',`rotate(${this.spin + (i * 360 / this.petalCount)})`);
    });

    this.center.setAttribute('cx',0);
    this.center.setAttribute('cy',0);
    this.center.setAttribute('r',5);
    this.center.setAttribute('fill','yellow');
  }
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
