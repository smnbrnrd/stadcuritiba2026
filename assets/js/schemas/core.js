/*
 * schemas/core.js: shared base for the schematic illustrations.
 *
 * Each <div class="schema" data-schema="KIND"> is replaced by an inline SVG.
 * A slide file registers the drawer for its kind with LitisSchemas.register().
 * This file must be loaded first.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  // LITIS palette (theme variables), used by every schematic
var COLOR = {
  dark: '#16425b',    // palette color4: strong lines, text
  main: '#2f6690',    // palette color1: primary marks
  accent: '#3a7ca5',  // palette color2: secondary marks
  soft: '#778da9',    // palette color5: weak marks
  pale: '#d9dcd6',    // palette color3: grid
  frame: '#f8f9fa',   // card background
  warn: '#fd7e14'     // orange: the moving sample
};

// Create an SVG element, set its attributes, and attach it if a parent is given
function svgEl(tag, attrs, parent) {
  var node = document.createElementNS(NS, tag);
  Object.keys(attrs || {}).forEach(function (key) {
    node.setAttribute(key, attrs[key]);
  });
  if (parent) {
    parent.appendChild(node);
  }
  return node;
}

  // Render one host element with the drawer registered for its kind
  function renderHost(host, spec) {
    var svg = svgEl('svg', {
      viewBox: '0 0 ' + spec.size[0] + ' ' + spec.size[1],
      role: 'img',
      'aria-label': host.getAttribute('aria-label') || '',
      class: 'schema-svg'
    });
    spec.draw(svg);
    host.replaceChildren(svg);
  }

  // Register a drawer and render every existing host of that kind.
  // Scripts sit at the end of <body>, so the DOM is ready when this runs.
  function register(kind, spec) {
    document.querySelectorAll('.schema[data-schema="' + kind + '"]').forEach(function (host) {
      renderHost(host, spec);
    });
  }

  window.LitisSchemas = {
    COLOR: COLOR,
    svgEl: svgEl,
    register: register
  };
})();
