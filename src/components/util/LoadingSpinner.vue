<template>
  <div class="loading-page">
    <div :style="styles" class="spinner spinner--rotate-square-2"></div>
    <div class="loading-text">Loading ...</div>
  </div>

</template>

<script>
  export default {
    props: {
      size: {
        default: '40px'
      },
      background: {
        default: '#41b883'
      }
    },
    computed: {
      styles() {
        return {
          width: this.size,
          height: this.size
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .loading-page {
    height: 100%;
    width: 100%;
    display: flex;
    -ms-flex-align: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding-top: 40px;
    padding-bottom: 40px;
    z-index: 10;
  }

  .loading-text {
    margin-top: 8rem;
    font-size: 12px;
    color: #555555;
    font-weight: 500;
  }

  .spinner {
    position: absolute;
    * {
      line-height: 0;
      box-sizing: border-box;
    }
    &:before {
      content: '';
      width: 100%;
      height: 20%;
      min-width: 5px;
      background: #000;
      opacity: 0.1;
      position: absolute;
      bottom: 0%;
      left: 0;
      border-radius: 50%;
      animation: rotate-square-2-shadow .5s linear infinite;
    }
    &:after {
      content: '';
      width: 100%;
      height: 100%;
      /*background: #41b883;*/
      animation: rotate-square-2-animate .5s linear infinite, color-change 4s linear infinite;
      position: absolute;
      bottom: 40%;
      left: 0;
      border-radius: 3px;
    }
  }

  @keyframes color-change {
    0%, 100% {
      background: #4E8FDF;
    }
    50% {
      background: #A66CDF;
    }
  }

  @keyframes rotate-square-2-animate {
    17% {
      border-bottom-right-radius: 3px;
    }
    25% {
      transform: translateY(20%) rotate(22.5deg);
    }
    50% {
      transform: translateY(40%) scale(1, .9) rotate(45deg);
      border-bottom-right-radius: 50%;
    }
    75% {
      transform: translateY(20%) rotate(67.5deg);
    }
    100% {
      transform: translateY(0) rotate(90deg);
    }
  }

  @keyframes rotate-square-2-shadow {
    0%, 100% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.2, 1);
    }
  }
</style>