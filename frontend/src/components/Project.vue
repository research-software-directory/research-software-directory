<template>
  <router-link
    :to="{
      name: 'ProjectView',
      params: { id: project.primaryKey.id, project: projectUrl },
    }"
    class="text-decoration-none text-reset m-2"
    style="min-width: 25%; max-width: 45%"
  >
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img
            :src="'data:' + project.image.mimeType + ';base64,' + project.image.data"
            class="img-fluid rounded"
            alt=""
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ project.title }}</h5>
            <p class="card-text">{{ project.subtitle }}</p>
            <p class="card-text d-flex justify-content-between">
              <small class="text-muted">Last updated: {{ project.updatedAt }}</small>
              <small>{{ project.status }}</small>
            </p>
          <p>{{ project.topics }}</p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { toRefs } from "vue";

export default {
  name: "Project",
  props: {
    project: Object
  },

  setup(props) {
    const { project } = toRefs(props);
    const projectUrl = project.value.title
      .split(" ")
      .join("-")
      .toLowerCase();

    return {
      projectUrl
    };
  }
};
</script>

<style>
</style>
