<template>
  <div id="home">
    <SoftwareList />
  </div>
</template>

<script>
import SoftwareList from "../components/SoftwareList.vue";

export default {
  name: "home",
  components: {
    SoftwareList
  },
  setup() {
    document.title = "Research Software Directory | Home";
  }
};
</script>

<style lang="scss">
.home {
  animation: opacity-in 0.5s;
}
</style>
