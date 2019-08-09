<template>
  <warning-modal :buttonText="'Sign In'"
                 :description="'Invalid username. Please sign in.'"
                 @response="redirectToAuth()"></warning-modal>
</template>

<script>
  import WarningModal from './WarningModal.vue';

  export default {
    name: "InvalidUsername",
    methods: {
      redirectToAuth() {
        this.$router.push({name: "signIn"});
      }
    },
    components: {
      warningModal: WarningModal
    }
  }
</script>