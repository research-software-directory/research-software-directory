<template>
  <router-link
    :to="{
      name: 'software',
      params: { id: sw.primaryKey.id, software: swUrl },
    }"
    class="text-decoration-none text-reset"
    style="min-width: 25%; max-width: 50%"
  >
    <div
      class="card rounded m-2"
      :class="[sw.isFeatured ? 'text-white bg-info bg-gradient' : '', card]"
    >
      <div class="card-header d-flex justify-content-between p-0">
        <h5 class="bg-transparent border-success p-2">
          {{ sw.brandName }}
        </h5>
        <div class="text-dark bg-white p-2 align-middle">
          {{ sw.brandName.slice(0, 2) }}
        </div>
      </div>
      <div class="card-body">
        <p class="card-text small">{{ sw.shortStatement }}</p>
      </div>
      <div class="card-footer d-flex justify-content-between">
        <small>
          {{ sw.updatedAt }}
        </small>
        <small v-if="sw.isFeatured"
          ><i class="bi bi-star-fill"></i> Featured</small
        >
        <small v-else></small>
      </div>
    </div>
  </router-link>
</template>

<script>
import { toRefs } from "vue";

export default {
  name: "Sw",
  props: {
    sw: Object
  },

  setup(props) {
    const { sw } = toRefs(props);
    const swUrl = sw.value.brandName
      .split(" ")
      .join("-")
      .toLowerCase();

    return {
      swUrl
    };
  }
};
</script>


<style>
</style>
