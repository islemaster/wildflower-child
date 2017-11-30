import _ from 'lodash';
import randomColor from 'randomcolor';
import {shuffle} from 'shuffle-seed';
import * as SVG from './SVG';

class Genome {
  // A flower genome is a series of 0-255 values stored as a two-character
  // hex string, which each represent a 0-1 range used in place of a
  // Math.random() call, or in some cases, passed as a integer to randomColor.
  constructor(genomeString = '') {
    this._genes = genomeString;
    if (this._genes.length < Genome.LENGTH) {
      this._genes +=
        _.range(Genome.LENGTH - this._genes.length)
        .map(() => Math.floor(16 * Math.random()).toString(16))
        .join('');
    }
  }

  gene(startIndex) {
    return parseInt(this._genes.slice(startIndex, startIndex+2), 16);
  }

  geneNormal(startIndex) {
    return this.gene(startIndex) / 0xFF;
  }

  // Genes 0-1
  petalCount() {
    return 3 + Math.floor(25 * this.geneNormal(0));
  }

  // Genes 2-9
  petalColors() {
    return shuffle(
      [
        this.baseColor(),
        this.secondaryColor(),
        this.tertiaryColor(),
      ],
      this.gene(2)
    );
  }

  baseColor() {
    return randomColor({seed: this.gene(4)});
  }

  secondaryColor() {
    return randomColor({seed: this.gene(6), hue: this.baseColor()})
  }

  tertiaryColor() {
    const gene = this.gene(8);
    if (gene < 0x40) {
      return 'white';
    } else {
      return randomColor({seed: gene, luminosity: 'dark'});
    }
  }

  // Genes 10-11
  petalGradientStops() {
    return [
      0,
      30+Math.floor(60*this.geneNormal(10)),
      100
    ];
  }

  // Genes 12-13
  centerSize() {
    return 3 + 3 * this.geneNormal(12);
  }

  // Genes 14-15
  centerColor() {
    const gene = this.gene(14);
    return gene < 0x7F ?
      randomColor({seed: gene, hue: 'yellow'}) :
      randomColor({seed: gene, hue: 'orange'});
  }

}
Genome.LENGTH = 16;

export default class Flower {
  constructor(genome = new Genome()) {
    this.dirty = true;
    this.genome = genome;
    this.petalCount = genome.petalCount();
    this.spin = 0;
    this.rpm = 0;

    this.gradient = SVG.create('linearGradient', {
      id: _.uniqueId(),
      x1: 0,
      x2: 0,
      y1: 1,
      y2: 0,
    });
    const colors = genome.petalColors();
    const gradientStops = genome.petalGradientStops();
    for (let i = 0; i < colors.length; i++) {
      const stop = SVG.create('stop', {
        'offset': gradientStops[i] + '%',
        'stop-color': colors[i],
      });
      this.gradient.appendChild(stop);
    }
    SVG.addToDefs(this.gradient);

    const strokeColor = '#420';
    const strokeOpacity = 0.4;

    // Create elements
    this.root = SVG.create('g');
    this.petals = _.range(this.petalCount).map(i => {
      const petal = SVG.create('ellipse', {
        'fill': `url(#${this.gradient.id})`,
        'stroke': strokeColor,
        'stroke-opacity': strokeOpacity,
      });
      return petal;
    });
    // Push petals in a deterministic skip-order because it z-orders better.
    const petalOrderingSkip = this.petals.length < 12 ? 2 : 3;
    for (let i = 0; i < petalOrderingSkip; i++) {
      for (let j = i; j < this.petals.length; j += petalOrderingSkip) {
        this.root.appendChild(this.petals[j]);
      }
    }

    this.petals.forEach((petal, i) => {
      petal.setAttribute('cx',0);
      petal.setAttribute('cy',-10);
      petal.setAttribute('rx', 2.5 + 2.5 * (8 / this.petalCount));
      petal.setAttribute('ry',10);
      petal.setAttribute('transform',`rotate(${(i * 360 / this.petalCount)})`);
    });

    this.center = SVG.create('circle', {
      'cx': 0,
      'cy': 0,
      'r': genome.centerSize(),
      'fill': genome.centerColor(),
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
