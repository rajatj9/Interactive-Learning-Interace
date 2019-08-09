<template>
  <div class="display-likert-wrapper">
    <div class="display-image-wrapper" v-if="image">
      <img class="display-title-image" v-bind:src="image"/>
    </div>
    <ul class="display-liker-container">
      <li v-for="(item, index) in scale" :key="index"
          :class="{ 'highlight-style': (item.sequence == answer) }">
                <span :class="{ 'highlight-style': (item.sequence == answer) }">
                    {{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {multipleChoiceMixin} from './multipleChoice';

  export default {
    name: 'DisplayMultipleChoice',
    mixins: [multipleChoiceMixin],
    props: {
      scale: {
        type: Array,
        required: true
      },
      answer: {
        required: false
      }
    }
  }
</script>

<style scoped>
  .highlight-style {
    /*color: #4A90E2 !important;*/
    color: #424242 !important;
    font-weight: 900;
  }

  ul.display-liker-container {
    text-align: left;
    margin: 0.8rem 0 0 0;
  }

  ul.display-liker-container > li {
    padding-left: 0.8rem;
    margin: 0.5rem 1.6rem;
    color: #D8D8D8;
  }

  ul.display-liker-container > li span {
    font-family: "Poppins";
    color: #4A4A4A;
    font-size: 1.4rem;
  }

  .display-likert-wrapper .display-image-wrapper {
    /*width: 50%;*/
    margin: 0 auto;
  }

  .display-likert-wrapper .display-title-image {
    max-width: 85%;
    max-height: 50vh;
  }

  @media screen and (orientation: portrait) {
    .display-likert-wrapper .display-title-image {
      max-height: 48vw;
    }
  }
</style>