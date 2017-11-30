let SVG_NS;
let _root, _defs, _pt;

export function init(root) {
  _root = root;
  _defs = _root.querySelector('defs');
  SVG_NS = _root.namespaceURI;
  // SVG point reused for matrix computations
  _pt = _root.createSVGPoint();
}

export function create(tagName, attributes = {}) {
  const el = document.createElementNS(SVG_NS, tagName);
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  return el;
}

export function getRoot() {
  return _root;
}

export function addToRoot(element) {
  _root.appendChild(element);
}

export function addToDefs(element) {
  _defs.appendChild(element);
}

export function getSVGMousePosition(event) {
  _pt.x = event.clientX;
  _pt.y = event.clientY;
  return _pt.matrixTransform(_root.getScreenCTM().inverse());
}
