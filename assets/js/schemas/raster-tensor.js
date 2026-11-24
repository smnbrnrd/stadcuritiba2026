/*
 * schemas/raster-tensor.js: a raster sample as a tensor (slide "Raster data is a multi-channel video").
 * Kind: "tensor". Time steps are stacks of C channel matrices, with one cell highlighted.
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var COLOR = L.COLOR;
  var svgEl = L.svgEl;

// Tensor: a raster sample as a sequence of stacks, one stack per time step.
// Each stack holds C matrices (one per channel) at the same time step.
// One cell (i, j) is highlighted through the stack; its C values are the column on the right.
function drawTensor(svg) {
  var COLS = 6;
  var ROWS = 4;
  var CELL = 22;
  var C = 4;          // number of channels drawn
  var OFF = 10;       // depth offset between two channel layers
  var MW = COLS * CELL;
  var MH = ROWS * CELL;
  var FY = 90;        // top of the front layer (channel 1)
  var FRAMES = [
    { x0: 50, shift: 0, sub: '1' },
    { x0: 250, shift: 0.6, sub: '2' },
    { x0: 450, shift: 1.4, sub: 'T' }
  ];

  // Value of cell (i, j) in a given layer, in [0, 1]
  function value(i, j, shift) {
    return 0.5 + 0.5 * Math.sin(0.9 * i + shift) * Math.cos(0.7 * j - shift * 0.5);
  }

  // Plain text
  function text(x, y, str, size, anchor, italic) {
    var t = svgEl('text', {
      x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'middle',
      fill: COLOR.dark, 'font-style': italic ? 'italic' : 'normal'
    }, svg);
    t.textContent = str;
    return t;
  }

  // Symbol with a subscript, e.g. X with 1 below
  function symbol(x, y, base, sub, size, anchor) {
    var t = svgEl('text', {
      x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'middle', fill: COLOR.dark
    }, svg);
    t.appendChild(document.createTextNode(base));
    var s = svgEl('tspan', { 'baseline-shift': 'sub', 'font-size': size * 0.7 }, t);
    s.textContent = sub;
    return t;
  }

  // Time steps: each one is a stack of C matrices (H × W cells each)
  FRAMES.forEach(function (f) {
    // Back layers first, so the front layer (channel 1) is drawn last
    for (var k = C - 1; k >= 0; k--) {
      var lx = f.x0 + k * OFF;
      var ly = FY - k * OFF;
      // White backing hides the layers behind
      svgEl('rect', { x: lx, y: ly, width: MW, height: MH, fill: '#ffffff' }, svg);
      for (var i = 0; i < COLS; i++) {
        for (var j = 0; j < ROWS; j++) {
          svgEl('rect', {
            x: lx + i * CELL, y: ly + j * CELL, width: CELL, height: CELL,
            fill: COLOR.accent,
            opacity: 0.12 + 0.8 * value(i, j, f.shift + 0.5 * k),
            stroke: COLOR.dark, 'stroke-width': 0.5
          }, svg);
        }
      }
      svgEl('rect', {
        x: lx, y: ly, width: MW, height: MH, fill: 'none',
        stroke: COLOR.dark, 'stroke-width': k === 0 ? 1.2 : 0.8
      }, svg);
    }
    // Time-step label under the front layer; the stack is centred on the depth offset
    symbol(f.x0 + (MW + (C - 1) * OFF) / 2, FY + MH + 26, 'X', f.sub, 16);
  });

  // Ellipsis between the second time step and the last one
  text(431, FY + MH / 2 + 8, '…', 22, 'middle', false);

  // Time axis under the stacks
  svgEl('line', { x1: 50, y1: 252, x2: 600, y2: 252, stroke: COLOR.dark, 'stroke-width': 1.2 }, svg);
  svgEl('polygon', { points: '610,252 597,246 597,258', fill: COLOR.dark }, svg);
  text(622, 257, 'time t', 15, 'start', true);

  // Dimensions of the first stack: W above it, H on its left
  var f0 = FRAMES[0];
  var yb = FY - (C - 1) * OFF - 10;
  svgEl('path', {
    d: 'M' + (f0.x0 + 3*OFF) + ' ' + (yb + 6) + ' V' + yb + ' H' + (f0.x0 + MW + 3*OFF) + ' V' + (yb + 6),
    fill: 'none', stroke: COLOR.dark, 'stroke-width': 1.2
  }, svg);
  text(f0.x0 + MW / 2 + 3*OFF, yb - 8, 'W', 16, 'middle', true);
  svgEl('path', {
    d: 'M' + (f0.x0 - 6) + ' ' + FY + ' H' + (f0.x0 - 12) + ' V' + (FY + MH) + ' H' + (f0.x0 - 6),
    fill: 'none', stroke: COLOR.dark, 'stroke-width': 1.2
  }, svg);
  text(f0.x0 - 22, FY + MH / 2 + 6, 'H', 16, 'middle', true);

  // Highlighted cell (i = 0, j = ROWS - 1) through every channel of the first stack
  var hi = 3;
  var hj = ROWS - 2;
  var fiber = [];
  for (var k2 = C - 1; k2 >= 0; k2--) {
    var cx = f0.x0 + k2 * OFF + hi * CELL + CELL / 2;
    var cy = FY - k2 * OFF + hj * CELL + CELL / 2;
    fiber.push([cx, cy]);
  }
  svgEl('polyline', {
    points: fiber.map(function (p) { return p.join(','); }).join(' '),
    fill: 'none', stroke: COLOR.warn, 'stroke-width': 1.8, 'stroke-dasharray': '4 3'
  }, svg);
  fiber.forEach(function (p) {
    svgEl('circle', { cx: p[0], cy: p[1], r: 3, fill: COLOR.warn }, svg);
  });
  svgEl('rect', {
    x: f0.x0 + hi * CELL, y: FY + hj * CELL, width: CELL, height: CELL,
    fill: 'none', stroke: COLOR.warn, 'stroke-width': 2.5
  }, svg);

  // Vector of C values for that cell, as a column
  var PX = 690;
  var values = [0.9, 0.35, 0.65, 0.2];
  var subs = ['1', '2', '3', 'C'];
  text(PX, 58, 'cell (i, j)', 15, 'start', false);
  // Bracket marking the C values
  var top = 74;
  var bottom = top + C * 30 - 4;
  svgEl('path', {
    d: 'M' + (PX - 8) + ' ' + top + ' H' + (PX - 14) + ' V' + bottom + ' H' + (PX - 8),
    fill: 'none', stroke: COLOR.dark, 'stroke-width': 1.2
  }, svg);
  text(PX - 22, (top + bottom) / 2 + 6, 'C', 16, 'middle', true);
  values.forEach(function (v, k3) {
    var y = top + k3 * 30;
    svgEl('rect', {
      x: PX, y: y, width: 26, height: 26,
      fill: COLOR.accent, opacity: 0.15 + 0.85 * v,
      stroke: COLOR.dark, 'stroke-width': 0.6
    }, svg);
    symbol(PX + 42, y + 18, 'c', subs[k3], 14, 'start');
  });
}

  L.register('tensor', { size: [800, 290], draw: drawTensor });
})();
