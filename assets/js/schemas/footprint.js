/*
 * schemas/footprint.js: spatial mask of the injected Gaussian footprint.
 * Kind: "footprint". Overlays one time step's Gaussian (sigma = sqrt(area / pi))
 * and its 2-sigma mask on a clean RBC snapshot.
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var svgEl = L.svgEl;
  var COLOR = L.COLOR;

  var SIZE = 160;                 // side of the snapshot, in viewBox units
  var X0 = 10, Y0 = 20;           // snapshot origin
  var CX = X0 + 0.35 * SIZE;      // footprint centre
  var CY = Y0 + 0.45 * SIZE;
  var SIGMA = 0.12 * SIZE;        // sigma of the Gaussian
  var MASK_R = 2 * SIGMA;         // mask radius: exp(-r^2 / 2 sigma^2) = e^-2 at r = 2 sigma

  function drawFootprint(svg) {
    var defs = svgEl('defs', {}, svg);
    var grad = svgEl('radialGradient', { id: 'fp-grad', cx: '50%', cy: '50%', r: '50%' }, defs);
    svgEl('stop', { offset: '0%', 'stop-color': '#ffcc00', 'stop-opacity': 0.75 }, grad);
    svgEl('stop', { offset: '100%', 'stop-color': '#ffcc00', 'stop-opacity': 0 }, grad);

    // Snapshot of the clean RBC run
    svgEl('image', {
      href: 'assets/media/rbc_snapshot_clean.png',
      x: X0, y: Y0, width: SIZE, height: SIZE, preserveAspectRatio: 'xMidYMid meet'
    }, svg);

    // Gaussian footprint (a heat-like halo fading at 2 sigma)
    svgEl('circle', { cx: CX, cy: CY, r: MASK_R, fill: 'url(#fp-grad)' }, svg);
    // Mask boundary at 2 sigma
    svgEl('circle', {
      cx: CX, cy: CY, r: MASK_R, fill: 'none', stroke: '#ffffff', 'stroke-width': 2,
      'stroke-dasharray': '6 4'
    }, svg);
    // Sigma marker
    svgEl('line', { x1: CX, y1: CY, x2: CX + SIGMA, y2: CY, stroke: '#ffffff', 'stroke-width': 2 }, svg);
    svgEl('circle', { cx: CX, cy: CY, r: 3, fill: '#ffffff' }, svg);

    function text(tx, ty, str, size, weight, fill) {
      var el = svgEl('text', {
        x: tx, y: ty, 'font-size': size || 18, 'font-weight': weight || 'normal',
        fill: fill || COLOR.dark, 'font-family': 'Helvetica, Arial, sans-serif'
      }, svg);
      el.textContent = str;
      return el;
    }

    text(CX + SIGMA / 2 - 4, CY - 6, 'σ', 18, 'normal', '#ffffff');
    text(195, 40, 'Forcing footprint, one time step', 18, 'bold');
    text(195, 80, 'Gaussian: exp(−r² / 2σ²)', 18);
    text(195, 110, 'σ = √(area / π)', 18);
    text(195, 140, 'Mask: r ≤ 2σ (threshold e⁻²)', 18);
  }

  L.register('footprint', { size: [600, 200], draw: drawFootprint });
})();
