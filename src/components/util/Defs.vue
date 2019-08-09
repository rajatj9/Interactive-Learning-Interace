<template>
  <defs>
    <filter id="lineShadow" x="0" y="0" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
      <feOffset dx="0" dy="1" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="rectShadow" x="-1" y="-1" width="400%" height="400%">
      <feOffset result="offOut" in="SourceAlpha" dx="0" dy="-1"/>
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2"/>
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
      <feDropShadow dx="-1" dy="-1.5" stdDeviation="2" flood-color="#EBEDF2" flood-opacity="1"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.4"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="tooltipShadow" x="-1" y="-1" width="400%" height="400%">
      <feOffset result="offOut" in="SourceGraphic" dx="0.5" dy="1"></feOffset>
      <feColorMatrix result="matrixOut" in="offOut" type="matrix"
                     values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"></feColorMatrix>
      <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="1"></feGaussianBlur>
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.4"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="insetShadow">
      <feOffset dx="0" dy="1.5"/>
      <feGaussianBlur stdDeviation="2" result="offset-blur"/>
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
      <feFlood flood-color="white" flood-opacity="0.5" result="color"/>
      <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter v-if="minor" id="baseRectShadow" x="0" y="0" width="400%" height="400%">
      <feOffset result="offOut" in="SourceGraphic" dx="-2" dy="-12"/>
      <feColorMatrix result="matrixOut" in="offOut" type="matrix"
                     values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"/>
      <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="5"/>
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <linearGradient v-if="minor"
                    id="gradientMarkRect" x1="0%" y1="100%" x2="0%" y2="0%" spreadMethod="pad">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"></stop>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1"></stop>
      <!--<stop offset="0%" stop-color="#A66EDF" stop-opacity="0"></stop>-->
      <!--<stop offset="100%" stop-color="#A66EDF" stop-opacity="1"></stop>-->
    </linearGradient>
    <linearGradient v-if="minor"
                    id="baseRect" x1="0%" y1="100%" x2="0%" y2="0%" spreadMethod="pad">
      <stop offset="00%" stop-color="#4A90E2" stop-opacity="0.25"></stop>
      <stop offset="50%" stop-color="#C3DAF5" stop-opacity="0.30"></stop>
      <stop offset="90%" stop-color="#FFFFFF" stop-opacity="0.50"></stop>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.6"></stop>
    </linearGradient>
    <linearGradient v-if="slider" id="gradientSlider">
      <!--<stop offset="5%"  stop-color="#A66EDF"/>-->
      <!--<stop offset="95%" stop-color="#4E8FDF"/>-->
      <stop offset="5%" stop-color="#424242"/>
      <stop offset="95%" stop-color="#212121"/>
    </linearGradient>
    <filter v-if="slider" id="sliderShadow" x="-1" y="-1" width="400%" height="400%">
      <feOffset result="offOut" in="SourceAlpha" dx="1" dy="1"/>
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2"/>
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12"
            viewBox="0 0 12 12" refX="9" refY="3" orient="auto">
      <!--<path d="M0,0 L0,6 L9,3 z" fill="#AE91EE"></path>-->
      <!--<path d="M0,0 L0,6 L9,3 z" fill="#4A90E2"></path>-->
      <path d="M0,0 L0,6 L9,3 z" fill="rgba(27, 5, 55, 0.9)"></path>
    </marker>
  </defs>
</template>

<script>
  export default {
    name: "SVGDefs",
    props: {
      minor: {
        type: Boolean,
        required: false,
        default: false
      },
      slider: {
        type: Boolean,
        required: false,
        default: false
      }
    }
  }
</script>