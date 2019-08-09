<template>
  <transition name="warning-modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="warning-modal-container">
          <div class="warning-modal-header">
            <h4>{{ title }}</h4>
          </div>
          <div class="message-wrapper">
            {{ description }}
          </div>
          <div class="top-border"></div>
          <div class="button-wrapper">
            <a class="btn btn-block btn-accept-warning"
               @click="$emit('response', true)"> {{buttonText}} </a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "WarningModal",
    props: {
      title: {
        type: String,
        required: false,
        default: "Warning Message"
      },
      description: {
        type: String,
        required: false,
        default: ""
      },
      buttonText: {
        type: String,
        required: false,
        default: "OK"
      }
    }
  }
</script>

<style>
  @import url("../../assets/CSS/modal.css");

  .message-wrapper {
    margin: 1rem auto;
    padding: 1rem 2.5rem;
    font-size: 14px;
    margin-bottom: 0;
  }

  .warning-modal-header {
    padding-top: 1.5rem;
  }

  .warning-modal-header h4 {
    font-size: 16px;
    color: #4A4A4A;
    font-family: 'Poppins';
  }

  .button-wrapper {
    display: -webkit-box;
  }

  .top-border {
    width: 100%;
    height: 2px;
    border-width: 1px !important;
    -webkit-border-image: -webkit-gradient(linear, 0 0, 0 100%, from(#4e8fdf), to(#a66cdf)) 1 100%;
    -webkit-border-image: -webkit-linear-gradient(#4e8fdf, #a66cdf) 1 100%;
    -moz-border-image: -moz-linear-gradient(#4e8fdf, #a66cdf) 1 100%;
    -o-border-image: -o-linear-gradient(#4e8fdf, #a66cdf) 1 100%;
    border-image: linear-gradient(to bottom, #4e8fdf, #a66cdf) 1 100%;
    background: linear-gradient(to right, #4e8fdf, #a66cdf);
  }

  .btn-accept-warning.active, .btn-accept-warning:active {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
</style>