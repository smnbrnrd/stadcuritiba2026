/*
 * schemas/frame-pixel-labels.js: frame and pixel states of one NS run.
 * Kind: "frame-pixel-labels". Reproduces slide 171 (06c, NS, 200 frames):
 * the state bar (normal / forced / aftermath), five snapshot columns with
 * the vorticity frame above and the pixel-state map below, the connectors
 * from the bar, and the legend. Coordinates are those of the 1920x1080 slide,
 * shifted by (-OX, -OY) so the schema viewBox starts at the content.
 * Tile PNGs live in assets/media/ns-frame-labels/ (extracted from slide 171).
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var svgEl = L.svgEl;

  var OX = 90, OY = 290;                       // slide coordinates of the viewBox origin
  var W = 1700, H = 750;                       // viewBox size in slide units
  var MEDIA = 'assets/media/ns-frame-labels/';
  var FONT = 'Inter, Helvetica, Arial, sans-serif';

  var C = {
    normal: '#c9bfa8', forced: '#d9503f', aftermath: '#e8a33d',
    source: '#d9503f', core: '#2b6f84', ignored: '#a39c8c',
    ink: '#111111', muted: '#52514e', rule: '#a39c8c'
  };

  // Bar segments: x, width (slide units). Normal, forced, aftermath.
  var SEGMENTS = [
    { x: 230.00, w: 550.75, fill: C.normal },
    { x: 780.25, w: 155.50, fill: C.forced },
    { x: 935.25, w: 845.25, fill: C.aftermath }
  ];

  // Columns: image x, bar point x (connector start), caption x, caption text,
  // connector end x (top of the column).
  var COLUMNS = [
    { x: 230,  src: 760.88, caption: 'before',        tile: 'before' },
    { x: 550,  src: 853.88, caption: 'mid-forcing',   tile: 'mid-forcing' },
    { x: 870,  src: 931.38, caption: 'end of forcing', tile: 'end-forcing' },
    { x: 1190, src: 1008.88, caption: '+10',          tile: 'plus10' },
    { x: 1510, src: 1163.88, caption: '+30',          tile: 'plus30' }
  ];
  var CONNECTOR_END = [365, 685, 1005, 1325, 1645];
  var TILE = 270;

  function drawFramePixelLabels(svg) {
    var g = svgEl('g', { transform: 'translate(' + (-OX) + ' ' + (-OY) + ')' }, svg);

    // Row labels
    text(g, 206, 328, 'frame', { anchor: 'end', weight: 600, size: 22 });
    text(g, 206, 505, 'vorticity', { anchor: 'end', weight: 600, size: 22 });
    text(g, 206, 799, 'pixel', { anchor: 'end', weight: 600, size: 22 });

    // State bar
    SEGMENTS.forEach(function (s) {
      svgEl('rect', { x: s.x, y: 310, width: s.w, height: 22, fill: s.fill }, g);
    });

    // Connectors from the bar to each column
    COLUMNS.forEach(function (c, i) {
      svgEl('line', {
        x1: c.src, y1: 332, x2: CONNECTOR_END[i], y2: 354,
        stroke: C.rule, 'stroke-width': 1.2
      }, g);
    });

    // Snapshot columns
    COLUMNS.forEach(function (c) {
      svgEl('image', {
        x: c.x, y: 362, width: TILE, height: TILE, preserveAspectRatio: 'none',
        href: MEDIA + 'frame_' + c.tile + '.png'
      }, g);
      svgEl('image', {
        x: c.x, y: 656, width: TILE, height: TILE, preserveAspectRatio: 'none',
        href: MEDIA + 'pixel_' + c.tile + '.png'
      }, g);
      svgEl('rect', {
        x: c.x, y: 656, width: TILE, height: TILE, fill: 'none', rx: 0,
        stroke: C.rule, 'stroke-width': 1
      }, g);
      text(g, c.x + TILE / 2, 960, c.caption, { anchor: 'middle', weight: 500, size: 22, fill: C.muted });
    });

    // Legend
    legend(g, 230, C.normal, 'normal');
    legend(g, 420, C.forced, 'forced');
    legend(g, 610, C.aftermath, 'aftermath');
    legend(g, 1310, C.source, 'source');
    legend(g, 1480, C.core, 'core');
    legend(g, 1650, C.ignored, 'ignored');
  }

  function legend(parent, x, fill, label) {
    svgEl('rect', { x: x, y: 1005, width: 26, height: 26, fill: fill, rx: 4 }, parent);
    text(parent, x + 38, 1025, label, { anchor: 'start', weight: 500, size: 24 });
  }

  function text(parent, x, y, str, o) {
    var el = svgEl('text', {
      x: x, y: y, 'font-family': FONT, 'font-size': o.size,
      'font-weight': o.weight, fill: o.fill || C.ink, 'text-anchor': o.anchor
    }, parent);
    el.textContent = str;
    return el;
  }

  L.register('frame-pixel-labels', { size: [W, H], draw: drawFramePixelLabels });
})();
