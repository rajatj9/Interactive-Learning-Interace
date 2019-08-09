<template>
  <warning-modal :description="'The answer was not submitted. Please submit again.'"
                 :buttonText="'Confirm'"
                 @response="confirmResubmit()"></warning-modal>
</template>

<script>
  import WarningModal from './WarningModal.vue';

  export default {
    name: "FailedSubmit",
    methods: {
      confirmResubmit() {
        this.$emit('response', true)
      }
    },
    components: {
      warningModal: WarningModal
    }
  }
</script>