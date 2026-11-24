/*
 * schemas/mnad-architecture.js: MNAD model architecture.
 * Kind: "mnad-architecture". Reproduces the diagram of slide 22 (MNAD):
 * input, encoder, query, memory of normal prototypes (read and update),
 * concatenation, decoder and prediction. The two takeaway boxes are HTML
 * in the slide, not part of this drawing.
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

  var OX = 90, OY = 290;       // slide coordinates of the viewBox origin
  var W = 1740, H = 560;       // viewBox size (slide units)
  var MATH_FONT = '"Latin Modern Math", "STIX Two Math", "Cambria Math", "Times New Roman", serif';

  var ARROW_MARKER = {
    id: 'mnad-ah', viewBox: '0 0 10 10', refX: 9, refY: 5,
    markerWidth: 14, markerHeight: 14, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse'
  };

  var ITEMS = [
    {"t": "rect", "a": {"x": "170.00", "y": "375.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "194.00", "y1": "375.00", "x2": "194.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "218.00", "y1": "375.00", "x2": "218.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "242.00", "y1": "375.00", "x2": "242.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "266.00", "y1": "375.00", "x2": "266.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "170.00", "y1": "399.00", "x2": "290.00", "y2": "399.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "170.00", "y1": "423.00", "x2": "290.00", "y2": "423.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "170.00", "y1": "447.00", "x2": "290.00", "y2": "447.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "170.00", "y1": "471.00", "x2": "290.00", "y2": "471.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "170.00", "y": "375.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "180.00", "y": "385.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "204.00", "y1": "385.00", "x2": "204.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "228.00", "y1": "385.00", "x2": "228.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "252.00", "y1": "385.00", "x2": "252.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "276.00", "y1": "385.00", "x2": "276.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "180.00", "y1": "409.00", "x2": "300.00", "y2": "409.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "180.00", "y1": "433.00", "x2": "300.00", "y2": "433.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "180.00", "y1": "457.00", "x2": "300.00", "y2": "457.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "180.00", "y1": "481.00", "x2": "300.00", "y2": "481.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "180.00", "y": "385.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "190.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "214.00", "y1": "395.00", "x2": "214.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "238.00", "y1": "395.00", "x2": "238.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "262.00", "y1": "395.00", "x2": "262.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "286.00", "y1": "395.00", "x2": "286.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "190.00", "y1": "419.00", "x2": "310.00", "y2": "419.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "190.00", "y1": "443.00", "x2": "310.00", "y2": "443.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "190.00", "y1": "467.00", "x2": "310.00", "y2": "467.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "190.00", "y1": "491.00", "x2": "310.00", "y2": "491.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "190.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "text", "a": {"x": "130.23", "y": "312.00", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Input"},
    {"t": "math", "name": "input", "x": 199.71, "y": 312.0, "size": 26, "parts": [["X", "i"], ["t−l", "i sub"], [", … , ", ""], ["X", "i"], ["t", "i sub"]]},
    {"t": "math", "name": "shapeIn", "x": 167.73, "y": 350.0, "size": 22, "parts": [["ℝ", ""], ["B,(T),C,H,W", "sup"]]},
    {"t": "path", "a": {"d": "M322.0,455.0 L390.0,455.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "polygon", "a": {"points": "400.00,355.00 540.00,403.00 540.00,507.00 400.00,555.00", "fill": "#E7DFCB", "stroke": "#3a3a3a", "stroke-width": "2.5", "stroke-linejoin": "round"}},
    {"t": "text", "a": {"x": "470.00", "y": "463.64", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "middle"}, "s": "Encoder"},
    {"t": "rect", "a": {"x": "640.00", "y": "375.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "664.00", "y1": "375.00", "x2": "664.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "688.00", "y1": "375.00", "x2": "688.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "712.00", "y1": "375.00", "x2": "712.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "736.00", "y1": "375.00", "x2": "736.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "640.00", "y1": "399.00", "x2": "760.00", "y2": "399.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "640.00", "y1": "423.00", "x2": "760.00", "y2": "423.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "640.00", "y1": "447.00", "x2": "760.00", "y2": "447.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "640.00", "y1": "471.00", "x2": "760.00", "y2": "471.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "640.00", "y": "375.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "650.00", "y": "385.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "674.00", "y1": "385.00", "x2": "674.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "698.00", "y1": "385.00", "x2": "698.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "722.00", "y1": "385.00", "x2": "722.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "746.00", "y1": "385.00", "x2": "746.00", "y2": "505.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "650.00", "y1": "409.00", "x2": "770.00", "y2": "409.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "650.00", "y1": "433.00", "x2": "770.00", "y2": "433.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "650.00", "y1": "457.00", "x2": "770.00", "y2": "457.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "650.00", "y1": "481.00", "x2": "770.00", "y2": "481.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "650.00", "y": "385.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "660.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "684.00", "y1": "395.00", "x2": "684.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "708.00", "y1": "395.00", "x2": "708.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "732.00", "y1": "395.00", "x2": "732.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "756.00", "y1": "395.00", "x2": "756.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "660.00", "y1": "419.00", "x2": "780.00", "y2": "419.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "660.00", "y1": "443.00", "x2": "780.00", "y2": "443.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "660.00", "y1": "467.00", "x2": "780.00", "y2": "467.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "660.00", "y1": "491.00", "x2": "780.00", "y2": "491.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "660.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "path", "a": {"d": "M550.0,455.0 L628.0,455.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "text", "a": {"x": "662.96", "y": "312.00", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Query"},
    {"t": "math", "name": "query", "x": 744.43, "y": 312.0, "size": 26, "parts": [["q", "i"]]},
    {"t": "math", "name": "shapeQ", "x": 658.03, "y": 350.0, "size": 22, "parts": [["ℝ", ""], ["B,D,X,Y", "sup"]]},
    {"t": "rect", "a": {"x": "1180.00", "y": "365.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "1204.00", "y1": "365.00", "x2": "1204.00", "y2": "485.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1228.00", "y1": "365.00", "x2": "1228.00", "y2": "485.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1252.00", "y1": "365.00", "x2": "1252.00", "y2": "485.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1276.00", "y1": "365.00", "x2": "1276.00", "y2": "485.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1180.00", "y1": "389.00", "x2": "1300.00", "y2": "389.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1180.00", "y1": "413.00", "x2": "1300.00", "y2": "413.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1180.00", "y1": "437.00", "x2": "1300.00", "y2": "437.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1180.00", "y1": "461.00", "x2": "1300.00", "y2": "461.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1180.00", "y": "365.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "1190.00", "y": "375.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "1214.00", "y1": "375.00", "x2": "1214.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1238.00", "y1": "375.00", "x2": "1238.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1262.00", "y1": "375.00", "x2": "1262.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1286.00", "y1": "375.00", "x2": "1286.00", "y2": "495.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "399.00", "x2": "1310.00", "y2": "399.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "423.00", "x2": "1310.00", "y2": "423.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "447.00", "x2": "1310.00", "y2": "447.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "471.00", "x2": "1310.00", "y2": "471.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1190.00", "y": "375.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "1200.00", "y": "385.00", "width": "120.00", "height": "120.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "1224.00", "y1": "385.00", "x2": "1224.00", "y2": "505.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1248.00", "y1": "385.00", "x2": "1248.00", "y2": "505.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1272.00", "y1": "385.00", "x2": "1272.00", "y2": "505.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1296.00", "y1": "385.00", "x2": "1296.00", "y2": "505.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "409.00", "x2": "1320.00", "y2": "409.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "433.00", "x2": "1320.00", "y2": "433.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "457.00", "x2": "1320.00", "y2": "457.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "481.00", "x2": "1320.00", "y2": "481.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1200.00", "y": "385.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "1210.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "1234.00", "y1": "395.00", "x2": "1234.00", "y2": "515.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1258.00", "y1": "395.00", "x2": "1258.00", "y2": "515.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1282.00", "y1": "395.00", "x2": "1282.00", "y2": "515.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1306.00", "y1": "395.00", "x2": "1306.00", "y2": "515.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "419.00", "x2": "1330.00", "y2": "419.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "443.00", "x2": "1330.00", "y2": "443.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "467.00", "x2": "1330.00", "y2": "467.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "491.00", "x2": "1330.00", "y2": "491.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1210.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "path", "a": {"d": "M792.0,455.0 L1168.0,455.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "text", "a": {"x": "1173.01", "y": "312.00", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Decoder input"},
    {"t": "math", "name": "shapeDI", "x": 1197.87, "y": 350.0, "size": 22, "parts": [["ℝ", ""], ["B,2D,X,Y", "sup"]]},
    {"t": "path", "a": {"d": "M1342.0,455.0 L1430.0,455.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "polygon", "a": {"points": "1440.00,403.00 1580.00,355.00 1580.00,555.00 1440.00,507.00", "fill": "#E7DFCB", "stroke": "#3a3a3a", "stroke-width": "2.5", "stroke-linejoin": "round"}},
    {"t": "text", "a": {"x": "1510.00", "y": "463.64", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "middle"}, "s": "Decoder"},
    {"t": "rect", "a": {"x": "1664.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "#FDFCF8"}},
    {"t": "line", "a": {"x1": "1688.00", "y1": "395.00", "x2": "1688.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1712.00", "y1": "395.00", "x2": "1712.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1736.00", "y1": "395.00", "x2": "1736.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1760.00", "y1": "395.00", "x2": "1760.00", "y2": "515.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1664.00", "y1": "419.00", "x2": "1784.00", "y2": "419.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1664.00", "y1": "443.00", "x2": "1784.00", "y2": "443.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1664.00", "y1": "467.00", "x2": "1784.00", "y2": "467.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1664.00", "y1": "491.00", "x2": "1784.00", "y2": "491.00", "stroke": "#3a3a3a", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1664.00", "y": "395.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#3a3a3a", "stroke-width": "2.2"}},
    {"t": "path", "a": {"d": "M1590.0,455.0 L1652.0,455.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "text", "a": {"x": "1631.07", "y": "312.00", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Prediction"},
    {"t": "math", "name": "pred", "x": 1759.04, "y": 312.0, "size": 26, "parts": [["X", "i"], ["t+1", "i sub"]]},
    {"t": "math", "name": "shapeP", "x": 1670.41, "y": 350.0, "size": 22, "parts": [["ℝ", ""], ["B,C,H,W", "sup"]]},
    {"t": "rect", "a": {"x": "850.00", "y": "604.00", "width": "262.00", "height": "232.00", "fill": "#E7DFCB", "rx": "20"}},
    {"t": "text", "a": {"x": "872.00", "y": "642.00", "font-family": "Inter", "font-size": "22", "font-weight": "600", "fill": "#52514e", "text-anchor": "start"}, "s": "Memory"},
    {"t": "math", "name": "memdim", "x": 1000.37, "y": 642.0, "size": 22, "parts": [["p", "i"], ["m", "i sub"], [" ∈ ", ""], ["ℝ", ""], ["D", "i sup"]]},
    {"t": "rect", "a": {"x": "872.00", "y": "662.00", "width": "168.00", "height": "28.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "900.00", "y1": "662.00", "x2": "900.00", "y2": "690.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "928.00", "y1": "662.00", "x2": "928.00", "y2": "690.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "956.00", "y1": "662.00", "x2": "956.00", "y2": "690.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "984.00", "y1": "662.00", "x2": "984.00", "y2": "690.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1012.00", "y1": "662.00", "x2": "1012.00", "y2": "690.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "872.00", "y": "662.00", "width": "168.00", "height": "28.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "math", "name": "p1", "x": 1052.83, "y": 679.21, "size": 22, "parts": [["p", "i"], ["1", "sub"]]},
    {"t": "rect", "a": {"x": "872.00", "y": "704.00", "width": "168.00", "height": "28.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "900.00", "y1": "704.00", "x2": "900.00", "y2": "732.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "928.00", "y1": "704.00", "x2": "928.00", "y2": "732.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "956.00", "y1": "704.00", "x2": "956.00", "y2": "732.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "984.00", "y1": "704.00", "x2": "984.00", "y2": "732.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1012.00", "y1": "704.00", "x2": "1012.00", "y2": "732.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "872.00", "y": "704.00", "width": "168.00", "height": "28.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "math", "name": "p2", "x": 1052.83, "y": 721.21, "size": 22, "parts": [["p", "i"], ["2", "sub"]]},
    {"t": "circle", "a": {"cx": "956.00", "cy": "750.00", "r": "2.6", "fill": "#2a78d6"}},
    {"t": "circle", "a": {"cx": "956.00", "cy": "760.00", "r": "2.6", "fill": "#2a78d6"}},
    {"t": "circle", "a": {"cx": "956.00", "cy": "770.00", "r": "2.6", "fill": "#2a78d6"}},
    {"t": "rect", "a": {"x": "872.00", "y": "788.00", "width": "168.00", "height": "28.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "900.00", "y1": "788.00", "x2": "900.00", "y2": "816.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "928.00", "y1": "788.00", "x2": "928.00", "y2": "816.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "956.00", "y1": "788.00", "x2": "956.00", "y2": "816.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "984.00", "y1": "788.00", "x2": "984.00", "y2": "816.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1012.00", "y1": "788.00", "x2": "1012.00", "y2": "816.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "872.00", "y": "788.00", "width": "168.00", "height": "28.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "math", "name": "pM", "x": 1052.83, "y": 805.21, "size": 22, "parts": [["p", "i"], ["M", "i sub"]]},
    {"t": "path", "a": {"d": "M720.0,527.0 L720.0,706.0 Q720.0,720.0 734.0,720.0 L838.0,720.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "text", "a": {"x": "704.00", "y": "607.00", "font-family": "Inter", "font-size": "20", "font-weight": "400", "fill": "#52514e", "text-anchor": "end"}, "s": "one query per position"},
    {"t": "math", "name": "qk", "x": 486.61, "y": 637.0, "size": 20, "parts": [["q", "i"], ["k", "i sup"], [" ∈ ", ""], ["ℝ", ""], ["D", "i sup"], [", ", ""], ["k", "i"], [" = 1, … , K", ""]]},
    {"t": "rect", "a": {"x": "1190.00", "y": "640.00", "width": "120.00", "height": "120.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "1214.00", "y1": "640.00", "x2": "1214.00", "y2": "760.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1238.00", "y1": "640.00", "x2": "1238.00", "y2": "760.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1262.00", "y1": "640.00", "x2": "1262.00", "y2": "760.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1286.00", "y1": "640.00", "x2": "1286.00", "y2": "760.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "664.00", "x2": "1310.00", "y2": "664.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "688.00", "x2": "1310.00", "y2": "688.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "712.00", "x2": "1310.00", "y2": "712.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1190.00", "y1": "736.00", "x2": "1310.00", "y2": "736.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1190.00", "y": "640.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "1200.00", "y": "650.00", "width": "120.00", "height": "120.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "1224.00", "y1": "650.00", "x2": "1224.00", "y2": "770.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1248.00", "y1": "650.00", "x2": "1248.00", "y2": "770.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1272.00", "y1": "650.00", "x2": "1272.00", "y2": "770.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1296.00", "y1": "650.00", "x2": "1296.00", "y2": "770.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "674.00", "x2": "1320.00", "y2": "674.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "698.00", "x2": "1320.00", "y2": "698.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "722.00", "x2": "1320.00", "y2": "722.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1200.00", "y1": "746.00", "x2": "1320.00", "y2": "746.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1200.00", "y": "650.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "rect", "a": {"x": "1210.00", "y": "660.00", "width": "120.00", "height": "120.00", "fill": "#cde2fb"}},
    {"t": "line", "a": {"x1": "1234.00", "y1": "660.00", "x2": "1234.00", "y2": "780.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1258.00", "y1": "660.00", "x2": "1258.00", "y2": "780.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1282.00", "y1": "660.00", "x2": "1282.00", "y2": "780.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1306.00", "y1": "660.00", "x2": "1306.00", "y2": "780.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "684.00", "x2": "1330.00", "y2": "684.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "708.00", "x2": "1330.00", "y2": "708.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "732.00", "x2": "1330.00", "y2": "732.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "line", "a": {"x1": "1210.00", "y1": "756.00", "x2": "1330.00", "y2": "756.00", "stroke": "#2a78d6", "stroke-width": "1.2", "stroke-linecap": "butt"}},
    {"t": "rect", "a": {"x": "1210.00", "y": "660.00", "width": "120.00", "height": "120.00", "fill": "none", "stroke": "#2a78d6", "stroke-width": "2.2"}},
    {"t": "path", "a": {"d": "M1124.0,720.0 L1178.0,720.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "text", "a": {"x": "1151.00", "y": "706.00", "font-family": "Inter", "font-size": "20", "font-weight": "500", "fill": "#52514e", "text-anchor": "middle"}, "s": "read"},
    {"t": "path", "a": {"d": "M1270.0,628.0 L1270.0,527.0", "stroke": "#3a3a3a", "stroke-width": "2.5", "fill": "none", "stroke-linejoin": "round", "stroke-linecap": "round", "marker-end": "url(#mnad-ah)"}},
    {"t": "text", "a": {"x": "1284.00", "y": "584.50", "font-family": "Inter", "font-size": "20", "font-weight": "400", "fill": "#52514e", "text-anchor": "start"}, "s": "concatenate"},
    {"t": "text", "a": {"x": "1354.00", "y": "714.00", "font-family": "Inter", "font-size": "24", "font-weight": "600", "fill": "#111111", "text-anchor": "start"}, "s": "Read"},
    {"t": "math", "name": "phat", "x": 1423.44, "y": 714.0, "size": 26, "parts": [["p̂", "i"]]},
    {"t": "math", "name": "shapeR", "x": 1354.0, "y": 752.0, "size": 22, "parts": [["ℝ", ""], ["B,D,X,Y", "sup"]]}
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

  function drawMnad(svg) {
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

  L.register('mnad-architecture', { size: [W, H], draw: drawMnad });
})();
