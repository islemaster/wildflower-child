import _ from 'lodash';
import randomColor from 'randomcolor';
import * as SVG from './SVG';

export default class Flower {
  constructor(petalCount) {
    this.petalCount = petalCount;
    this.spin = 0;
    this.rpm = 0;
    this.dirty = true;

    this.gradient = SVG.create('linearGradient', {
      id: _.uniqueId(),
      x1: 0,
      x2: 0,
      y1: 1,
      y2: 0,
    });

    const baseColor = randomColor();
    const colors = _.shuffle([
      baseColor,
      randomColor({hue: baseColor}),
      Math.random() < 0.2 ? 'white' : randomColor({luminosity: 'dark'})
    ]);

    const firstStop = SVG.create('stop', {
      'offset': '0%',
      'stop-color': colors[0],
    });
    this.gradient.appendChild(firstStop);
    const middleStop = SVG.create('stop', {
      'offset': (30+Math.floor(60*Math.random()))+'%',
      'stop-color': colors[1],
    });
    this.gradient.appendChild(middleStop);
    const lastStop = SVG.create('stop', {
      'offset': '100%',
      'stop-color': colors[2],
    });
    this.gradient.appendChild(lastStop);
    SVG.addToDefs(this.gradient);

    const strokeColor = randomColor({hue: 'monochrome', luminosity: 'dark'});
    const strokeOpacity = 0.5;

    // Create elements
    this.root = SVG.create('g');
    this.petals = _.range(petalCount).map(i => {
      const petal = SVG.create('ellipse', {
        'fill': `url(#${this.gradient.id})`,
        'stroke': strokeColor,
        'stroke-opacity': strokeOpacity,
      });
      return petal;
    });
    // Push petals in a random order to mask z-order weirdness
    _.shuffle(this.petals).forEach(petal => this.root.appendChild(petal));

    this.petals.forEach((petal, i) => {
      petal.setAttribute('cx',0);
      petal.setAttribute('cy',-10);
      petal.setAttribute('rx', 2.5 + 2.5 * (8 / this.petalCount));
      petal.setAttribute('ry',10);
      petal.setAttribute('transform',`rotate(${(i * 360 / this.petalCount)})`);
    });

    const centerColor = _.sample([
      randomColor({hue: 'yellow'}),
      randomColor({hue: 'orange'}),
    ]);
    this.center = SVG.create('circle', {
      'cx': 0,
      'cy': 0,
      'r': 3 + 3 * Math.random(),
      'fill': centerColor,
      'stroke': strokeColor,
      'stroke-opacity': strokeOpacity,
    });
    this.root.appendChild(this.center);
    SVG.addToRoot(this.root);

  }

  render(deltaT) {
    if (this.rpm != 0) {
      const rpDeltaT = this.rpm * deltaT / 60000;
      this.spin = (this.spin + 360 * rpDeltaT) % 360;
      this.dirty = true;
    }

    this.root.setAttribute(`transform`,`translate(${this.x} ${this.y}) rotate(${this.spin})`);
  }
}
