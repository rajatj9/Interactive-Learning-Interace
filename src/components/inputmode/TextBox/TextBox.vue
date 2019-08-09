<template>
  <div class="text-box-wrapper">
    <div class="validate-remind-text" :class="{'validate-error-text': $v.value.$invalid }">
      (No more than 500 characters).
    </div>
    <div class="text-box-container">
            <textarea class="text-box-content" v-model="value" ref="textbox"
                      :class="{'text-box-error-warning': $v.value.$invalid }"></textarea>
    </div>
  </div>
</template>

<script>
  import {maxLength} from 'vuelidate/lib/validators';
  import {mapGetters} from 'vuex';

  export default {
    name: 'TextBox',
    props: {
      id: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      },
      width: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        value: '',
        scrollTop: 0,
        buttonElem: null
      }
    },
    computed: {
      ...mapGetters({
        isIOS: 'isIOS'
      })
    },
    validations: {
      value: {
        maxLength: maxLength(500)
      }
    },
    methods: {
      setScrollTop() {
        this.scrollTop = this.$refs.textbox.getBoundingClientRect().top;
      },
      enableScroll(event) {
        event.stopPropagation();
      },
      handleIOSFocusIn() {
        var vm = this;
        vm.$refs.textbox.addEventListener('touchmove', this.enableScroll);
        setTimeout(function () {
          window.scrollTo(0, vm.scrollTop)
        }, 250)
      },
      handleIOSFocusOut() {
        this.$refs.textbox.removeEventListener('touchmove', this.enableScroll);
        window.scrollTo(0, 0);
        let vm = this;
        setTimeout(() => {
          vm.$emit('resize', true);
        }, 200);
      },
    },
    watch: {
      value(val) {
        if (val.length <= 500) {
          this.$store.dispatch('updateAnswerById', {
            id: this.id,
            value: val
          })
        }
      },
      width() {
        if (this.isIOS) {
          this.setScrollTop();
        }
      },
      height() {
        if (this.isIOS) {
          this.setScrollTop();
        }
        else {
          if (window.matchMedia("(orientation: landscape)").matches) {
            if (this.buttonElem.getBoundingClientRect().top <= window.innerHeight * 2 / 3) {
              this.buttonElem.style["z-index"] = -1;
              this.buttonElem.style.opacity = 0;
            }
            else {
              if (this.buttonElem.style.opacity == 0) {
                var vm = this;
                setTimeout(function () {
                  vm.buttonElem.style["z-index"] = 0;
                  vm.buttonElem.style.opacity = 1;
                }, 100);
              }
            }
          }
        }
      }
    },
    mounted() {
      if (this.$store.getters.getAnswerValueById(this.id)) {
        this.value = this.$store.getters.getAnswerValueById(this.id);
      }
      if (this.isIOS) {
        this.setScrollTop();
//            this.$refs.textbox.addEventListener('touchmove', this.enableScroll);
        document.addEventListener('focusin', this.handleIOSFocusIn);
        document.addEventListener('focusout', this.handleIOSFocusOut);
      }
      else {
        this.buttonElem = document.getElementById('order-btn-wrapper') ?
            document.getElementById('order-btn-wrapper') : document.getElementById('edit-btn-wrapper');
      }
    },
    beforeDestroy() {
      if (this.isIOS) {
//            this.$refs.textbox.removeEventListener('touchmove', this.enableScroll);
        document.removeEventListener('focusin', this.handleIOSFocusIn);
        document.removeEventListener('focusout', this.handleIOSFocusOut);
      }
    }
  }
</script>

<style scoped>
  .validate-remind-text {
    text-align: left;
    font-weight: 300;
    color: #4e8fdf;
  }

  .validate-error-text {
    color: #E24A5E;
  }

  .text-box-container {
    width: 100%;
    height: calc(100% - 20px);
    min-height: 6em !important;
    padding: 0.2rem 0 0.5rem;
  }

  .text-box-content {
    width: 100%;
    height: 100%;
    -webkit-box-shadow: 0 3px 20px 0 rgba(113, 106, 202, .11);
    box-shadow: 0 3px 20px 0 rgba(113, 106, 202, .11);
    color: #575962;
    border-radius: .25rem;
    display: block;
    padding: .85rem;
    font-size: 1em;
    line-height: 1.25;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    overflow: auto;
    /*resize: vertical;*/
    resize: none;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .text-box-content:focus {
    border-color: #4e8fdf;
    outline: rgba(78, 143, 223, 0.50);
    color: #575962 !important;
    -webkit-box-shadow: 0 3px 20px 0 rgba(113, 106, 202, .11) !important;
    box-shadow: 0 3px 20px 0 rgba(113, 106, 202, .11) !important;
  }

  .text-box-error-warning {
    border: 1px #E24A5E solid;
  }

  .text-box-error-warning:focus {
    border: 2px #E24A5E solid;
    outline: rebeccapurple;
  }
</style>