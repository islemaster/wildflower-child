import {Map} from 'immutable';
import Flower from './Flower';
import * as SVG from './SVG';

const SQRT3 = Math.sqrt(3);
const HEX_SIDE = 23;
const HEX_WIDTH = HEX_SIDE * 2;
const HEX_HEIGHT = SQRT3 / 2 * HEX_WIDTH;
const CENTER = Map({x: 0, y: 0, z: 0});
export const DIRECTIONS = [
  Map({x: 1, y: -1, z: 0}),
  Map({x: 1, y: 0, z: -1}),
  Map({x: 0, y: 1, z: -1}),
  Map({x: -1, y: 1, z: 0}),
  Map({x: -1, y: 0, z: 1}),
  Map({x: 0, y: -1, z: 1}),
];

/**
 * Flat-top hex board using cube coordinates.
 * @see https://www.redblobgames.com/grids/hexagons/
 */
export default class Board {
  /**
   * @param radius where 1 is a single cell, 2 is a baord 3 cells across,
   *   3 is a board 5 cells across, etc.
   */
  constructor(radius = 3) {
    this.radius = radius;
    this._cells = Map();

    // Outline the play area
    this.root = SVG.create('g');
    const corners = DIRECTIONS.map(d => this.center(scale(d, this.radius).toJS()));
    for (let i = 0; i < corners.length; i++) {
      this.root.appendChild(SVG.create('line', {
        x1: corners[i].x,
        y1: corners[i].y,
        x2: corners[(i+1) % corners.length].x,
        y2: corners[(i+1) % corners.length].y,
        stroke: 'black',
        'stroke-opacity': 0.1,
      }));
    }
    SVG.addToRoot(this.root);
  }

  get({x, y, z}) {
    return this._cells.get(Map({x, y, z}));
  }

  set({x, y, z}, newValue) {
    if (newValue instanceof Flower) {
      const oldPosition = this._cells.keyOf(newValue);
      if (oldPosition) {
        this._cells = this._cells.delete(oldPosition);
      }
      newValue.setCell(this, {x, y, z});
    }
    this._cells = this._cells.set(Map({x, y, z}), newValue);
  }

  isInBounds({x, y, z}) {
    return Math.abs(x) <= this.radius &&
      Math.abs(y) <= this.radius &&
      Math.abs(z) <= this.radius;
  }

  /**
   * Given cube coordinates, give center of cell in SVG-space
   */
  center({x, z}) {
    return {
      x: (x * HEX_WIDTH * 3/4),
      y: (z * HEX_HEIGHT) + (x * HEX_HEIGHT / 2)
    };
  }

  cellFromPoint({x, y}) {
    const q = x * 2/3 / HEX_SIDE;
    const r = (-x / 3 + SQRT3/3 * y) / HEX_SIDE;

    return round(axialToCube({q, r}))
  }

  forEachCell(callback) {
    cubeSpiral(CENTER, this._radius).forEach(cell => callback(cell.toJS()));
  }
}

function round({x, y, z}) {
  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  const dX = Math.abs(rx - x);
  const dY = Math.abs(ry - y);
  const dZ = Math.abs(rz - z);

  if (dX > dY && dX > dZ) {
    rx = -ry-rz;
  } else if (dY > dZ) {
    ry = -rx-rz;
  } else {
    rz = -rx-ry;
  }

  return {x: rx, y: ry, z: rz};
}

function cubeToAxial({x, y, z}) {
  return {
    q: x,
    r: z
  };
}

function axialToCube({q, r}) {
  return {
    x: q,
    y: -q - r,
    z: r
  }
}

function cubeRing(center, radius) {
  const results = [];
  let nextCell = add(center, scale(DIRECTIONS[4], radius));
  for (let side = 0; side < 6; side++) {
    for (let step = 0; step < radius; step++) {
      results.push(nextCell);
      nextCell = add(nextCell, DIRECTIONS[side]);
    }
  }
  return results;
}

function cubeSpiral(center, radius) {
  console.log(`cubeSpiral`, center, radius);
  let results = [center];
  for (let r = 1; r <= radius; r++) {
    results = results.concat(cubeRing(center, r));
  }
  console.log('cubeSpiral results', results);
  return results;
}

function add(a, b) {
  return Map({
    x: a.get('x') + b.get('x'),
    y: a.get('y') + b.get('y'),
    z: a.get('z') + b.get('z')
  });
}

export function scale(a, s) {
  return Map({
    x: a.get('x') * s,
    y: a.get('y') * s,
    z: a.get('z') * s
  });
}
