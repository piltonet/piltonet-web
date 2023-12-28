<template>
  <div class="video-page">
    <div
      class="d-flex flex-column text-center justify-content-center align-items-center"
    >
      <div
        class="d-flex flex-column text-center justify-content-center align-items-center w-100 h-100"
      >
      <video controls="controls" class="video" name="Video Name">
        <source src="https://piltonet.com/docs/piltonet_demo.mov">
      </video>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemoVideo",
  data() {
    return {
    };
  },
  async mounted() {
    document.querySelector('video').playbackRate = 1.5;
  },

  methods: {
    async setup() {},

  },
};
</script>

<style>
.video-page {
  min-height: 100vh;
  background: black;
}
.video {
  width: 1920px;
  max-width: 100%;
  /* height: 910px;
  max-height: 100%; */
}
</style>