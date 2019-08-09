<template>
  <div class="thanks-page">
    <message-page :title="'Thank you !'"
                  :subTitle="'Answer successfully submitted'"></message-page>
  </div>
</template>

<script>
  import Message from '../components/message/Message.vue';

  export default {
    name: "ThankYou",
    components: {
      messagePage: Message
    }
  }
</script>

<style scoped>
  .thanks-page {
    height: 100%;
    width: 100%;
  }

</style>