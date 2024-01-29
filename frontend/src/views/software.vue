<template>
  <div class="container single-software">
    <div class="row text-start">
      <div class="row my-3 p-3" id="introduction">
        <div class="col-md-9">
          <h1>{{ selectedSoftware.brandName }}</h1>
          <p>{{ selectedSoftware.shortStatement }}</p>
        </div>
        <div class="col-md-3">
          <div class="row">
            <div class="col-md-4">
              <h1>{{ selectedSoftware.related.mentions.length }}</h1>
              <p>mentions</p>
            </div>
            <div class="col-md-4">
              <h1>{{ selectedSoftware.contributors.length }}</h1>
              <p>contributors</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3 p-3" id="getStartedURL">
        <div class="col-md-2">
          <a :href="selectedSoftware.getStartedURL" target="_blank">
            <button type="button" class="btn btn-primary">Get started</button>
          </a>
        </div>
        <div class="col-md-2">
          <!-- <div class="single-software-image">
          <img :src="selectedSoftware.image" alt="">
        </div> -->
        </div>
      </div>
      <div class="row p-3 mb-3 bg-dark text-white" id="cite-this">
        <div class="col-md-4 p-3">
          <h3>Cite this software:</h3>
          <select class="form-select bg-dark text-white" aria-label="Default select example">
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div class="col-md-8 p-3">
          <div class="row">
            <p>DOI:</p>
          </div>
          <div class="row">
            <div class="col-md-8">
              <p>{{ selectedSoftware.conceptDOI }}</p>
            </div>
            <div class="col-md-4">
              <a :href="CopyToClipboard">
                <button type="button" class="btn btn-primary">Copy to clipboard</button>
              </a>
            </div>
          </div>
          <div class="row">
            <p>Choose a reference manager file format</p>
          </div>
          <div class="row">
            <div class="col-md-8">
              <select class="form-select bg-dark text-white" aria-label="Default select example">
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div class="col-md-4">
              <a :href="selectedSoftware.downloadLink" target="_blank">
                <button type="button" class="btn btn-primary">Download file</button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3" id="about">
        <div class="col-md-9">
          <div class="row mb-2 p-3">
            <h2>What Kernel Tuner can do for you</h2>
            <pre class="pre-line">{{ selectedSoftware.bullets }}</pre>
          </div>
          <div class="row p-3">
            <button type="button" class="btn btn-light">Read More</button>
            <p>{{ selectedSoftware.readMore }}</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="single-software-tags">
            <h5>tags</h5>
            <ul class="list-unstyled">
              <li v-for="tag in selectedSoftware.tags">{{ tag }}</li>
            </ul>
          </div>

          <div class="single-software-programmingLanguage">
            <h5>programming language</h5>
            <ul class="list-unstyled">
              <li v-for="language in selectedSoftware.programmingLanguage">
                {{ language }}
              </li>
            </ul>
          </div>

          <div class="single-software-license">
            <h5 class="list-unstyled">License</h5>
            <ul>
              <li v-for="license in selectedSoftware.license">{{ license }}</li>
            </ul>
          </div>

          <div class="single-software-repositoryURLs">
            <h5>Source code</h5>
            <ul class="list-unstyled">
              <li v-for="repositoryURL in selectedSoftware.repositoryURLs">
                <a :href="repositoryURL" target="_blank"
                  ><button>Source code</button></a
                >
              </li>
            </ul>
          </div>

          <div class="single-software-updatedBy">
            <h5>updatedBy</h5>
            <p>{{ selectedSoftware.updatedBy }}</p>
          </div>
        </div>
      </div>
    </div>
    <router-link :to="{ name: 'home' }" class="go-back">
      <i class="fa fa-arrow-left"></i>Go back
    </router-link>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import useSoftware from "../services/software";
import router from "@/router";

export default {
  name: "Software",

  setup() {
    const { id } = router.currentRoute.value.params;
    const { selectedSoftware, fetchSelectedSoftware } = useSoftware();

    fetchSelectedSoftware(id);

    watch(selectedSoftware, () => {
      if (selectedSoftware.brandName) {
        document.title = `${selectedSoftware.value.brandName} | Software`;
      }
    });

    return {
      selectedSoftware: computed(() => selectedSoftware.value)
    };
  }
};
</script>

<style scoped>
.pre-line {
  white-space: pre-line;
}

/* .text-block {
  white-space: pre;
} */
</style>

