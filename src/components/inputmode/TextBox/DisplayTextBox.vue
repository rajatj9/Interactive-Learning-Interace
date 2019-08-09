<template>
  <div class="display-text-box-wrapper">
    <div class="display-text-box-text"> Answer</div>
    <div class="display-text-box-content" v-if="answer">
      {{ answer }}
    </div>
    <div class="display-empty-text-box" v-if="!answer">
      Null
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DisplayTextBox',
    props: {
      answer: {
        required: false
      }
    }
  }
</script>

<style scoped>
  .display-text-box-wrapper {
    padding: 0 1.25rem;
    text-align: left;
  }

  .display-text-box-text {
    color: #4e8fdf;
    font-weight: 600;
  }

  .display-text-box-content {
    margin-top: 0.16rem;
    font-weight: 400;
    color: #587ca0;
    width: 100%;
    word-break: break-all;
  }

  .display-empty-text-box {
    margin-top: 0.16rem;
    font-weight: 400;
    color: #E24A5E;
  }
</style>