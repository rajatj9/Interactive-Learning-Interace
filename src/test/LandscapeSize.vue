<template>
  <div class="test-page landscape-orientation">
    <div class="view" :style="viewStyle">
      <ul>
        <li>ElementWidth: {{ elementWidth }}</li>
        <li>WindowWidth: {{ windowWidth }}</li>
        <li>BodyWidth: {{ bodyWidth }}</li>
        <li>ElementHeight: {{ elementHeight }}</li>
        <li>WindowHeight: {{ windowHeight }}</li>
        <li>BodyHeight: {{ bodyHeight }}</li>
        <li>Browser: <span>{{ appBrowser }}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {sizeMixin} from '../mixins/test/testSizeMixin';

  export default {
    name: "LandscapeSize",
    mixins: [sizeMixin],
    computed: {
      viewStyle() {
        if (window.matchMedia("(orientation: portrait)").matches) {
          return {
            width: this.height + "px",
            height: this.width + "px"
          }
        }
        else {
          return {
            width: this.width + "px",
            height: this.height + "px"
          }
        }
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/CSS/orientation.css");

  .test-page {
    background: beige;
    height: 100%;
    width: 100%;
  }

  .view {
    background: rgba(255, 165, 0, 0.5);
  }
</style>