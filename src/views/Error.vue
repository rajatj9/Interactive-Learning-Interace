<template>
  <div class="error-page">
    <message-page :title="'404'"
                  :subTitle="'Oops, page not found !'"></message-page>
  </div>
</template>

<script>
  import Message from '../components/message/Message.vue';

  export default {
    name: "Error",
    components: {
      messagePage: Message,
    }
  }
</script>

<style scoped>
  .error-page {
    height: 100%;
    width: 100%;
  }

</style>