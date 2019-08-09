<template>
  <warning-modal :title="'Network Error'"
                 :description="'Make sure your connection is active  and try again.'"
                 @response="confirm()"></warning-modal>
</template>

<script>
  import WarningModal from './WarningModal.vue';

  export default {
    name: "NetworkError",
    methods: {
      confirm() {
        this.$store.dispatch("removeNetworkError")
      }
    },
    components: {
      warningModal: WarningModal
    }
  }
</script>