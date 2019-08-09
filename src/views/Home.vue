<template>
  <div class="home-page">
    <div class="content-container">
      <img src="../assets/img/logo_GI.png" class="logo-image" alt="logo">
      <div class="home-description">
        Welcome to Getting Interested!
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Home"
  }
</script>

<style scoped>
  .home-page {
    height: 100%;
    width: 100%;
    background: url("../assets/img/message_bg-min.png") no-repeat center;
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
    .home-page {
      background-size: 300% auto;
    }
  }

  @media screen and (orientation: landscape) {
    .home-page {
      background-size: auto 120%;
    }
  }

  .content-container {
    width: 60%;
    padding: 2rem;
    margin: 0 auto;
  }

  .home-description {
    margin-top: 2rem;
    font-size: 20px;
    color: #9B9B9B;
  }

  .logo-image {
    max-width: 25rem;
  }

  @media (max-width: 812px) {
    .logo-image {
      max-width: 40%;
    }

    .home-description {
      font-size: 16px;
    }
  }

  @media (max-width: 414px) {
    .logo-image {
      max-width: 50%;
    }

    .home-description {
      font-size: 14px;
    }
  }
</style>