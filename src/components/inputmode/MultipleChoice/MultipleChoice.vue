<template>
  <div class="scale-wrapper multiple-choice-wrapper" ref="multipleChoice" :style="optionsContainerStyle">
    <div class="image-wrapper" v-if="image">
      <img class="title-image" v-bind:src="image"/>
    </div>
    <ul class="multiple-choice-question-container">
      <li v-for="(item, index) in scale" :key="getRadioId(index)">
        <div class="radio-item-wrapper">
          <label class="radio-item-container m-radio" :for="getRadioId(item.sequence)"
                 :class="{ 'radio-item-container-selected': (item.sequence == value) }">
            <input type="radio" class="radio-item" :name="'question_' + id"
                   @change="update" :key="getRadioId(index)"
                   :value="item.sequence" v-model="value"
                   :id="getRadioId(item.sequence)">
            {{ item.title }}
            <span></span>
          </label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {inputScaleMixin} from '@/mixins/inputScale';
  import {multipleChoiceMixin} from './multipleChoice';
  import {choiceInputMixin} from './choiceInput';

  export default {
    name: 'MultipleChoice',
    mixins: [inputScaleMixin, multipleChoiceMixin, choiceInputMixin],
    mounted() {
      if (this.$store.getters.getAnswerValueById(this.id)) {
        this.value = this.$store.getters.getAnswerValueById(this.id);
      }
      if (this.isIOS) {
        this.$refs.multipleChoice.addEventListener('touchmove', this.enableScroll);
      }
    },
    beforeDestroy() {
      if (this.isIOS) {
        this.$refs.multipleChoice.removeEventListener('touchmove', this.enableScroll);
      }
    }
  }
</script>

<style>
  .multiple-choice-wrapper {
    padding: 0 2rem;
    overflow-y: auto;
  }

  ul.multiple-choice-question-container {
    padding: 0;
    margin-top: 1.2rem;
    overflow: hidden;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  ul.multiple-choice-question-container > li {
    list-style-type: none;
    float: left;
    /*width: 50%;*/
    text-align: left;
    width: calc(100% / 2 - 5px);
    /*display: -webkit-grid;*/
    /*display: -ms-flexbox;*/
    display: grid;
    min-width: 50%;
  }

  .radio-item-wrapper {
    padding: 1rem 1.4rem;

  }

  .radio-item-container {
    /*background: rgba(162, 109, 223, 0.05);*/
    border: 2px solid rgba(162, 109, 223, 0.05);
    border-radius: 0.8rem;
    margin: 0.2rem 0.5rem;
    padding: 1.5rem 1rem;
    width: 100%;
    height: 100%;
  }

  .radio-item-container-selected {
    /*background: rgba(83, 141, 223, 0.15);*/
    /*box-shadow: 0 2px 6px 0 rgba(83, 141, 223, 0.15), 0 3px 10px 0 rgba(83, 141, 223, 0.15);*/
    background: rgba(162, 162, 162, 0.05);
    box-shadow: 0 2px 6px 0 rgba(162, 162, 162, 0.05), 0 3px 10px 0 rgba(162, 162, 162, 0.05);
    border: 2px solid rgba(162, 162, 162, 0.05);
  }

  .m-radio {
    display: inline-block;
    position: relative;
    padding-left: 4.5rem;
    /*margin-bottom: 10px;*/
    cursor: pointer;
    -webkit-transition: all .3s;
    transition: all .3s;
    font-weight: normal;
  }

  .radio-item {
    display: none;
  }

  .m-radio > input:checked ~ span {
    /*border: 2px solid #4E8FDF;*/
    border: 2px solid #424242;
  }

  .m-checkbox:hover > input:not([disabled]):checked ~ span, .m-checkbox > input:checked ~ span, .m-radio:hover > input:not([disabled]):checked ~ span, .m-radio > input:checked ~ span {
    -webkit-transition: all .3s;
    transition: all .3s;
  }

  .m-checkbox > input:checked ~ span, .m-radio > input:checked ~ span {
    -webkit-transition: all .3s;
    transition: all .3s;
    background: 0 0;
  }

  .m-radio > span {
    border: 1px solid #dddddd;
  }

  .m-radio > span {
    border-radius: 50% !important;
  }

  .m-checkbox > span, .m-radio > span {
    border-radius: 3px;
    background: #ffffff 0;
    position: absolute;
    top: 1.2rem;
    left: 1rem;
    height: 2.4rem;
    width: 2.4rem;
  }

  .m-checkbox > input:checked ~ span:after, .m-radio > input:checked ~ span:after {
    display: block;
  }

  .m-radio > span:after {
    /*border: solid #4E8FDF;*/
    /*background: #4E8FDF;*/
    border: solid #424242;
    background: #424242;
  }

  .m-radio > span:after {
    top: 50%;
    left: 50%;
    margin-left: -0.7rem;
    margin-top: -0.7rem;
    height: 1.4rem;
    width: 1.4rem;
    border-radius: 100% !important;
  }

  .m-checkbox > span:after, .m-radio > span:after {
    content: '';
    position: absolute;
    display: none;
  }

  .image-wrapper {
    height: 60%;
    margin: 0 auto;
  }

  .title-image {
    height: 100%;
  }

  @media (max-width: 567px) and (orientation: portrait) {
    .portrait-orientation ul.multiple-choice-question-container > li {
      width: 100%;
    }
  }

  @media (max-height: 567px) and (orientation: landscape) {
    .portrait-orientation ul.multiple-choice-question-container > li {
      width: 100%;
    }
  }
</style>