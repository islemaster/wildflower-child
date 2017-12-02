import _ from 'lodash'
import randomColor from 'randomcolor';
import {shuffle} from 'shuffle-seed';

export default class Genome {
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
    return parseInt(this._genes.substr(startIndex, 2), 16);
  }

  geneNormal(startIndex) {
    return this.gene(startIndex) / 0xFF;
  }

  /**
   * @param {Array<Genome>} parentGenomes
   * @returns {Genome}
   */
  static mix(parentGenomes) {
    const parentStrings = parentGenomes.map(p => p._genes);
    return new Genome(
      _.range(Genome.LENGTH)
        .map(i => _.sample(parentStrings.map(p => p.substr(i, 1))))
        .join('')
    );
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
      30+Math.floor(50*this.geneNormal(10)),
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
