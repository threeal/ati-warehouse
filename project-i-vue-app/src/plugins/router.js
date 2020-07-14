import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'document-list',
      component: () => import('../views/DocumentList'),
    },
    {
      path: '/bongkar-basket',
      name: 'bongkar-basket',
      component: () => import('../components/BongkarBasket'),
    },
  ],
})