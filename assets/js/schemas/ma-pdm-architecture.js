/*
 * schemas/ma-pdm-architecture.js: MA-PDM architecture.
 * Kind: "ma-pdm-architecture". Reproduces the diagram of slide 25 (MA-PDM):
 * past frames, appearance and motion tensors, noisy target, DDIM denoiser (U-Net)
 * with skip features and memory read, and the generated frame.
 * The two takeaway boxes are HTML in the slide, not part of this drawing.
 *
 * Geometry is in slide units (1920x1080 slide), shifted by (-OX, -OY).
 * Items are drawn in order:
 *   { t: tag, a: attributes }        shapes (rect, line, path, polygon, circle)
 *   { t: "text", a: attributes, s }  plain text
 *   { t: "math", x, y, size, parts } formula; parts = [[text, flags], ...],
 *                                    flags: "i" italic, "sub", "sup", "" upright
 */
(function () {
  'use strict';

  var L = window.LitisSchemas;
  var svgEl = L.svgEl;

  var OX = 90, OY = 280;       // slide coordinates of the viewBox origin
  var W = 1340, H = 690;       // viewBox size (slide units)
  var MATH_FONT = '"Latin Modern Math", "STIX Two Math", "Cambria Math", "Times New Roman", serif';

  var ARROW_MARKER = {
    id: 'madpdm-ah', viewBox: '0 0 10 10', refX: 9, refY: 5,
    markerWidth: 14, markerHeight: 14, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse'
  };

  var ITEMS = [
    {"t": "rect", "a": {"x": "120.00", "y": "447.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "144.00", "y1": "447.00", "x2": "144.00", "y2": "567.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "168.00", "y1": "447.00", "x2": "168.00", "y2": "567.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "192.00", "y1": "447.00", "x2": "192.00", "y2": "567.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "216.00", "y1": "447.00", "x2": "216.00", "y2": "567.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "120.00", "y1": "471.00", "x2": "240.00", "y2": "471.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "120.00", "y1": "495.00", "x2": "240.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "120.00", "y1": "519.00", "x2": "240.00", "y2": "519.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "120.00", "y1": "543.00", "x2": "240.00", "y2": "543.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "120.00", "y": "447.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "130.00", "y": "457.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "154.00", "y1": "457.00", "x2": "154.00", "y2": "577.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "178.00", "y1": "457.00", "x2": "178.00", "y2": "577.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "202.00", "y1": "457.00", "x2": "202.00", "y2": "577.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "226.00", "y1": "457.00", "x2": "226.00", "y2": "577.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "130.00", "y1": "481.00", "x2": "250.00", "y2": "481.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "130.00", "y1": "505.00", "x2": "250.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "130.00", "y1": "529.00", "x2": "250.00", "y2": "529.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "130.00", "y1": "553.00", "x2": "250.00", "y2": "553.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "130.00", "y": "457.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "140.00", "y": "467.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "164.00", "y1": "467.00", "x2": "164.00", "y2": "587.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "188.00", "y1": "467.00", "x2": "188.00", "y2": "587.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "212.00", "y1": "467.00", "x2": "212.00", "y2": "587.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "236.00", "y1": "467.00", "x2": "236.00", "y2": "587.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "140.00", "y1": "491.00", "x2": "260.00", "y2": "491.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "140.00", "y1": "515.00", "x2": "260.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "140.00", "y1": "539.00", "x2": "260.00", "y2": "539.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "140.00", "y1": "563.00", "x2": "260.00", "y2": "563.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "140.00", "y": "467.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "text", "a": {"x": "190.00", "y": "389.00", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "middle"}, "s": "Past frames"},
    {"t": "math", "name": "pastRange", "x": 97.82, "y": 429.0, "size": 24, "parts": [["X", "i"], ["t−n", "i sub"], [", … , ", ""], ["X", "i"], ["t−1", "i sub"]]},
    {"t": "math", "name": "shapePast", "x": 126.38, "y": 627.0, "size": 22, "parts": [["ℝ", ""], ["B,T,C,H,W", "sup"]]},
    {"t": "path", "a": {"d": "M270.0,527.0 L336.0,527.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round"}},
    {"t": "path", "a": {"d": "M335.0,527.0 L335.5,527.0 Q336.0,527.0 336.0,526.5 L336.0,418.0 Q336.0,404.0 350.0,404.0 L438.0,404.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#madpdm-ah)"}},
    {"t": "path", "a": {"d": "M335.0,527.0 L335.5,527.0 Q336.0,527.0 336.0,527.5 L336.0,636.0 Q336.0,650.0 350.0,650.0 L418.0,650.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#madpdm-ah)"}},
    {"t": "rect", "a": {"x": "450.00", "y": "356.00", "width": "96.00", "height": "96.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "474.00", "y1": "356.00", "x2": "474.00", "y2": "452.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "498.00", "y1": "356.00", "x2": "498.00", "y2": "452.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "522.00", "y1": "356.00", "x2": "522.00", "y2": "452.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "380.00", "x2": "546.00", "y2": "380.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "404.00", "x2": "546.00", "y2": "404.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "428.00", "x2": "546.00", "y2": "428.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "450.00", "y": "356.00", "width": "96.00", "height": "96.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "text", "a": {"x": "413.67", "y": "338.00", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Appearance"},
    {"t": "math", "name": "lblAppearance", "x": 553.47, "y": 338.0, "size": 22, "parts": [["C", "i"], ["a", "i sub"]]},
    {"t": "math", "name": "shapeApp", "x": 443.49, "y": 490.0, "size": 20, "parts": [["ℝ", ""], ["M,1,C,P,P", "sup"]]},
    {"t": "rect", "a": {"x": "430.00", "y": "582.00", "width": "96.00", "height": "96.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "454.00", "y1": "582.00", "x2": "454.00", "y2": "678.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "478.00", "y1": "582.00", "x2": "478.00", "y2": "678.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "502.00", "y1": "582.00", "x2": "502.00", "y2": "678.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "430.00", "y1": "606.00", "x2": "526.00", "y2": "606.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "430.00", "y1": "630.00", "x2": "526.00", "y2": "630.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "430.00", "y1": "654.00", "x2": "526.00", "y2": "654.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "430.00", "y": "582.00", "width": "96.00", "height": "96.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "440.00", "y": "592.00", "width": "96.00", "height": "96.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "464.00", "y1": "592.00", "x2": "464.00", "y2": "688.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "488.00", "y1": "592.00", "x2": "488.00", "y2": "688.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "512.00", "y1": "592.00", "x2": "512.00", "y2": "688.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "440.00", "y1": "616.00", "x2": "536.00", "y2": "616.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "440.00", "y1": "640.00", "x2": "536.00", "y2": "640.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "440.00", "y1": "664.00", "x2": "536.00", "y2": "664.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "440.00", "y": "592.00", "width": "96.00", "height": "96.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "450.00", "y": "602.00", "width": "96.00", "height": "96.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "474.00", "y1": "602.00", "x2": "474.00", "y2": "698.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "498.00", "y1": "602.00", "x2": "498.00", "y2": "698.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "522.00", "y1": "602.00", "x2": "522.00", "y2": "698.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "626.00", "x2": "546.00", "y2": "626.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "650.00", "x2": "546.00", "y2": "650.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "674.00", "x2": "546.00", "y2": "674.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "450.00", "y": "602.00", "width": "96.00", "height": "96.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "text", "a": {"x": "427.96", "y": "564.00", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Motion"},
    {"t": "math", "name": "lblMotion", "x": 512.03, "y": 564.0, "size": 22, "parts": [["C", "i"], ["m", "i sub"]]},
    {"t": "math", "name": "shapeMot", "x": 419.09, "y": 736.0, "size": 20, "parts": [["ℝ", ""], ["M,T−1,C,P,P", "sup"]]},
    {"t": "rect", "a": {"x": "450.00", "y": "820.00", "width": "96.00", "height": "96.00", "fill": "#FDFCF8"}},
    {"t": "rect", "a": {"x": "450.00", "y": "820.00", "width": "24.00", "height": "24.00", "fill": "#eeeeee"}},
    {"t": "rect", "a": {"x": "450.00", "y": "844.00", "width": "24.00", "height": "24.00", "fill": "#a0a0a0"}},
    {"t": "rect", "a": {"x": "450.00", "y": "868.00", "width": "24.00", "height": "24.00", "fill": "#bcbcbc"}},
    {"t": "rect", "a": {"x": "450.00", "y": "892.00", "width": "24.00", "height": "24.00", "fill": "#dedede"}},
    {"t": "rect", "a": {"x": "474.00", "y": "820.00", "width": "24.00", "height": "24.00", "fill": "#c9c9c9"}},
    {"t": "rect", "a": {"x": "474.00", "y": "844.00", "width": "24.00", "height": "24.00", "fill": "#a3a3a3"}},
    {"t": "rect", "a": {"x": "474.00", "y": "868.00", "width": "24.00", "height": "24.00", "fill": "#c5c5c5"}},
    {"t": "rect", "a": {"x": "474.00", "y": "892.00", "width": "24.00", "height": "24.00", "fill": "#c5c5c5"}},
    {"t": "rect", "a": {"x": "498.00", "y": "820.00", "width": "24.00", "height": "24.00", "fill": "#9f9f9f"}},
    {"t": "rect", "a": {"x": "498.00", "y": "844.00", "width": "24.00", "height": "24.00", "fill": "#f1f1f1"}},
    {"t": "rect", "a": {"x": "498.00", "y": "868.00", "width": "24.00", "height": "24.00", "fill": "#c3c3c3"}},
    {"t": "rect", "a": {"x": "498.00", "y": "892.00", "width": "24.00", "height": "24.00", "fill": "#f5f5f5"}},
    {"t": "rect", "a": {"x": "522.00", "y": "820.00", "width": "24.00", "height": "24.00", "fill": "#d2d2d2"}},
    {"t": "rect", "a": {"x": "522.00", "y": "844.00", "width": "24.00", "height": "24.00", "fill": "#ababab"}},
    {"t": "rect", "a": {"x": "522.00", "y": "868.00", "width": "24.00", "height": "24.00", "fill": "#e1e1e1"}},
    {"t": "rect", "a": {"x": "522.00", "y": "892.00", "width": "24.00", "height": "24.00", "fill": "#f0f0f0"}},
    {"t": "line", "a": {"x1": "474.00", "y1": "820.00", "x2": "474.00", "y2": "916.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "498.00", "y1": "820.00", "x2": "498.00", "y2": "916.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "522.00", "y1": "820.00", "x2": "522.00", "y2": "916.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "844.00", "x2": "546.00", "y2": "844.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "868.00", "x2": "546.00", "y2": "868.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "450.00", "y1": "892.00", "x2": "546.00", "y2": "892.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "450.00", "y": "820.00", "width": "96.00", "height": "96.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "text", "a": {"x": "413.96", "y": "802.00", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Noisy target"},
    {"t": "math", "name": "lblNoisy", "x": 553.69, "y": 802.0, "size": 22, "parts": [["X", "i"], ["t", "i sub"]]},
    {"t": "math", "name": "shapeNoisy", "x": 443.49, "y": 954.0, "size": 20, "parts": [["ℝ", ""], ["M,1,C,P,P", "sup"]]},
    {"t": "circle", "a": {"cx": "336.00", "cy": "868.00", "r": "26", "fill": "#FDFCF8", "stroke": "#3a3a3a", "stroke-width": "2.5"}},
    {"t": "math", "name": "eps", "x": 331.13, "y": 873.44, "size": 22, "parts": [["ϵ", "i"]]},
    {"t": "text", "a": {"x": "296.00", "y": "875.00", "font-family": "Inter", "font-size": "20", "font-weight": "400", "fill": "#52514e", "text-anchor": "end"}, "s": "noise"},
    {"t": "path", "a": {"d": "M372.0,868.0 L438.0,868.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#madpdm-ah)"}},
    {"t": "polygon", "a": {"points": "626.00,319.00 756.00,362.00 756.00,446.00 626.00,489.00", "fill": "#E7DFCB", "stroke": "#3a3a3a", "stroke-width": "2.5", "stroke-linejoin": "round"}},
    {"t": "text", "a": {"x": "691.00", "y": "411.92", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#111111", "text-anchor": "middle"}, "s": "Encoder"},
    {"t": "path", "a": {"d": "M558.0,404.0 L616.0,404.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#madpdm-ah)"}},
    {"t": "rect", "a": {"x": "850.00", "y": "292.00", "width": "250.00", "height": "224.00", "fill": "#E7DFCB", "rx": "20"}},
    {"t": "text", "a": {"x": "872.00", "y": "330.00", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#52514e", "text-anchor": "start"}, "s": "Memory"},
    {"t": "rect", "a": {"x": "872.00", "y": "350.00", "width": "156.00", "height": "26.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "898.00", "y1": "350.00", "x2": "898.00", "y2": "376.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "924.00", "y1": "350.00", "x2": "924.00", "y2": "376.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "950.00", "y1": "350.00", "x2": "950.00", "y2": "376.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "976.00", "y1": "350.00", "x2": "976.00", "y2": "376.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1002.00", "y1": "350.00", "x2": "1002.00", "y2": "376.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "872.00", "y": "350.00", "width": "156.00", "height": "26.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "math", "name": "mem1", "x": 1040.0, "y": 366.78, "size": 22, "parts": [["e", "i"], ["1", "sub"]]},
    {"t": "rect", "a": {"x": "872.00", "y": "390.00", "width": "156.00", "height": "26.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "898.00", "y1": "390.00", "x2": "898.00", "y2": "416.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "924.00", "y1": "390.00", "x2": "924.00", "y2": "416.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "950.00", "y1": "390.00", "x2": "950.00", "y2": "416.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "976.00", "y1": "390.00", "x2": "976.00", "y2": "416.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1002.00", "y1": "390.00", "x2": "1002.00", "y2": "416.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "872.00", "y": "390.00", "width": "156.00", "height": "26.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "math", "name": "mem2", "x": 1040.0, "y": 406.78, "size": 22, "parts": [["e", "i"], ["2", "sub"]]},
    {"t": "circle", "a": {"cx": "950.00", "cy": "433.00", "r": "2.6", "fill": "#2a78d6"}},
    {"t": "circle", "a": {"cx": "950.00", "cy": "443.00", "r": "2.6", "fill": "#2a78d6"}},
    {"t": "circle", "a": {"cx": "950.00", "cy": "453.00", "r": "2.6", "fill": "#2a78d6"}},
    {"t": "rect", "a": {"x": "872.00", "y": "470.00", "width": "156.00", "height": "26.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "898.00", "y1": "470.00", "x2": "898.00", "y2": "496.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "924.00", "y1": "470.00", "x2": "924.00", "y2": "496.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "950.00", "y1": "470.00", "x2": "950.00", "y2": "496.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "976.00", "y1": "470.00", "x2": "976.00", "y2": "496.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1002.00", "y1": "470.00", "x2": "1002.00", "y2": "496.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "872.00", "y": "470.00", "width": "156.00", "height": "26.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "math", "name": "memN", "x": 1040.0, "y": 486.69, "size": 22, "parts": [["e", "i"], ["n", "i sub"]]},
    {"t": "path", "a": {"d": "M766.0,404.0 L838.0,404.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#madpdm-ah)"}},
    {"t": "rect", "a": {"x": "760.00", "y": "657.00", "width": "380.00", "height": "236.00", "fill": "#DCD2BA", "rx": "24"}},
    {"t": "polygon", "a": {"points": "800.00,683.00 930.00,723.00 930.00,783.00 800.00,823.00", "fill": "#E7DFCB", "stroke": "#3a3a3a", "stroke-width": "2.5", "stroke-linejoin": "round"}},
    {"t": "polygon", "a": {"points": "970.00,723.00 1100.00,683.00 1100.00,823.00 970.00,783.00", "fill": "#E7DFCB", "stroke": "#3a3a3a", "stroke-width": "2.5", "stroke-linejoin": "round"}},
    {"t": "line", "a": {"x1": "930.00", "y1": "753.00", "x2": "970.00", "y2": "753.00", "stroke": "#3a3a3a", "stroke-width": "2.5", "stroke-linecap": "round"}},
    {"t": "text", "a": {"x": "950.00", "y": "869.00", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#111111", "text-anchor": "middle"}, "s": "DDIM denoiser (U-Net)"},
    {"t": "path", "a": {"d": "M558.0,650.0 L636.0,650.0 Q650.0,650.0 650.0,664.0 L650.0,751.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round"}},
    {"t": "path", "a": {"d": "M558.0,868.0 L636.0,868.0 Q650.0,868.0 650.0,854.0 L650.0,755.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round"}},
    {"t": "circle", "a": {"cx": "650.00", "cy": "753.00", "r": "6", "fill": "#3a3a3a"}},
    {"t": "path", "a": {"d": "M650.0,753.0 L748.0,753.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#madpdm-ah)"}},
    {"t": "text", "a": {"x": "705.00", "y": "739.00", "font-family": "Inter", "font-size": "19", "font-weight": "400", "fill": "#52514e", "text-anchor": "middle"}, "s": "concat"},
    {"t": "path", "a": {"d": "M1050.6,526.0 L1050.6,690.2", "stroke": "#2a78d6", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#ahb)"}},
    {"t": "text", "a": {"x": "1064.60", "y": "562.00", "font-family": "Inter", "font-size": "19", "font-weight": "400", "fill": "#52514e", "text-anchor": "start"}, "s": "memory read"},
    {"t": "path", "a": {"d": "M691.0,458.0 L691.0,576.0 Q691.0,590.0 705.0,590.0 L984.6,590.0 Q998.6,590.0 998.6,604.0 L998.6,706.2", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-dasharray": "9 7", "marker-end": "url(#madpdm-ah)"}},
    {"t": "text", "a": {"x": "705.00", "y": "500.00", "font-family": "Inter", "font-size": "19", "font-weight": "400", "fill": "#52514e", "text-anchor": "start"}, "s": "skip features"},
    {"t": "rect", "a": {"x": "1210.00", "y": "698.00", "width": "110.00", "height": "110.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "1232.00", "y1": "698.00", "x2": "1232.00", "y2": "808.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1254.00", "y1": "698.00", "x2": "1254.00", "y2": "808.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1276.00", "y1": "698.00", "x2": "1276.00", "y2": "808.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1298.00", "y1": "698.00", "x2": "1298.00", "y2": "808.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "720.00", "x2": "1320.00", "y2": "720.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "742.00", "x2": "1320.00", "y2": "742.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "764.00", "x2": "1320.00", "y2": "764.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "786.00", "x2": "1320.00", "y2": "786.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1210.00", "y": "698.00", "width": "110.00", "height": "110.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "path", "a": {"d": "M1152.0,753.0 L1198.0,753.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#madpdm-ah)"}},
    {"t": "text", "a": {"x": "1175.00", "y": "739.00", "font-family": "Inter", "font-size": "19", "font-weight": "400", "fill": "#52514e", "text-anchor": "middle"}, "s": "stitch"},
    {"t": "text", "a": {"x": "1189.82", "y": "678.00", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Generated"},
    {"t": "math", "name": "lblGen", "x": 1311.26, "y": 678.0, "size": 22, "parts": [["X", "i"], ["′", "sup"], ["t", "i sub"]]},
    {"t": "math", "name": "shapeGen", "x": 1207.93, "y": 846.0, "size": 20, "parts": [["ℝ", ""], ["B,1,C,H,W", "sup"]]}
  ];

  // Formula as one <text> with tspans: sub/sup are shifted and scaled.
  function drawMath(parent, item) {
    var size = item.size;
    var text = svgEl('text', {
      x: item.x, y: item.y, 'font-family': MATH_FONT, 'font-size': size, fill: '#111111'
    }, parent);
    var shift = 0;
    item.parts.forEach(function (part) {
      var str = part[0], flags = part[1] || '';
      var target = flags.indexOf('sub') >= 0 ? 0.3 * size : (flags.indexOf('sup') >= 0 ? -0.45 * size : 0);
      var span = svgEl('tspan', {}, text);
      if (target - shift !== 0) { span.setAttribute('dy', target - shift); }
      shift = target;
      if (flags.indexOf('sub') >= 0 || flags.indexOf('sup') >= 0) {
        span.setAttribute('font-size', 0.7 * size);
      }
      if (flags.indexOf('i') >= 0) { span.setAttribute('font-style', 'italic'); }
      span.textContent = str;
    });
    return text;
  }

  function drawMaPdm(svg) {
    var defs = svgEl('defs', {}, svg);
    var marker = svgEl('marker', ARROW_MARKER, defs);
    svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#3a3a3a' }, marker);

    var g = svgEl('g', { transform: 'translate(' + (-OX) + ' ' + (-OY) + ')' }, svg);
    ITEMS.forEach(function (it) {
      if (it.t === 'math') {
        drawMath(g, it);
      } else if (it.t === 'text') {
        var el = svgEl('text', it.a, g);
        el.textContent = it.s;
      } else {
        svgEl(it.t, it.a, g);
      }
    });
  }

  L.register('ma-pdm-architecture', { size: [W, H], draw: drawMaPdm });
})();
