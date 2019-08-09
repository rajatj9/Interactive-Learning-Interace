<template>
  <div class="test-page portrait-orientation">
    <div class="view" :style="viewStyle">
      <ul>
        <li>ElementWidth: {{ elementWidth }}</li>
        <li>WindowWidth: {{ windowWidth }}</li>
        <li>BodyWidth: {{ bodyWidth }}</li>
        <li>ElementHeight: {{ elementHeight }}</li>
        <li>WindowHeight: {{ windowHeight }}</li>
        <li>BodyHeight: {{ bodyHeight }}</li>
        <li>Browser:
          <pre>{{ appBrowser }}</pre>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {sizeMixin} from '../mixins/test/testSizeMixin';

  export default {
    name: "PortraitSize",
    mixins: [sizeMixin],
    computed: {
      viewStyle() {
        if (window.matchMedia("(orientation: portrait)").matches) {
          return {
            width: this.width + "px",
            height: this.height + "px"
          }
        }
        else {
          return {
            width: this.height + "px",
            height: this.width + "px"
          }
        }
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/CSS/orientation.css");

  .test-page {
    background: lightsteelblue;
    height: 100%;
    width: 100%;
  }

  .view {
    background: lightcyan;
  }
</style>