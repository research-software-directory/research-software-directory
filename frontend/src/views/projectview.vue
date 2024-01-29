<template>
  <div class="container single-project">
    <div class="row text-start p-3 mx-3" id="introduction">
      <div class="row">
        <div class="col p-3">
          <h1 class="title name">{{ selectedProject.title }}</h1>
          <div class="shortStatement">{{ selectedProject.subtitle }}</div>
        </div>
      </div>
      <div class="row mb-3 pb-3">
        <div class="col-9">
          <figure>
            <img
              :src="
                'data: selectedProject.image.mimeType;base64,' +
                selectedProject.image.data
              "
              class="img-fluid"
              alt=""
            />

            <div v-if="selectedProject.imageCaption">
              <figcaption>{{ selectedProject.imageCaption }}</figcaption>
            </div>
          </figure>
          <div v-if="selectedProject.description">
            <div class="read-more_content">
              {{ selectedProject.description }}
            </div>
          </div>
        </div>

        <div class="col-3 sidebar bg-light">
          <!-- {% include 'project/sidebar.html' %} -->
        </div>
      </div>
    </div>

    <section class="bg-light p-3 my-3" id="team">
      <div class="container py-3 my-3">
        <div class="row">
          <div class="col-3 p-3">
            <h2 class="subtitle text-primary text-start">Team</h2>
          </div>
          <div class="col-9 my-3">
            <div class="row">
              <div class="col">
                <ul class="row list-unstyled">
                  <li style="width: 100%" class="gradient gradient--gray"></li>
                  <li
                    v-for="contributor in selectedProject.team"
                    class="col col-1-2"
                  >
                    <div class="contributor_name">
                      {{ contributor.foreignKey }}
                    </div>
                    <div
                      v-if="contributor.affiliations > 0"
                      class="contributor_organisation"
                    >
                      {{ contributor.affiliations[0].foreignKey.id }}
                    </div>
                  </li>
                </ul>
                <button type="button" class="btn btn-dark">
                  <div class="d-inline-flex p-2">
                    <span
                      ><svg
                        class="icon"
                        style="
                          fill: #fff;
                          display: block;
                          width: 1em;
                          height: 1em;
                        "
                      >
                        <use
                          xlink:href="/static/icons/icons.svg#icon-plus"
                        ></use></svg
                    ></span>
                    <span class="button_text mx-3">Show all contributors</span>
                  </div>
                </button>
              </div>

              <div
                v-if="(selectedProject.team.isContactPerson = true)"
                class="col col-1-3 contact_card"
              >
                <div class="contact_card_header">Contact person</div>
                <div class="contact_card_content">
                  <div class="contributor_picture">
                    <!-- <img
                      v-if="selectedProject.team.foreignKey.avatar && selectedProject.team.foreignKey.avatar.data"
                      :src="'data:image.mimeType;base64' + image.data"
                      alt=""
                    /> -->
                    <img src="/static/icons/team_default.png" alt="" />
                  </div>
                  <div class="contributor-info">
                    <div class="contributor_name">
                      {{ selectedProject.team.foreignKey }}
                    </div>
                    <div
                      class="contributor_organisation"
                      v-if="selectedProject.team.affiliations > 0"
                    >
                      {{ selectedProject.team.affiliations[0].foreignKey.name }}
                    </div>
                    <div class="contributor_email">
                      <a
                        href="mailto:{{selectedProject.team.foreignKey.emailAddress}}"
                      >
                        <svg
                          class="icon"
                          style="
                            height: 1em;
                            width: 1em;
                            position: relative;
                            top: 3px;
                            margin-right: 0.3em;
                            display: inline-block;
                          "
                        >
                          <use
                            xlink:href="/static/icons/icons.svg#icon-envelope"
                          ></use>
                        </svg>
                        Mail {{ selectedProject.team.foreignKey }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class=""
      id="related-projects"
    >
      <div class="container my-3 py-3" v-if="selectedProject.related.projects.length > 0">
        <div class="row my-3 py-3">
          <div class="col-3">
            <h2 class="subtitle text-primary text-start">Related projects</h2>
          </div>
          <div class="col-9">
            <div class="row project-items">
              <article
                v-for="project in selectedProject.related.projects"
                class="project-item col-1-2"
              >
                <a href="/project/{{project.foreignKey.id}}">
                  <div class="content">
                    <div class="thumb">
                      <!-- <img :src="'data:project.image.mimeType;base64,' + project.image.data" alt="" > -->
                    </div>
                    <div class="text">
                      <!-- <h2 class="text-primary">
                                        {{project.title}}
                                    </h2>
                                    <p>
                                        {{project.subtitle}}
                                    </p> -->
                      <p>
                        {{ project.foreignKey.id }}
                      </p>
                    </div>
                  </div>
                </a>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import useProject from "../services/project";
import router from "@/router";

export default {
  name: "ProjectView",

  setup() {
    const { id } = router.currentRoute.value.params;
    const { selectedProject, fetchSelectedProject } = useProject();

    fetchSelectedProject(id);

    watch(selectedProject, () => {
      if (selectedProject.title) {
        document.title = `${selectedProject.value.title} | Project`;
      }
    });

    return {
      selectedProject: computed(() => selectedProject.value)
    };
  }
};
</script>

<style scoped>
.contact_card_header {
  color: #fff;
  text-transform: uppercase;
  font-size: 1.6rem;
  letter-spacing: 0.01em;
  font-family: "Roboto Bold", Helvetica, arial, sans-serif;
  background-color: #00a3e3;
  padding: 0.8em 1.5em 0.8em 1.45em;
}

.contact_card_content {
  line-height: 1.55;
  padding: 1.5em 2.5em 1.5em 1.5em;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.contributor_picture img {
  max-width: 90px;
  max-height: 90px;
  border-radius: 50%;
}


.pre-line {
  white-space: pre-line;
}

/* .text-block {
  white-space: pre;
} */
</style>

