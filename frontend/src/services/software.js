import {
    reactive,
    toRefs,
    ref,
    computed,
} from "vue";
import Axios from 'axios';

const state = reactive({
    software: [],
    tags: [],
    organizations: [],
    // selectedSoftware: {},
});
const selectedSoftware = ref({ brandName: '', slug: '' });

export default function useSoftware() {

    async function fetchSoftware() {
        await Axios.get('/api/software')
            .then((res) => {
                state.software = res.data;
                state.software.forEach((sw) => {
                    sw.tags.forEach((tag) => {
                        if (state.tags.indexOf(tag) === -1) {
                            state.tags.push(tag);
                        }
                    });
                });
                
                state.software.forEach((sw) => {
                    sw.related.organizations.forEach((org) => {
                        if (state.organizations.indexOf(org) === -1) {
                            state.organizations.push(org);
                        }
                    });
                });
                // console.log(organizations.length);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // console.log('outLoad: ' + state.software.length);

    async function fetchSelectedSoftware(id) {
        await Axios.get(`/api/software/${id}`)
            .then((res) => {
                selectedSoftware.value = res.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return {
        ...toRefs(state),
        fetchSoftware,
        selectedSoftware: computed(() => selectedSoftware.value),
        fetchSelectedSoftware,
    };
}