<template>
  <div class="row">
    <div class="row justify-content-center border-bottom mb-3">
      <div class="col-md-6 p-2">
        <h3>Sorting And Search</h3>
        <button v-on:click="resetOptions">Reset</button>
        <button v-on:click="sorting1">Sorting</button>
        <button v-on:click="sorting2">Sorting2</button>
        <input
          type="text"
          v-model="selectedSearch"
          placeholder="Filter By Name"
        />
      </div>
    </div>
    <div class="row text-start">
      <div class="col-sm-3 pt-3 pe-2 border-end contentSide">
        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Topics
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div class="contentTopics">
                  <div
                    v-for="topic in topics"
                    :key="topic"
                    id="v-model-multiple-checkboxes"
                    class="form-check"
                    :class="topic"
                  >
                    <label :for="topic" class="form-check-label">
                      <span class="text"
                        >{{ topic }}
                        <strong>({{ topicCount[topic] }})</strong></span
                      >
                    </label>
                    <input
                      type="checkbox"
                      name="checkbox"
                      :id="topic"
                      class="form-check-input"
                      v-model="selectedTopics"
                      :value="topic"
                    />
                  </div>
                  <span>Checked Topics: {{ selectedTopics }}</span>
                  <hr />
                  <span v-for="topic in selectedTopics" :key="topic"
                    >{{ topic }},
                  </span>
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Technologies
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div class="contentOrg">
                  <span>Technologies: {{ technologies.length }} | </span>

                  <div
                    v-for="(tech, index) in technologies"
                    :key="tech"
                    id="v-model-multiple-checkboxes"
                    class="form-check"
                    :class="tech"
                    style="height: 250px, max-height: 250px"
                  >
                    <label :for="tech" class="form-check-label">
                      <span class="text">
                        {{ tech }}
                        <strong>({{ tech.count }})</strong>
                      </span>
                    </label>
                    <input
                      type="checkbox"
                      name="checkbox"
                      class="form-check-input"
                      :id="tech"
                      v-model="selectedTech"
                      :value="tech"
                    />
                    <br />
                  </div>
                  <span>Checked Orgs: {{ selectedTech }}</span>
                  <hr />
                  <span v-for="tech in selectedTech" :key="tech"
                    >{{ tech }},
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-9 p-2">
        <div>
          <p>{{ projects.length }} projects found</p>
          <p>{{ filterProject.length }} projects filtered</p>
          <div class="card-group">
            <Project
              v-for="project in filterProject"
              :key="project"
              :project="project"
            />
          </div>
          <div v-if="filterProject.length" class="pagination-box">
            <Pagination
              :pagination="pagination"
              @set="pagination.set($event)"
              @change="pagination.change($event)"
              @prev="pagination.prev()"
              @next="pagination.next()"
              @last="pagination.last()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";

import useProject from "../services/project";
import Project from "./Project.vue";

import useArrayPagination from "../services/use-array-pagination";
import Pagination from "./Pagination.vue";

export default {
  name: "ProjectList",
  components: {
    Project,
    Pagination
  },
  setup() {
    const {
      projects,
      topics,
      technologies,
      fetchProjects
    } = useProject();
    fetchProjects();

    const selectedSearch = ref("");
    const selectedTopics = ref([]);
    const selectedTech = ref([]);

    const filterProject = computed(() => {
      switch (projects.value.length > 0) {
        case selectedSearch.value.length > 0:
          return projects.value.filter(project => {
            return project.title
              .toLowerCase()
              .includes(selectedSearch.value.toLowerCase());
          });
        case selectedTopics.value.length > 0:
          return selectedTopics.value && selectedTopics.value.length > 0
            ? projects.value.filter(
                project =>
                  project.topics.filter(
                    topic => selectedTopics.value.indexOf(topic) > -1
                  ).length > 0
              )
            : projects.value;
        case selectedTech.value.length > 0:
          return selectedTech.value && selectedTech.value.length > 0
            ? projects.value.filter(
                project =>
                  project.technologies.filter(
                    tech => selectedTech.value.indexOf(tech) > -1
                  ).length > 0
              )
            : projects.value;
        default:
          return projects.value;
      }
      // TODO: this is a mess and needs to be refactored to be more readable and maintainable
    });

    //  HERE IS THE THREE WAYS TO DO THE SAME THING

    // function filterProjectByName() {
    //   return projects.value.filter(project => {
    //     return project.brandName
    //       .toLowerCase()
    //       .includes(selectedSearch.value.toLowerCase());
    //   });
    // }

    // function filterProjectByTopics() {
    //   return selectedTopics.value && selectedTopics.value.length > 0
    //     ? projects.value.filter(
    //         project =>
    //           project.topics.filter(topic => selectedTopics.value.indexOf(topic) > -1)
    //             .length > 0
    //       )
    //     : projects.value;
    // }

    // function filterProjectByOrganization() {
    //   return selectedTech.value && selectedTech.value.length > 0
    //     ? projects.value.filter(
    //         project =>
    //           project.technologies.filter(
    //             tech => selectedTech.value.indexOf(tech) > -1
    //           ).length > 0
    //       )
    //     : projects.value;
    // }

    // THIS IS THE SAME THING BUT WITH A COMPUTED VARIABLE BUT NOT WORKING

    // const filterProject = computed(() => {
    //   filterProjectByName(
    //     filterProjectByTopics(filterProjectByOrganization(projects))
    //   );
    // });

    const sorting1 = computed(() => {
      return filterProject.value.sort((a, b) => {
        a.updatedAt > b.updatedAt ? 1 : -1;
      });
    });

    const sorting2 = computed(() => {
      return filterProject.value.sort((a, b) => {
        a.updatedAt < b.updatedAt ? 1 : -1;
      });
    });

    const topicCount = computed(() => {
      // initialize to 0
      var counts = topics.value.reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {});

      projects.value.forEach(project => {
        project.topics.forEach(topic => {
          counts[topic] += 1;
        });
      });
      return counts;
    });

    const pagination = useArrayPagination(filterProject);

    onMounted(() => {
      console.log("mounted");
    });

    return {
      projects,
      topics,
      technologies,
      pagination,
      filterProject: pagination.result,
      // filterProjectByName,
      // filterProjectByTopics,
      // filterProjectByOrganization,
      topicCount,
      selectedTopics,
      selectedTech,
      selectedSearch,
      sorting1,
      sorting2
    };
  }
};
</script>

<style scoped>
.contentTopics {
  height: 250px;
  overflow-y: scroll;
}
.contentOrg {
  height: 250px;
  overflow-y: scroll;
}
/* width */
::-webkit-scrollbar {
  width: 20px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #e2eeff;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #0c63e4;
}
ul {
  list-style: none;
}
.pagination-box {
  display: flex;
  margin: 2rem auto;
  justify-content: center;
}
</style>
