<template>
  <canvas id="canvas"></canvas>
  <!--style="border: 10px inset brown;"-->
</template>

<script>
  const d3 = Object.assign({}, require("d3-interpolate"));

  export default {
    data: function () {
      return {
        dotsNum: 16,
        radius: {
          min: 3,
          max: 6
        },
        minColor: "#4e8fdf",
        maxColor: "#a66cdf",
        opacity: 0.2,
        moveSpeed: 0.25,
        dots: []
      }
    },
    computed: {
      canvasWidth() {
        return window.innerWidth;
      },
      canvasHeight() {
        return window.innerHeight;
      },
      interpolate() {
        return d3.interpolateRgb(this.minColor, this.maxColor);
      },
      radiusDelta() {
        return this.radius.max - this.radius.min;
      }
    },
    methods: {
      randomColor() {
        return this.interpolate(Math.random()).replace(")", ", " + this.opacity + ")");
      },
      randomRadius() {
        return Math.floor(Math.random() * this.radiusDelta + this.radius.min);
      },
      createDot() {
        return {
          x: Math.random(), // * this.canvasWidth,
          y: Math.random(), // * this.canvasHeight,
          // speed of a dot
          vx: -this.moveSpeed * Math.random(),
          vy: -this.moveSpeed * Math.random(),
          radius: this.randomRadius(),
          color: this.randomColor()
        }
      },
      moveDots() {
        for (let i = 0; i < this.dotsNum; i++) {
          var dot = this.dots[i];
          if (dot.y < 0 || dot.y > 1) {
            // dot.vx = dot.vx;
            dot.vy = -dot.vy;
          }
          else if (dot.x < 0 || dot.x > 1) {
            dot.vx = -dot.vx;
            // dot.vy = dot.vy;
          }
          dot.x += dot.vx / this.canvasWidth;
          dot.y += dot.vy / this.canvasHeight;
        }
      }
    },
    mounted() {
      const canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d');
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      ctx.fillStyle = "rgba(122, 0,0, 0.08)";

      for (let i = 0; i < this.dotsNum; i++) {
        this.dots.push(this.createDot());

      }

      const drawDots = () => {
        for (let i = 0; i < this.dotsNum; i++) {
          let {x, y, radius, color} = this.dots[i];
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(x * this.canvasWidth, y * this.canvasHeight, radius, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
        }
      }

      const animateDots = () => {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.moveDots();
        drawDots();
        requestAnimationFrame(animateDots);
      }

      requestAnimationFrame(animateDots);

      let background = this;
      window.onresize = function () {
        canvas.width = background.canvasWidth;
        canvas.height = background.canvasHeight;
      }
    }

  }

</script>

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -99;
    overflow: hidden;
  }
</style>