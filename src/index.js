import _ from 'lodash';

function component({a, b}, ...args) {
  var element = document.createElement('div');
  element.innerHTML = _.join([a, b, ...args], ' ');
  return element;
}

function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
  document.body.appendChild(component({a: 'Hello', b: 'Webpack', c: 'skip'}));
}
document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
