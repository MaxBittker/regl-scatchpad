const regl = require("regl")();
const mouse = require("mouse-change")();
const wc = require("./regl-webcam");

var fsh = require("./fragment.glsl");
var vsh = require("./vertex.glsl");

const pixels = regl.texture();
let cam = wc({
  regl,
  done: webcam => {
    const drawFeedback = regl({
      frag: fsh,
      vert: vsh,
      attributes: {
        position: [-2, 0, 0, -2, 2, 2]
      },

      uniforms: {
        webcam,
        resolution: context => [context.viewportWidth, context.viewportHeight],
        texture: pixels,
        mouse: ({ pixelRatio, viewportHeight }) => [
          mouse.x * pixelRatio,
          viewportHeight - mouse.y * pixelRatio
        ],
        t: ({ tick }) => 0.01 * tick
      },
      count: 3
    });

    regl.frame(function() {
      regl.clear({
        color: [0, 0, 0, 1]
      });

      drawFeedback();

      pixels({
        copy: true
      });
    });
  
  
  
  }
});
