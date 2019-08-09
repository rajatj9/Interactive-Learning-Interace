<template>
  <div class="scale-wrapper likert-wrapper">
    <div class="likert-container">
      <ul class="likert-content">
        <li class="likert-item-wrapper" :style="itemEvenWidthStyle"
            v-for="(item, index) in scale" :key="'li'+index" :for="getRadioId(index)">
          <label class="likert-radio-item-content mt-radio nowrap"
                 :style="itemLabelStyle(item)"
                 :for="getRadioId(item.sequence)">
            <input type="radio" class="likert-radio-item"
                   :name="'question_' + id"
                   @change="update" :key="getRadioId(index)"
                   :value="item.sequence" v-model="value"
                   :id="getRadioId(item.sequence)">
            <i class="likert-sequence"> {{ item.sequence}} </i>
            <span class="likert-span"></span>
            {{ item.title }}
          </label>
        </li>

      </ul>
    </div>

  </div>
</template>

<script>
  import {inputScaleMixin} from '@/mixins/inputScale';
  import {choiceInputMixin} from './choiceInput';

  export default {
    name: 'Likert',
    mixins: [inputScaleMixin, choiceInputMixin],
    computed: {
      itemEvenWidthStyle() {
        return {
          "max-width": Math.floor(10000 / this.scale.length) * 0.01 + "%"
        }
      }
    },
    methods: {
      itemLabelStyle(item) {
        return item.sequence === this.value ? {
          'color': '#424242',
          'font-weight': 900
        } : {
          'color': '#76757F'
        }
      }
    },
    mounted() {
      if (this.$store.getters.getAnswerValueById(this.id)) {
        this.value = this.$store.getters.getAnswerValueById(this.id);
      }
    }
  }
</script>

<style>
  .nowrap {
    white-space: nowrap;
  }

  .likert-sequence {
    padding-bottom: 0.5rem;
    display: block;
    font-style: normal;
  }

  .likert-wrapper {
    padding: 0;
    /*overflow-y: auto;*/
    position: relative;
    display: inline-table;
    width: 100%;
  }

  .likert-container {
    vertical-align: middle;
    display: table-cell;
  }

  ul.likert-content {
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

  ul.likert-content > li {
    list-style-type: none;
    float: left;
    /*width: 50%;*/
    text-align: left;
    width: calc(100% / 2 - 5px);
    /*display: -webkit-grid;*/
    /*display: -ms-flexbox;*/
    display: grid;
    /*min-width: 50%;*/
    /*max-width: 16%;*/
    word-break: break-word;
  }

  .likert-radio-item-wrapper {
    padding: 1rem 1.4rem;

  }

  .likert-radio-item-content {
    /*background: rgba(162, 109, 223, 0.05);*/
    border-radius: 0.8rem;
    margin: 0.2rem 0.5rem;
    padding: 1.5rem 1rem;
    width: 100%;
    height: 100%;
  }

  .mt-radio {
    display: inline-block;
    position: relative;
    /*padding-left: 4.5rem;*/
    /*margin-bottom: 10px;*/
    cursor: pointer;
    -webkit-transition: all .3s;
    transition: all .3s;
    font-weight: normal;
    text-align: center;
    margin: auto;
  }

  .likert-radio-item {
    display: none;
  }

  .mt-radio > input:checked ~ span {
    border: 2px solid currentColor;
  }

  .m-checkbox:hover > input:not([disabled]):checked ~ span,
  .m-checkbox > input:checked ~ span,
  .mt-radio:hover > input:not([disabled]):checked ~ span,
  .mt-radio > input:checked ~ span {
    -webkit-transition: all .3s;
    transition: all .3s;
  }

  .m-checkbox > input:checked ~ span, .mt-radio > input:checked ~ span {
    -webkit-transition: all .3s;
    transition: all .3s;
    background: 0 0;
  }

  .mt-radio > span {
    border: 1px solid #dddddd;
  }

  .mt-radio > span {
    border-radius: 50% !important;
  }

  .m-checkbox > span, .mt-radio > span {
    border-radius: 3px;
    /*background: currentColor 0;*/
    /*position: absolute;*/
    top: 1.2rem;
    left: 1rem;
    height: 2.4rem;
    width: 2.4rem;
    margin-bottom: 1rem;
    border: 2px solid currentColor;
  }

  .m-checkbox > input:checked ~ span:after, .mt-radio > input:checked ~ span:after {
    display: block;
  }

  .mt-radio > span:after {
    border: solid currentColor;
    background: currentColor;
    transition: all 25ms cubic-bezier(.4, .25, .3, 1);
    /*transform: translate(-50%, 50%);*/
  }

  .mt-radio > span:after {
    top: 50%;
    left: 50%;
    margin-left: -0.7rem;
    margin-top: -0.7rem;
    height: 1.4rem;
    width: 1.4rem;
    border-radius: 100% !important;
  }

  .m-checkbox > span:after, .mt-radio > span:after {
    content: '';
    /*position: absolute;*/
    display: none;
    position: relative;
  }

  .likert-span {
    margin: auto;
    display: block !important;
    transition: all 25ms cubic-bezier(.4, .25, .3, 1) !important;
    /*transform: translate(-50%, 50%);*/
  }
</style>
