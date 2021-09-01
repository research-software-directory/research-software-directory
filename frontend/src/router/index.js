import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Home from '../views/Home.vue'
import ProjectList from '../components/ProjectList.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/software/:id',
    name: 'software',
    component: () => import( /* webpackChunkName: "software" */ '../views/software.vue'),
  },
  {
    path: '/project',
    name: 'ProjectList',
    component: ProjectList
  },
  {
    path: '/project/:id',
    name: 'ProjectView',
    component: () => import( /* webpackChunkName: "project" */ '../views/projectview.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router