/*
 * schemas/data-types.js: the four data families (slide "Four families of spatio-temporal data").
 * Kinds: "event", "trajectory", "point", "raster". Each card shows a schematic of its family.
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var COLOR = L.COLOR;
  var svgEl = L.svgEl;
  var W = 240;
  var H = 180;

// Backdrop shared by the four card schemas: a space plane with a faint grid
function drawPlane(svg) {
  svgEl('rect', {
    x: 4, y: 4, width: W - 8, height: H - 8, rx: 8,
    fill: COLOR.frame, stroke: COLOR.pale, 'stroke-width': 1
  }, svg);
  for (var x = 24; x < W - 4; x += 24) {
    svgEl('line', { x1: x, y1: 4, x2: x, y2: H - 4, stroke: COLOR.pale, 'stroke-width': 0.6 }, svg);
  }
  for (var y = 24; y < H - 4; y += 24) {
    svgEl('line', { x1: 4, y1: y, x2: W - 4, y2: y, stroke: COLOR.pale, 'stroke-width': 0.6 }, svg);
  }
}

// Event: discrete occurrences, each a point in space that happens at one instant
function drawEvent(svg) {
  drawPlane(svg);
  var events = [
    [52, 60, 5], [118, 40, 3.5], [172, 92, 6],
    [84, 126, 4], [196, 146, 3], [138, 150, 4.5]
  ];
  events.forEach(function (e) {
    // Dashed halo: the event's spatial extent, shown only as a visual cue
    svgEl('circle', {
      cx: e[0], cy: e[1], r: e[2] * 2.6, fill: 'none',
      stroke: COLOR.accent, 'stroke-width': 1, 'stroke-dasharray': '2 2', opacity: 0.7
    }, svg);
    svgEl('circle', { cx: e[0], cy: e[1], r: e[2], fill: COLOR.main }, svg);
  });
}

// Trajectory: a path traced by a moving body, with samples taken at regular times
function drawTrajectory(svg) {
  drawPlane(svg);
  var path = [
    [24, 152], [62, 138], [96, 96], [128, 70],
    [164, 84], [190, 126], [218, 42]
  ];
  var points = path.map(function (p) { return p.join(','); }).join(' ');
  svgEl('polyline', {
    points: points, fill: 'none', stroke: COLOR.main, 'stroke-width': 2.5,
    'stroke-linejoin': 'round', 'stroke-linecap': 'round'
  }, svg);
  path.forEach(function (p, i) {
    var last = i === path.length - 1;
    svgEl('circle', {
      cx: p[0], cy: p[1], r: last ? 5 : 3,
      fill: last ? COLOR.warn : COLOR.accent
    }, svg);
  });
}

// Point reference: a continuous field (soft background) sampled by moving stations
function drawPoint(svg) {
  drawPlane(svg);
  // Field: overlapping soft blobs, so the value varies smoothly in space
  var blobs = [
    [70, 70, 58, 0.16], [170, 110, 66, 0.14], [120, 150, 44, 0.12]
  ];
  blobs.forEach(function (b) {
    svgEl('circle', { cx: b[0], cy: b[1], r: b[2], fill: COLOR.soft, opacity: b[3] }, svg);
  });
  // Stations: diamonds, each with a dashed arrow showing its motion
  var stations = [
    { x: 48, y: 110, dx: 26, dy: -14 },
    { x: 136, y: 58, dx: 30, dy: 10 },
    { x: 186, y: 140, dx: -26, dy: -18 }
  ];
  stations.forEach(function (s) {
    svgEl('line', {
      x1: s.x, y1: s.y, x2: s.x + s.dx, y2: s.y + s.dy,
      stroke: COLOR.dark, 'stroke-width': 1.2, 'stroke-dasharray': '3 2'
    }, svg);
    var size = 6;
    var d = [
      (s.x) + ',' + (s.y - size),
      (s.x + size) + ',' + s.y,
      s.x + ',' + (s.y + size),
      (s.x - size) + ',' + s.y
    ].join(' ');
    svgEl('polygon', { points: d, fill: COLOR.dark }, svg);
  });
}

// Raster: a field on a fixed grid, shown at several regular times as stacked layers
function drawRaster(svg) {
  var cols = 8;
  var rows = 5;
  var cell = 18;
  var originX = 30;
  var originY = 66;

  // Value of cell (i, j) at a given time offset, in [0, 1]
  function value(i, j, shift) {
    return 0.5 + 0.5 * Math.sin(0.9 * i + shift) * Math.cos(0.7 * j - shift * 0.5);
  }

  // Back layers first (earlier and later times), then the front layer
  var layers = [
    { dx: 18, dy: -16, shift: 1.6, opacity: 0.22 },
    { dx: 9, dy: -8, shift: 0.8, opacity: 0.4 },
    { dx: 0, dy: 0, shift: 0, opacity: 1 }
  ];
  layers.forEach(function (layer) {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        svgEl('rect', {
          x: originX + layer.dx + i * cell,
          y: originY + layer.dy + j * cell,
          width: cell, height: cell,
          fill: COLOR.accent,
          opacity: layer.opacity * (0.15 + 0.85 * value(i, j, layer.shift)),
          stroke: COLOR.dark,
          'stroke-width': layer.opacity === 1 ? 0.6 : 0.3
        }, svg);
      }
    }
  });
}

  L.register('event', { size: [W, H], draw: drawEvent });
  L.register('trajectory', { size: [W, H], draw: drawTrajectory });
  L.register('point', { size: [W, H], draw: drawPoint });
  L.register('raster', { size: [W, H], draw: drawRaster });
})();
