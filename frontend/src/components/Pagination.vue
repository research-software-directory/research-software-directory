<template>
  <div class="pagination">
    <a href="#" @click.prevent="$emit('set', 1)">&lt;&lt;&lt;</a>
    <span class="separator"></span>
    <a href="#" @click.prevent="$emit('prev')">&lt;</a>
    <a href="#" @click.prevent="$emit('set', 1)">{{
      pagination.currentPage.value !== 1 ? 1 : ""
    }}</a>
    <span class="separator">...</span>
    <a href="#" @click.prevent="$emit('prev')">{{
      pagination.currentPage.value - 2 !== -1 &&
      pagination.currentPage.value - 2 !== 0 &&
      pagination.currentPage.value - 2 !== 1
        ? pagination.currentPage.value - 2
        : "..."
    }}</a>
    <a href="#" @click.prevent="$emit('prev')">{{
      pagination.currentPage.value - 1 !== 0 &&
      pagination.currentPage.value - 1 !== 1
        ? pagination.currentPage.value - 1
        : "..."
    }}</a>
    <span class="current text-teal-500"
      ><strong>{{ pagination.currentPage.value }}</strong></span
    >
    <a href="#" @click.prevent="$emit('next')">{{
      pagination.currentPage.value + 1 < pagination.lastPage.value
        ? pagination.currentPage.value + 1
        : "..."
    }}</a>
    <a href="#" @click.prevent="$emit('next')">{{
      pagination.currentPage.value + 2 < pagination.lastPage.value
        ? pagination.currentPage.value + 2
        : "..."
    }}</a>
    <span class="separator">...</span>
    <a
      v-if="pagination.lastPage.value"
      href="#"
      @click.prevent="$emit('set', pagination.lastPage.value)"
      >{{ pagination.lastPage.value }}</a
    >
    <a href="#" @click.prevent="$emit('next')">&gt;</a>
    <span class="separator"></span>
    <a href="#" @click.prevent="$emit('last')">&gt;&gt;&gt;</a>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    pagination: Object
  }
});
</script>

<style lang="scss" scoped>
.pagination {
  font-size: 0.9rem;
  margin: 0 auto;
  & a,
  .current {
    display: inline-block;
    line-height: 0.9rem;
    min-width: 1.5rem;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    &:not(:nth-child(1)) {
      margin-left: 5px;
    }
  }
  & a:hover,
  & a:focus {
    border: 1px solid #ccc;
  }

  span.separator {
    padding: 5px;
  }
}
</style>
