/*
 * schemas/dataset-generation.js: simulation with an injected anomaly term, and the resulting grid
 * (slide "Anomaly Detection Dataset Generation"). Kind: "dataset-generation".
 * The equations are typeset by KaTeX in the slide; this file draws the diagram only.
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var svgEl = L.svgEl;

  var INK = '#222';
  var ARROW_ID = 'dataset-generation-arrow';

  function drawDatasetGeneration(svg) {
    // Arrow head: small and narrow, in user units so it does not scale with the stroke
    var defs = svgEl('defs', {}, svg);
    var marker = svgEl('marker', {
      id: ARROW_ID, viewBox: '0 0 15 10', refX: 10, refY: 5,
      markerWidth: 15, markerHeight: 10, markerUnits: 'userSpaceOnUse', orient: 'auto'
    }, defs);
    svgEl('path', { d: 'M0,0 L15,5 L0,10 z', fill: INK }, marker);

    function arrow(x1, y1, x2, y2) {
      svgEl('line', {
        x1: x1, y1: y1, x2: x2, y2: y2, stroke: INK, 'stroke-width': 3,
        'marker-end': 'url(#' + ARROW_ID + ')'
      }, svg);
    }

    function box(x, y, w, h, fill) {
      svgEl('rect', {
        x: x, y: y, width: w, height: h, rx: 10,
        fill: fill || '#fff', stroke: INK, 'stroke-width': 2.5
      }, svg);
    }

    function text(x, y, str, size) {
      var t = svgEl('text', {
        x: x, y: y, 'font-size': size || 24, 'text-anchor': 'middle',
        fill: INK, 'font-family': 'Helvetica, Arial, sans-serif'
      }, svg);
      t.textContent = str;
      return t;
    }

    // Stack of C layers (back to front), with a grid of cols × rows on the front layer
    function stack(x, y, w, h, cols, rows, step) {
      for (var k = 2; k >= 0; k--) {
        svgEl('rect', {
          x: x + k * step, y: y - k * step, width: w, height: h,
          fill: '#fff', stroke: INK, 'stroke-width': 2
        }, svg);
      }
      var i, gx, gy;
      for (i = 1; i < cols; i++) {
        gx = x + (i * w) / cols;
        svgEl('line', { x1: gx, y1: y, x2: gx, y2: y + h, stroke: INK, 'stroke-width': 1.5 }, svg);
      }
      for (i = 1; i < rows; i++) {
        gy = y + (i * h) / rows;
        svgEl('line', { x1: x, y1: gy, x2: x + w, y2: gy, stroke: INK, 'stroke-width': 1.5 }, svg);
      }
    }

    // Governing equation
    box(20, 50, 160, 110);
    text(100, 100, 'Governing');
    text(100, 130, 'PDE');
    arrow(180, 110, 295, 110);
    arrow(100, 160, 100, 275);

    // Solver
    box(300, 50, 160, 110, '#fbf1b2');
    text(380, 90, 'Solver');
    svgEl('image', {
      href: 'assets/media/dedalus_logo.png', x: 360, y: 100, width: 60, height: 40,
      preserveAspectRatio: 'xMidYMid meet'
    }, svg);
    arrow(460, 110, 575, 110);

    // Resulting grid of values, centred above the snapshot (centre x = 840)
    stack(580, 60, 100, 100, 4, 4, 6);

    // Anomaly term, injected into the equation
    box(20, 280, 160, 110);
    text(100, 310, 'Inject', 22);
    text(100, 340, 'anomalies in', 22);
    text(100, 370, 'PDE', 22);
    arrow(180, 335, 295, 335);

    // Solver bis
    box(300, 280, 160, 110, '#fbf1b2');
    text(380, 320, 'Solver');
    svgEl('image', {
      href: 'assets/media/dedalus_logo.png', x: 360, y: 330, width: 60, height: 40,
      preserveAspectRatio: 'xMidYMid meet'
    }, svg);
    arrow(460, 335, 575, 335);

    // Resulting grid of values, centred above the snapshot (centre x = 840)
    stack(580, 285, 100, 100, 4, 4, 6);

    // Snapshot of the velocity field, centred under the stack
    svgEl('image', {
      href: 'assets/media/rbc_snapshot_clean.png', x: 700, y: 40, width: 130, height: 130,
      preserveAspectRatio: 'xMidYMid meet'
    }, svg);

    // Snapshot of the velocity field with the anomaly, centred under the stack
    svgEl('image', {
      href: 'assets/media/rbc_snapshot_anomaly.png', x: 700, y: 260, width: 130, height: 130,
      preserveAspectRatio: 'xMidYMid meet'
    }, svg);

    // Snapshot of the velocity field with the anomaly, centred under the stack
    svgEl('image', {
      href: 'assets/media/rbc_snapshot_diff.png', x: 840, y: 150, width: 130, height: 130,
      preserveAspectRatio: 'xMidYMid meet'
    }, svg);

  }

  L.register('dataset-generation', { size: [1000, 480], draw: drawDatasetGeneration });
})();
