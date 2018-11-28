<template>
  <div id="list" class="grid">
    <div class="grid-item">
      <slot></slot>
    </div>
    <div class="grid-item">1</div>
    <div class="grid-item">1</div>
    <div class="grid-item">1</div>
    <div class="grid-item">1</div>
    <div class="grid-item">1</div>
    <div class="grid-item">1</div>
  </div>
</template>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  box-sizing: border-box;
}

.grid {
  max-width: 1800px;
  margin: 30px auto;
  padding: 0 20px;
  width: 100%;
  display: grid;
  /* Define Auto Row size */
  grid-auto-rows: 550px;
  /*Define our columns */
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  grid-gap: 1em;
}
.grid-item {
  border-radius: 10px;
  border: 1px solid;
}
</style>
<script>
export default {
  name: "List"
};
</script>

