<template>
  <div id="app">
    <network-error-modal v-if="appNetworkError"></network-error-modal>
    <rotation-warning-modal v-if="appRotateWarning"></rotation-warning-modal>
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import NetworkError from './components/modal/NetworkError.vue';
  import RotationWarning from './components/modal/RotationWarning.vue';

  export default {
    name: 'app',
    computed: {
      ...mapGetters({
        appNetworkError: "appNetworkError",
        appRotateWarning: "appRotateWarning"
      }),
    },
    components: {
      NetworkErrorModal: NetworkError,
      RotationWarningModal: RotationWarning
    }
  }
</script>

<style lang="scss">
  @import "/assets/CSS/font";
  @import "/assets/CSS/button";

  html, body {
    height: 100%;
    width: 100%;
    /*overflow: hidden;*/
  }

  div#app {
    height: 100%;
    margin-top: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }

</style>
