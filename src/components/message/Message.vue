<template>
  <div class="message-wrapper">
    <div class="message-container">
      <div class="message-title">{{ title }}</div>
      <div class="message-subtitle">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Message",
    props: {
      title: {
        type: String,
        required: false,
        default: "Message"
      },
      subTitle: {
        type: String,
        required: false,
        default: ""
      }
    }
  }
</script>

<style scoped>
  .message-wrapper {
    height: 100%;
    width: 100%;
    background: url("../../assets/img/message_bg-min.png") no-repeat center;
    display: flex;
    -ms-flex-align: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding-top: 40px;
    padding-bottom: 40px;
    z-index: 10;
  }

  @media screen and (orientation: portrait) {
    .message-wrapper {
      background-size: 300% auto;
    }
  }

  @media screen and (orientation: landscape) {
    .message-wrapper {
      background-size: auto 120%;
    }
  }

  .message-container {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
  }

  .message-title {
    font-size: 36px;
    font-weight: bold;
    /*text-transform: uppercase;*/
    /*background: linear-gradient(to right, #A66EDF 0%, #4E8FDF 100%);*/
    background: linear-gradient(150deg, #A66EDF -5%, #4E8FDF 105%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: "Poppins", sans-serif;
    text-shadow: 0px 2px 5px rgba(74, 144, 226, 0.65);
  }

  .message-subtitle {
    margin-top: 1rem;
    font-size: 20px;
    color: #9B9B9B;
  }
</style>