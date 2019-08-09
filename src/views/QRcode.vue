<template>
  <div class="qr-code-page qr-code-wrapper">
    <div class="qr-code-container">
      <img class="qr-code-img"
           v-bind:src="generatedQRCode" alt="QR code">
      <div class="qr-code-description">
        Please scan this QR code on your mobile device.
      </div>
    </div>
  </div>
</template>


<script>
  import {mapGetters} from 'vuex';

  export default {
    name: "QRCode",
    computed: {
      ...mapGetters({
        appQRCodeURL: 'appQRCodeURL'
      }),
      generatedQRCode() {
        return "data:image/png;base64, " + this.appQRCodeURL;
      }
    }
  }
</script>

<style scoped>
  .qr-code-page {
    height: 100%;
    width: 100%;
  }

  .qr-code-wrapper {
    display: flex;
    -ms-flex-align: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    /*padding-top: 40px;*/
    /*padding-bottom: 40px;*/
    z-index: 10;
  }

  .qr-code-container {
    width: 70%;
    /*padding: 2rem;*/
    margin: 0 auto;
  }

  .qr-code-img {
    width: 60%;
  }

  .qr-code-description {
    /*margin-top: 1rem;*/
    font-size: 3rem;
  }
</style>