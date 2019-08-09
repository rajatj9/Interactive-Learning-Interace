<template>
  <transition name="warning-modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="warning-modal-container">

          <div class="warning-modal-header">
            <h4>Warning Message</h4>
          </div>

          <div class="message-wrapper">
            You haven't answer this question. Are you sure to leave?
          </div>

          <div class="top-border"></div>
          <div class="button-wrapper">
            <div class="btn-container right-border">
              <a class="btn btn-warning-modal btn-warning-cancel-btn"
                 @click="$emit('input', false)">No</a>
            </div>
            <div class="btn-container">
              <a class="btn btn-warning-modal btn-warning-confirm-btn"
                 @click="$emit('input', true)">Yes</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

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

  .btn-container {
    width: 50%;
  }

  .btn-warning-modal {
    width: 100%;
    font-weight: 500;
    color: #4A90E2;
    font-family: 'Poppins';
  }

  .right-border {
    border-right: 2px solid;
    border-left: 0px !important;
    /*border-width: 1px !important;*/
    border-left-width: 0px;
    -webkit-border-image: -webkit-gradient(linear, 0 0, 0 100%, from(#4e8fdf), to(#a66cdf)) 1 100%;
    -webkit-border-image: -webkit-linear-gradient(#4e8fdf, #a66cdf) 1 100%;
    -moz-border-image: -moz-linear-gradient(#4e8fdf, #a66cdf) 1 100%;
    -o-border-image: -o-linear-gradient(#4e8fdf, #a66cdf) 1 100%;
    border-image: linear-gradient(to bottom, #4e8fdf, #a66cdf) 1 100%;
  }
</style>