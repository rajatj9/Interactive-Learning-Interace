<template>
  <div class="scrolling-page">
    <div class="content-wrapper">
      <router-link tag="a" to="/portrait"> Portrait</router-link>
      <router-link tag="a" to="/landscape"> Landscape</router-link>
    </div>
  </div>
</template>

<style scoped>
  .scrolling-page {
    position: absolute;
    top: 0;
    left: 0;
    height: 200rem;
    background: rgba(255, 127, 80, 0.2);
    width: 100%;
  }

  .content-wrapper {
    margin-top: 190rem;
    text-align: center;
    width: 100%
  }
</style>