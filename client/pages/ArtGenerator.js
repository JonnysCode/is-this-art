import React, { useState, useEffect } from 'react';


const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
const Line = Struct('id', 'x1', 'y1', 'x2', 'y2', 'color', 'width')

const size = 256
const padding = 24
const nrLines = 8

const bgColor = RGBAtoString([0, 0, 0, 1.0])
const textColor = RGBAtoString([255, 255, 255, 0.8])

const textLength = size - 2 * padding

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

function randomPoint(imgSize, padding) {
  return Math.floor(Math.random() * (imgSize - 2 * padding)) + padding;
}

function startingColor() {
  return HSVtoRGB(Math.random(), [0.6, 0.8, 1, 1].random(), [1, 1, 0.9, 0.8].random());
}

function endingColor(startColor) {
  let hsv = RGBtoHSV(startColor[0], startColor[1], startColor[2]);

  let h = randomWithMargin(hsv[0], 0.25)
  let s = Math.max(0.2, hsv[1] - [-0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4].random())
  let v = 1

  return HSVtoRGB(h, s, v)
}

function randomWithMargin(compare, margin) {
  let rand = Math.random()
  while (Math.abs(rand - compare) < margin || Math.abs(rand - compare) > (1 - margin)) {
    rand = Math.random()
  }
  return rand 
}

function randomColor() {
  return HSVtoRGB(Math.random(), 1, 1);
}

function HSVtoRGB(h, s, v) {
  let r, g, b, i, f, p, q, t;

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

function RGBtoHSV(r, g, b) {
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

  switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return [h, s, v];
}

function RGBtoString(rgb) {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ", 0.85)"
}

function RGBAtoString(rgb) {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + rgb[3] + ")"
}

function interpolate(startColor, endColor, factor) {
  let rgb = [];
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.trunc(factor * endColor[i] + (1 - factor) * startColor[i])
  }
  return rgb;
}

function generateArt(answer) {

  const startColor = startingColor()
  const endColor = endingColor(startColor)

  let xValues = []
  let yValues = []

  for (let i = 0; i < nrLines; i++) {
    xValues[i] = randomPoint(size, padding)
    yValues[i] = randomPoint(size, padding)
  }

  let minX = Math.min(...xValues)
  let maxX = Math.max(...xValues)
  let minY = Math.min(...yValues)
  let maxY = Math.max(...yValues)


  let deltaX = ((size - maxX) - minX) / 2
  let deltaY = ((size - maxY) - minY) / 2

  let lines = []
  for (let i = 0; i < nrLines; i++) {

    let startX = xValues[i] + deltaX
    let startY = yValues[i] + deltaY
    let endX = xValues[(i+1) % nrLines] + deltaX
    let endY = yValues[(i+1) % nrLines] + deltaY

    let color = interpolate(startColor, endColor, i / nrLines)

    lines[i] = Line(
      i, startX, startY, endX, endY, RGBtoString(color), (i+1) * 2
    )
  }

  const svgState = {
    size: size,
    bgColor: bgColor,
    answer: answer, 
    textColor: RGBAtoString([...startColor, 0.8]),
    textLength: textLength,
    lines: lines,
  }

  return svgState
}


const ArtGenerator = (props) => {
  const [svgState, setSvgState] = useState({
    size: size,
    bgColor: bgColor,
    answer: "", 
    textColor: textColor,
    textLength: textLength,
    lines: [],
  });

  useEffect(() => {
    let state = generateArt(props.answer);
    setSvgState(state);
  }, []);

  console.log(svgState.lines)

  return (
    <svg height={svgState.size} width={svgState.size} xmlns='http://www.w3.org/2000/svg' >

      <rect width={svgState.size} height={svgState.size} style={{fill: svgState.bgColor}} />

      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={svgState.textColor} 
            fontFamily="Verdana" fontSize="36" fontWeight="bold">
        {svgState.answer}
      </text> 

      {svgState.lines.map((line) => 
        <line key={line.id} 
              x1={line.x1} y1={line.y1} 
              x2={line.x2} y2={line.y2} 
              style={{ stroke: line.color, strokeWidth: line.width }} /> 
      )}

    </svg>
  )
}

export default ArtGenerator