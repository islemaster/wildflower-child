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

  for (var i = 0; i < 20; i++) {
    const flower = new Flower();
    flower.x = -100 + Math.random() * 200;
    flower.y = -100 + Math.random() * 200;
    entities.push(flower);
  }

  // Start the render loop
  window.requestAnimationFrame(render);
}

function render(timestamp) {
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].dirty) {
      entities[i].dirty = false;
      entities[i].render();
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
  constructor() {

    // Create elements
    this.root = document.createElementNS(svgNS, 'g');
    this.petals = _.range(5).map(i => {
      const petal = document.createElementNS(svgNS, 'ellipse');
      this.root.appendChild(petal);
      return petal;
    });
    this.center = document.createElementNS(svgNS, 'circle');
    this.root.appendChild(this.center);
    root.appendChild(this.root);

    this.spin = 0;

    this.dirty = true;
  }

  render() {
    this.spin = (this.spin + 10) % 360;

    this.root.setAttribute(`transform`,`translate(${this.x} ${this.y})`);

    this.petals.forEach((petal, i) => {
      petal.setAttribute('cx',0);
      petal.setAttribute('cy',-10);
      petal.setAttribute('rx',5);
      petal.setAttribute('ry',10);
      petal.setAttribute('fill','red');
      petal.setAttribute('transform',`rotate(${this.spin + (i * 360 / 5)})`);
    });

    this.center.setAttribute('cx',0);
    this.center.setAttribute('cy',0);
    this.center.setAttribute('r',5);
    this.center.setAttribute('fill','yellow');
    this.dirty = true;
  }
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
