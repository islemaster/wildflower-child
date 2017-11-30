import _ from 'lodash';
import * as SVG from './SVG';

export default class Flower {
  constructor(petalCount) {

    // Create elements
    this.root = SVG.create('g');
    this.petals = _.range(petalCount).map(i => {
      const petal = SVG.create('ellipse');
      this.root.appendChild(petal);
      return petal;
    });
    this.center = SVG.create('circle');
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
      petal.setAttribute('fill','url(#Gradient2)');
      petal.setAttribute('transform',`rotate(${this.spin + (i * 360 / this.petalCount)})`);
    });

    this.center.setAttribute('cx',0);
    this.center.setAttribute('cy',0);
    this.center.setAttribute('r',5);
    this.center.setAttribute('fill','yellow');
  }
}
