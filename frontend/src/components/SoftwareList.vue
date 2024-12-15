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
                Tags
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div class="contentTags">
                  <div
                    v-for="tag in tags"
                    :key="tag"
                    id="v-model-multiple-checkboxes"
                    class="form-check"
                    :class="tag"
                  >
                    <label :for="tag" class="form-check-label">
                      <span class="text"
                        >{{ tag }} <strong>({{ tagCount[tag] }})</strong></span
                      >
                    </label>
                    <input
                      type="checkbox"
                      name="checkbox"
                      :id="tag"
                      class="form-check-input"
                      v-model="selectedTags"
                      :value="tag"
                    />
                  </div>
                  <span>Checked Tags: {{ selectedTags }}</span>
                  <hr />
                  <span v-for="tag in selectedTags" :key="tag"
                    >{{ tag }},
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
                Organizations
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
                  <span>Organizations: {{ organizations.length }} | </span>
                  <span
                    >partnerOrganizations:
                    {{ partnerOrganizations.length }}</span
                  >
                  <div
                    v-for="(org, index) in organizationsWithCount"
                    :key="org"
                    id="v-model-multiple-checkboxes"
                    class="form-check"
                    :class="org"
                    style="height: 250px, max-height: 250px"
                  >
                    <label :for="org.id" class="form-check-label">
                      <span class="text">
                        {{ org.name }}
                        <strong>({{ org.count }})</strong>
                      </span>
                    </label>
                    <input
                      type="checkbox"
                      name="checkbox"
                      class="form-check-input"
                      :id="org.primaryKey.id"
                      v-model="selectedOrg"
                      :value="org.primaryKey.id"
                    />
                    <br />
                  </div>
                  <span>Checked Orgs: {{ selectedOrg }}</span>
                  <hr />
                  <span v-for="org in selectedOrg" :key="org">{{ org }}, </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-9 p-2">
        <div>
          <p>{{ software.length }} software found</p>
          <p>{{ filterSoftware.length }} software paged</p>
          <div class="card-group">
            <Sw
              v-for="sw in filterSoftware"
              :key="sw"
              :sw="sw"
            />
          </div>
          <div v-if="filterSoftware.length" class="pagination-box">
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

import useSoftware from "../services/software";
import Sw from "./Sw.vue";
import organizationStore from "../services/organization";

import useArrayPagination from "../services/use-array-pagination";
import Pagination from "./Pagination.vue";

export default {
  name: "SoftwareList",
  components: {
    Sw,
    Pagination
  },
  setup() {
    const { software, tags, organizations, fetchSoftware } = useSoftware();
    fetchSoftware();
    const {
      organization,
      filterOrganization,
      fetchOrganization
    } = organizationStore();
    fetchOrganization();

    const selectedSearch = ref("");
    const selectedTags = ref([]);
    const selectedOrg = ref([]);

    const filterSoftware = computed(() => {
      switch (software.value.length > 0) {
        case selectedSearch.value.length > 0:
          return software.value.filter(sw => {
            return sw.brandName
              .toLowerCase()
              .includes(selectedSearch.value.toLowerCase());
          });
        case selectedTags.value.length > 0:
          return selectedTags.value && selectedTags.value.length > 0
            ? software.value.filter(
                sw =>
                  sw.tags.filter(tag => selectedTags.value.indexOf(tag) > -1)
                    .length > 0
              )
            : software.value;
        case selectedOrg.value.length > 0:
          return selectedOrg.value && selectedOrg.value.length > 0
            ? software.value.filter(
                sw =>
                  sw.related.organizations.filter(
                    org => selectedOrg.value.indexOf(org.foreignKey.id) > -1
                  ).length > 0
              )
            : software.value;
        default:
          return software.value;
      }
      // TODO: this is a mess and needs to be refactored to be more readable and maintainable
    });

    //  HERE IS THE THREE WAYS TO DO THE SAME THING

    // function filterSoftwareByName() {
    //   return software.value.filter(sw => {
    //     return sw.brandName
    //       .toLowerCase()
    //       .includes(selectedSearch.value.toLowerCase());
    //   });
    // }

    // function filterSoftwareByTags() {
    //   return selectedTags.value && selectedTags.value.length > 0
    //     ? software.value.filter(
    //         sw =>
    //           sw.tags.filter(tag => selectedTags.value.indexOf(tag) > -1)
    //             .length > 0
    //       )
    //     : software.value;
    // }

    // function filterSoftwareByOrganization() {
    //   return selectedOrg.value && selectedOrg.value.length > 0
    //     ? software.value.filter(
    //         sw =>
    //           sw.related.organizations.filter(
    //             org => selectedOrg.value.indexOf(org.foreignKey.id) > -1
    //           ).length > 0
    //       )
    //     : software.value;
    // }

    // THIS IS THE SAME THING BUT WITH A COMPUTED VARIABLE BUT NOT WORKING

    // const filterSoftware = computed(() => {
    //   filterSoftwareByName(
    //     filterSoftwareByTags(filterSoftwareByOrganization(software))
    //   );
    // });

    const sorting1 = computed(() => {
      return filterSoftware.value.sort((a, b) => {
        a.updatedAt > b.updatedAt ? 1 : -1;
      });
    });

    const sorting2 = computed(() => {
      return filterSoftware.value.sort((a, b) => {
        a.updatedAt < b.updatedAt ? 1 : -1;
      });
    });

    const tagCount = computed(() => {
      // initialize to 0
      var counts = tags.value.reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {});

      software.value.forEach(sw => {
        sw.tags.forEach(tag => {
          counts[tag] += 1;
        });
      });
      return counts;
    });

    const partnerOrganizations = computed(() => {
      var alphabeticallyByName = function(obj1, obj2) {
        var locale = undefined;
        var options = { sensitivity: "base" }; // case-insensitive
        return obj1.name.localeCompare(obj2.name, locale, options);
      };
      // all contributing organization ids (map, flatten, filter unique)
      var contributingOrganizationIds = [].concat.apply(
        [],
        organizations.value.map(org => org.foreignKey.id)
      );
      // create a deep copy of the array of organizations
      var orgCopy = JSON.parse(JSON.stringify(filterOrganization.value));
      return orgCopy
        .filter(
          org => contributingOrganizationIds.indexOf(org.primaryKey.id) > -1
        )
        .sort(alphabeticallyByName);
    });

    const organizationsWithCount = computed(() => {
      var partners = partnerOrganizations.value;
      partners.forEach(partner => {
        partner["count"] = 0;
      });
      organizations.value.forEach(forg => {
        var org = partners.find(corg => {
          return corg.primaryKey.id === forg.foreignKey.id;
        });
        if (org) {
          org["count"] = (org["count"] || 0) + 1;
        }
      });
      return partners;
    });

    const pagination = useArrayPagination(filterSoftware);

    onMounted(() => {
      console.log("mounted");
    });

    return {
      software,
      tags,
      organizations,
      pagination,
      filterSoftware: pagination.result,
      // filterSoftwareByName,
      // filterSoftwareByTags,
      // filterSoftwareByOrganization,
      organization,
      filterOrganization,
      organizationsWithCount,
      partnerOrganizations,
      tagCount,
      selectedSearch,
      selectedTags,
      selectedOrg,
      sorting1,
      sorting2
    };
  }
};
</script>

<style scoped>
.contentTags {
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
