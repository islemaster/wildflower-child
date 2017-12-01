import {Map} from 'immutable';

const SQRT3 = Math.sqrt(3);
const HEX_SIDE = 23;
const HEX_WIDTH = HEX_SIDE * 2;
const HEX_HEIGHT = SQRT3 / 2 * HEX_WIDTH;
const CENTER = Map({x: 0, y: 0, z: 0});
const DIRECTIONS = [
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
   *
   * @param radius where 1 is a single cell, 2 is a baord 3 cells across,
   *   3 is a board 5 cells across, etc.
   */
  constructor(radius = 3) {
    this._radius = radius;
    this._cells = Map();
  }

  get({x, y, z}) {
    return this._cells.get(Map({x, y, z}));
  }

  set({x, y, z}, newValue) {
    this._cells = this._cells.set(Map({x, y, z}), newValue);
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

  forEachCell(callback) {
    cubeSpiral(CENTER, this._radius).forEach(cell => callback(cell.toJS()));
  }
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

function scale(a, s) {
  return Map({
    x: a.get('x') * s,
    y: a.get('y') * s,
    z: a.get('z') * s
  });
}
