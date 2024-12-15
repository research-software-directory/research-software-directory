import {
    reactive,
    toRefs,
    ref,
    computed,
} from 'vue';
import Axios from 'axios';

const state = reactive({
    projects: [],
    // topics: [],
    // technologies: [],
});

const topics = ref([
    "Astronomy",
    "Climate and weather",
    "Humanities",
    "Chemistry",
    "Material science",
    "Law",
    "Ecology",
    "Life science",
    "Psychology",
    "Physics",
    "Computer science",
    "Health"
]);
const technologies = ref([
    "Big data",
    "GPU",
    "High performance computing",
    "Image processing",
    "Inter-operability & linked data",
    "Machine learning",
    "Multi-scale & multi model simulations",
    "Optimized data handling",
    "Real time data analysis",
    "Text analysis & natural language processing",
    "Visualization",
    "Workflow technologies"
]);

const selectedProject = ref({
    title: '',
    subtitle: ''
});

export default function useProject() {
    async function fetchProjects() {
        await Axios.get('/api/project')
            .then((res) => {
                state.projects = res.data;
                // console.log(state.projects);
                state.projects.forEach((project) => {
                    project.topics.forEach((topic) => {
                        if (state.topics.indexOf(topic) === -1) {
                            state.topics.push(topic);
                        }
                    });
                });
                // console.log(state.topics);

                state.projects.forEach((project) => {
                    project.technologies.forEach((tech) => {
                        if (state.technologies.indexOf(tech) === -1) {
                            state.technologies.push(tech);
                        }
                    });
                });
                // console.log(technologies.value);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function fetchSelectedProject(id) {
        await Axios.get(`/api/project/${id}`)
            .then((res) => {
                selectedProject.value = res.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return {
        ...toRefs(state),
        topics: computed(() => topics.value),
        technologies: computed(() => technologies.value),
        selectedProject: computed(() => selectedProject.value),

        fetchProjects,
        fetchSelectedProject,
    };
}