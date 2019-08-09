<template>
  <div class="touch-tips-wrapper" ref="tips-modal">
    <div class="touch-tips-container" :style="containerStyle">
      <ul class="touch-tip-content tips-content row" :style="contentStyle">
        <li><img src="@/assets/img/point_03.png"
                 class="touch-tips-image" alt="finger tips"></li>
        <li><p class="tips-text"> {{ text }} </p></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TouchTips',
    props: {
      width: {
        type: Number,
        required: false,
        default: 300
      },
      top: {
        type: Number,
        required: false
      },
      text: {
        type: String,
        required: false,
        default: "TOUCH SCREEN TO BEGIN"
      }
    },
    methods: {
      hiddenTips() {
        console.log("touch");
        this.$emit('touch', false);
      }
    },
    computed: {
      containerStyle() {
        return {
          'max-width': this.width + 'px',
        }
      },
      contentStyle() {
        return this.top ? {
          'top': this.top + 'px'
        } : {}
      }
    },
    mounted() {
      this.$refs["tips-modal"].addEventListener("touchstart", this.hiddenTips, false);
    },
    beforeDestroy() {
      this.$refs["tips-modal"].removeEventListener("touchstart", this.hiddenTips);
    }
  }
</script>

<style>
  .touch-tips-wrapper {
    /*background-color: rgba(227, 0, 0, 0.4);*/
    background-color: rgba(255, 255, 255, 0);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }

  .touch-tips-container {
    /*border: 3px black solid;*/
    max-width: 20rem;
    width: auto;
    height: 100%;
    margin: auto;
  }

  .touch-tip-content {
    position: relative;
    margin: 0 auto;
  }

  .touch-tips-image {
    max-width: 8rem;
    display: inline-block;
    -webkit-filter: drop-shadow(0px 0px 4px rgb(155, 155, 155));
    filter: drop-shadow(0px 0px 4px rgb(155, 155, 155));
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  }

  .tips-text {
    color: rgb(75, 75, 75);
    vertical-align: middle;
    font-size: 1.5em;
    margin-left: -10%;
    font-weight: 600;
  }

  .tips-content {
    list-style: none;
    overflow: hidden;
    padding: 0;
    /*background: aliceblue;*/
    width: fit-content;
    margin: 0 auto;
  }

  .tips-content li {
    float: left;
  }
</style>