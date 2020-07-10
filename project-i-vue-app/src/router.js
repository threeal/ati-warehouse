import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/tutorials',
      name: 'tutorials',
      component: () => import('./components/TutorialList'),
    },
    {
      path: '/tutorials/:id',
      name: 'tutorial-details',
      component: () => import('./components/Tutorial'),
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('./components/AddTutorial'),
    },
    {
      path: '/main/1',
      name: 'Halaman Pertama',
      component: () => import('./components/Page1'),
    },
  ],
})