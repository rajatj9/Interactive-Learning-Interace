<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" id="modalContainer" ref="modalContainer">

          <div class="dummy"></div>
          <div class="terms-wrapper" id="termsWrapper">
            <div class="terms-container">
              <h3 class="text-center terms-header" id="terms-header">Terms and Conditions</h3>
              <div class="terms-panel" id="termsPanel"
                   :style="{height: termsPanelHeight + 'px' }">
                <ol class="order-list">
                  <li>
                    This survey is a part of a research project seeking to understand and support the development of
                    students’ interest in their Common Core classes. Participation is voluntary and you can withdraw
                    at any time <u>without any negative consequences</u>.
                  </li>
                  <li>
                    If you choose to participate, please input your student number for identification purposes. Your
                    student number will be used to match your survey reports together. It will not be used for any other
                    purpose. Once this operation is complete, following the completion of all the surveys for this
                    course,
                    your student number will be replaced with an anonymous identifier.
                  </li>
                  <li>
                    You will be asked to complete a 4 question survey twice this class regarding your interest in the
                    subject of study and the course. If time permits you might be asked to answer a 10-item survey.
                    Subsequent surveys during the course will ask about your interest in the course tasks, they will be
                    3 or 4 questions in length and take less than 1 minute to complete. The number of short task surveys
                    will depend on the instructor, but between 6 and 12 times can be expected.
                  </li>
                  <li>
                    While your participation in this research will be of significant assistance to understanding
                    interest
                    development in University courses, if you do not opt into the project by clicking the “consent to
                    participate” at the bottom of the page, you will not be included this research.
                  </li>
                  <li>
                    If you choose to participate, your instructor will at no time have access to identifiable
                    information
                    from what you report here.
                  </li>
                  <li>
                    Your survey reports will in no manner have any effect on your course grades.
                  </li>
                  <li>
                    If you have any questions about the current research, please feel free to contact Associate
                    Professor
                    Luke Fryer (TEL: 3917 4774 EMAIL: fryer@hku.hk).
                  </li>
                  <li>
                    For any ethical concerns regarding current study and/or your participation, please feel free to
                    contact
                    the Human Research Ethics Committee, the University of Hong Kong (2241-5267) [HREC Reference Number:
                    EA1608028].
                  </li>
                </ol>
              </div>
              <hr class="horizontal-line" id="horizontal-line">

              <div id="terms-footer" class="terms-footer" ref="termsFooter">

                <div class="form-check terms-accepted">
                  <label>
                    <div class="checkbox-wrapper">
                      <input type="checkbox" name="check" v-model="checked" @input="$v.checked.$touch()">
                      <span class="label-text"></span>
                    </div>

                    <div class="terms-accepted-text">I agree to the Terms and Conditions.</div>
                  </label>
                </div>

                <button class="btn btn-primary btn-confirm btn-terms"
                        :disabled="$v.$invalid"
                        @click="$emit('accept')">Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'

  export default {
    name: "Terms",
    data() {
      return {
        checked: false,
        termsPanelHeight: 0
      }
    },
    validations: {
      checked: {
        required
      }
    },
    methods: {
      footerHeight() {
        // TODO : test the height when window size is changing on mobile
        console.log("footerHeight")
        if (document.getElementById('termsPanel')) {
          let pos_y = document.getElementById('termsPanel').getBoundingClientRect().top
              - document.getElementById('modalContainer').getBoundingClientRect().top;
          let termHeight = this.$refs.modalContainer.clientHeight * 0.96 - pos_y
              - this.$refs.termsFooter.clientHeight - 43;
//
//                console.log(document.getElementById('termsPanel').getBoundingClientRect().top,
//                    document.getElementById('modalContainer').getBoundingClientRect().top,
//                    this.$refs.modalContainer.clientHeight, this.$refs.termsFooter.clientHeight, termHeight)
          this.termsPanelHeight = termHeight;
        }
      }
    },
    mounted() {
      this.footerHeight();
      window.addEventListener('resize', this.footerHeight)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.footerHeight)
    }

  }
</script>

<style>
  @import url("../../assets/CSS/checkbox.css");
  @import url("../../assets/CSS/modal.css");

  .dummy {
    width: 100%;
    height: 12%;
  }

  .terms-wrapper {
    background: url(../../assets/img/bg_terms.png) 0px 0px/100% 100% no-repeat border-box;
    width: 100%;
    height: 88%;
    padding: 0 1.2em;
  }

  .terms-wrapper:before {
    content: "";
    background: url('../../assets/img/logo_GI.png') no-repeat;
    background-size: contain;
    display: block;
    background-position: center;
    height: 16%;
    position: relative;
    top: -8%;
  }

  .terms-container {
    position: relative;
    top: -8%;
  }

  .terms-header {
    font-family: 'Poppins';
    font-size: 18px;
    color: rgba(74, 74, 74, .80);
    font-weight: 500;
    position: relative;
    top: -5%;
  }

  .terms-panel {
    height: calc(40vh);
    overflow-y: auto;
    text-align: left;
    /*margin-top: calc(2vh);*/
  }

  ol.order-list {
    list-style-type: none;
    list-style-type: decimal !ie;
    padding: 0 0.1em;
    counter-reset: li-counter;
  }

  ol.order-list > li {
    text-align: justify;
    /*padding: 1.2em;*/
    margin-bottom: 0.8em;
    font-size: 12px;
    word-wrap: break-word;
    color: rgb(68, 85, 85);
  }

  ol.order-list > li:before {
    position: relative;
    top: 0;
    left: -0.1em;
    width: 0.8em;

    counter-increment: li-counter;
    content: counter(li-counter) ". ";
  }

  hr.horizontal-line {
    border: 0;
    height: 0;
    border-top: 1.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.3);
    /*margin-top: -0.5em;*/
  }

  .terms-footer {
    /*margin-top: -0.3em;*/
  }

  .btn-terms {
    margin: 0;
    font-size: 14px;
  }

  .terms-accepted {
    text-align: left;
    margin-top: -0.7em;
    margin-bottom: 0.85em;
  }

  .checkbox-wrapper {
    margin-left: 0.3em;
    float: left;
  }

  .terms-accepted-text {
    margin-left: 1.8em;
    text-align: left;
    font-size: 14px;
  }

  @media (min-width: 600px) {
    ol.order-list > li {
      font-size: 14px;
    }

    .terms-header {
      font-size: 20px;
    }
  }

  @media (max-width: 325px) {
    .terms-accepted-text {
      margin-left: 1.5em;
      font-size: 12px;
      width: 100%;
    }

    label {
      font-size: 12px;
    }

    /*.checkbox-wrapper{*/
    /*margin-left: 0em;*/
    /*}*/
  }
</style>