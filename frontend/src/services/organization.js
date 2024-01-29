import {
    reactive,
    ref,
    computed
} from 'vue';
import Axios from 'axios';

const loading = ref(false);
let organization = [];
const filterOrganization = ref([]);

export default function organizationStore() {
    async function fetchOrganization() {
        await Axios.get('/api/organization')
            .then((res) => {
                organization = res.data;
                filterOrganization.value = organization;
                // console.log('--------------');
                // console.log(organization.value);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return {
        loading: computed(() => loading.value),
        organization: computed(() => organization.value),
        filterOrganization: computed(() => filterOrganization.value),

        fetchOrganization,
    };
}
