let SVG_NS;
let _root, _defs;

export function init(root) {
  _root = root;
  _defs = _root.querySelector('defs');
  SVG_NS = _root.namespaceURI;
}

export function create(tagName) {
  return document.createElementNS(SVG_NS, tagName);
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