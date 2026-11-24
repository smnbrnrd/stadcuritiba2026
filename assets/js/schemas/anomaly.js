/*
 * schemas/anomaly.js: normal behaviour with three anomaly windows (slide "What is an anomaly?").
 * Kind: "anomaly". Curves are analytic, so they stay smooth at any size.
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var COLOR = L.COLOR;
  var svgEl = L.svgEl;

// Anomaly: a normal oscillation with three anomaly windows, in data coordinates
// (time t from 0 to 100, value v). Curves are analytic, so they stay smooth at any size.
function drawAnomaly(svg) {
  var X0 = 8;
  var SX = 3.96;     // pixels per unit of time
  var Y0 = 75;       // pixel row of value 0
  var SY = 16.25;    // pixels per unit of value
  var ANOM = '#b92d38'; // theme danger color
  var BAND = '#e7dfcb';

  // Plain text, centred or anchored
  function text(x, y, str, size, anchor) {
    var t = svgEl('text', {
      x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'middle', fill: COLOR.dark
    }, svg);
    t.textContent = str;
    return t;
  }

  function px(t, v) {
    return [X0 + SX * t, Y0 - SY * v];
  }

  function pathOf(samples) {
    return samples.map(function (s, i) {
      var p = px(s[0], s[1]);
      return (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2);
    }).join(' ');
  }

  function sampleFn(f, a, b, step) {
    var out = [];
    for (var t = a; t <= b + 1e-9; t += step) {
      out.push([t, f(t)]);
    }
    // Always end exactly on b, so consecutive pieces meet at the same point
    if (out[out.length - 1][0] < b - 1e-9) {
      out.push([b, f(b)]);
    }
    return out;
  }

  // Smooth curve through key points (uniform Catmull-Rom), n samples per segment
  function catmull(p, n) {
    var out = [];
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[Math.max(0, i - 1)];
      var p1 = p[i];
      var p2 = p[i + 1];
      var p3 = p[Math.min(p.length - 1, i + 2)];
      for (var s = 0; s < n; s++) {
        var t = s / n;
        var t2 = t * t;
        var t3 = t2 * t;
        var pt = [0, 1].map(function (k) {
          return 0.5 * (2 * p1[k] +
            (-p0[k] + p2[k]) * t +
            (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
            (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
        });
        out.push(pt);
      }
    }
    out.push(p[p.length - 1]);
    return out;
  }

  // Model curves
  function normal(t) {
    return 1.05 * Math.cos(2 * Math.PI * (t - 4.3) / 8.8) + 0.05;
  }
  // Collective burst: oscillates around the normal level, with an envelope that
  // is zero at both ends of the window, so it joins the normal curve exactly
  function collective(t) {
    var s = (t - 51.1) / 7.6;
    var centre = normal(51.1) * (1 - s) + normal(58.7) * s;
    var env = Math.min(1, 2 * Math.sin(Math.PI * s));
    return centre + env * 1.5 * Math.cos(2 * Math.PI * (t - 53.5) / 2.5);
  }
  function drift(t) {
    var mid = 0.05 + 0.035 * (t - 70);
    var amp = 0.9 + 0.045 * (t - 70);
    return mid + amp * Math.cos(2 * Math.PI * (t - 74.5) / 9);
  }

  // Anomaly windows (shaded)
  [[19.9, 34.3], [51.1, 58.7], [68.5, 100]].forEach(function (w) {
    svgEl('rect', {
      x: px(w[0], 0)[0], y: 2, width: SX * (w[1] - w[0]), height: 130, fill: BAND
    }, svg);
  });

  // Axes and ticks
  svgEl('line', { x1: X0, y1: 2, x2: X0, y2: 132, stroke: COLOR.dark, 'stroke-width': 0.6 }, svg);
  svgEl('line', { x1: X0, y1: 132, x2: 404, y2: 132, stroke: COLOR.dark, 'stroke-width': 0.6 }, svg);
  [-2, 0, 2, 4].forEach(function (v) {
    text(5, px(0, v)[1] + 2, String(v), 6, 'end');
  });
  for (var t = 0; t <= 100; t += 20) {
    text(px(t, 0)[0], 141, String(t), 6, 'middle');
  }
  text(205, 147, 'time', 6.5, 'middle');
  text(10, 7, 'value', 6.5, 'start');

  // Normal behaviour (blue), outside the anomaly windows
  [[2.3, 19.9], [34.3, 51.1], [58.7, 68.5]].forEach(function (seg) {
    svgEl('path', {
      d: pathOf(sampleFn(normal, seg[0], seg[1], 0.05)),
      fill: 'none', stroke: COLOR.main, 'stroke-width': 1.1, 'stroke-linejoin': 'round'
    }, svg);
  });

  // Anomalies (red): drought dip, collective burst, concept drift
  var droughtKeys = [
    [19.9, -0.08], [21.3, 0.38], [24, -1.5], [26.6, -2.95],
    [29, -1.7], [31.5, -0.08], [33, -0.6], [34.3, -1.16]
  ];
  // Drought: shift the spline so it starts and ends on the normal curve, with a linear blend
  var dr = catmull(droughtKeys, 12);
  var dStart = normal(19.9) - dr[0][1];
  var dEnd = normal(34.3) - dr[dr.length - 1][1];
  var drought = dr.map(function (s) {
    var w = (s[0] - 19.9) / (34.3 - 19.9);
    return [s[0], s[1] + dStart * (1 - w) + dEnd * w];
  });
  // Concept drift: the offset from the normal curve fades out over the first 4 units
  var drDrift = sampleFn(drift, 68.5, 100, 0.05).map(function (s) {
    var k = Math.max(0, 1 - (s[0] - 68.5) / 4);
    return [s[0], s[1] + (normal(68.5) - drift(68.5)) * k];
  });
  var anomalies = [
    drought,
    sampleFn(collective, 51.1, 58.7, 0.02),
    drDrift
  ];
  anomalies.forEach(function (samples) {
    svgEl('path', {
      d: pathOf(samples), fill: 'none', stroke: ANOM, 'stroke-width': 1.1, 'stroke-linejoin': 'round'
    }, svg);
  });

  // Labels and leader lines
  function label(x, y, str) {
    var el = text(x, y, str, 6.5, 'middle');
    el.setAttribute('font-weight', 'bold');
    el.setAttribute('fill', ANOM);
  }
  label(117, 22, 'contextual anomaly');
  label(117, 31, '(sustained regime change)');
  label(190, 12, 'collective anomaly');
  label(190, 21, '(wrong pattern)');
  label(345, 106, 'concept drift');
  label(345, 115, '("normal" itself shifts)');
  svgEl('line', { x1: 200, y1: 26, x2: 214, y2: 38, stroke: ANOM, 'stroke-width': 0.6 }, svg);
}

  L.register('anomaly', { size: [410, 148], draw: drawAnomaly });
})();
