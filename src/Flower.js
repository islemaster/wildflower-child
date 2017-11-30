import _ from 'lodash';
import randomColor from 'randomcolor';
import * as SVG from './SVG';

export default class Flower {
  constructor(petalCount) {
    this.gradient = SVG.create('linearGradient');
    this.gradient.setAttribute('id', _.uniqueId());
    this.gradient.setAttribute('x1', 0);
    this.gradient.setAttribute('x2', 0);
    this.gradient.setAttribute('y1', 1);
    this.gradient.setAttribute('y2', 0);

    const baseColor = randomColor();
    const colors = _.shuffle([
      baseColor,
      randomColor({hue: baseColor}),
      Math.random() < 0.2 ? 'white' : randomColor({luminosity: 'dark'})
    ]);

    const firstStop = SVG.create('stop');
    firstStop.setAttribute('offset', '0%');
    firstStop.setAttribute('stop-color', colors[0]);
    this.gradient.appendChild(firstStop);
    const middleStop = SVG.create('stop');
    middleStop.setAttribute('offset', (30+Math.floor(60*Math.random()))+'%');
    middleStop.setAttribute('stop-color', colors[1]);
    this.gradient.appendChild(middleStop);
    const lastStop = SVG.create('stop');
    lastStop.setAttribute('offset', '100%');
    lastStop.setAttribute('stop-color', colors[2]);
    this.gradient.appendChild(lastStop);
    SVG.addToDefs(this.gradient);

    const strokeColor = randomColor({hue: 'monochrome', luminosity: 'dark'});
    const strokeOpacity = 0.5;

    // Create elements
    this.root = SVG.create('g');
    this.petals = _.range(petalCount).map(i => {
      const petal = SVG.create('ellipse');
      petal.setAttribute('fill', `url(#${this.gradient.id})`);
      petal.setAttribute('stroke', strokeColor);
      petal.setAttribute('stroke-opacity', strokeOpacity);
      return petal;
    });
    _.shuffle(this.petals).forEach(petal => this.root.appendChild(petal));
    this.center = SVG.create('circle');
    this.center.setAttribute('fill', randomColor({hue: 'yellow'}));
    this.center.setAttribute('stroke', strokeColor);
    this.center.setAttribute('stroke-opacity', strokeOpacity);
    this.root.appendChild(this.center);
    SVG.addToRoot(this.root);


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
      petal.setAttribute('transform',`rotate(${this.spin + (i * 360 / this.petalCount)})`);
    });

    this.center.setAttribute('cx',0);
    this.center.setAttribute('cy',0);
    this.center.setAttribute('r',5);
  }
}
