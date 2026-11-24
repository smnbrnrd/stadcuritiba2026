/*
 * schemas/frame-window.js: frame annotation by the forcing window.
 * Kind: "frame-window". Shows the injection window (label 1), the aftermath
 * still perturbed but labelled 0, and the remaining normal frames.
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var svgEl = L.svgEl;
  var COLOR = L.COLOR;

  var T = 120;              // number of frames shown
  var LEFT = 70, RIGHT = 590;
  var STEP = (RIGHT - LEFT) / T;
  var FORCED = [40, 59];    // injection window, inclusive
  var AFTER = [60, 85];     // aftermath, labelled 0

  function x(t) { return LEFT + t * STEP; }

  function drawFrameWindow(svg) {
    var defs = svgEl('defs', {}, svg);
    var pattern = svgEl('pattern', {
      id: 'fw-hatch', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)'
    }, defs);
    svgEl('rect', { width: 6, height: 6, fill: '#ffffff' }, pattern);
    svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: COLOR.soft, 'stroke-width': 2 }, pattern);

    // Injection window
    svgEl('rect', {
      x: x(FORCED[0]), y: 46, width: (FORCED[1] - FORCED[0] + 1) * STEP, height: 100,
      fill: '#c0392b', 'fill-opacity': 0.18
    }, svg);
    // Aftermath, still perturbed
    svgEl('rect', {
      x: x(AFTER[0]), y: 46, width: (AFTER[1] - AFTER[0] + 1) * STEP, height: 100,
      fill: 'url(#fw-hatch)', 'fill-opacity': 0.6
    }, svg);

    // Label row: 1 during forcing, 0 elsewhere
    var t;
    for (t = 0; t < T; t++) {
      var isForced = t >= FORCED[0] && t <= FORCED[1];
      svgEl('rect', {
        x: x(t), y: 150, width: STEP - 0.6, height: 22,
        fill: isForced ? '#c0392b' : COLOR.pale
      }, svg);
    }

    function text(tx, ty, str, size, anchor, fill) {
      var el = svgEl('text', {
        x: tx, y: ty, 'font-size': size || 18, 'text-anchor': anchor || 'start',
        fill: fill || COLOR.dark, 'font-family': 'Helvetica, Arial, sans-serif'
      }, svg);
      el.textContent = str;
      return el;
    }

    text(x(FORCED[0]) + STEP / 2, 38, 'injection (label 1)', 18, 'middle', '#c0392b');
    text(x(AFTER[0]) + 20, 38, 'aftermath (label 0)', 18, 'start', COLOR.dark);
    text(10, 60, 'forcing', 18, 'start');
    text(10, 165, 'label', 18, 'start');
    text(LEFT, 196, '0', 16, 'middle');
    text(x(FORCED[0]), 196, String(FORCED[0]), 16, 'middle');
    text(x(FORCED[1] + 1), 196, String(FORCED[1] + 1), 16, 'middle');
    text(x(AFTER[1] + 1), 196, String(AFTER[1] + 1), 16, 'middle');
    text(RIGHT, 196, String(T), 16, 'end');
  }

  L.register('frame-window', { size: [600, 200], draw: drawFrameWindow });
})();
