<template>
  <warning-modal class="rotation-warning-modal"
                 :description="'Please rotate your device.'"
                 @response="confirmRotate()"></warning-modal>
</template>

<script>
  import WarningModal from './WarningModal.vue';

  export default {
    name: "RotationWarning",
    methods: {
      confirmRotate() {
        this.$store.dispatch('setRotateWarning', false);
      }
    },
    components: {
      warningModal: WarningModal
    }
  }
</script>

<style>
  .rotation-warning-modal {
    top: -6rem !important;
    left: -6rem !important;
    width: calc(100% + 12rem) !important;
    height: calc(100% + 12rem) !important;
  }
</style>