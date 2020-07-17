import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/document',
      name: 'document-list',
      component: () => import('../views/DocumentList'),
    },
    {
      path: '/document-add',
      name: 'document-add',
      component: () => import('../views/DocumentAdd'),
    },
    {
      path: '/document/:id',
      name: 'document-detail',
      component: () => import('../views/DocumentDetail'),
    },
    {
      path: '/document/:id/pallet-load-add',
      name: 'pallet-load-add',
      component: () => import('../views/PalletLoadAdd'),
    },
    {
      path: '/bongkar-basket',
      name: 'bongkar-basket',
      component: () => import('../components/BongkarBasket'),
    },
    {
      path: '/muat-pallet',
      name: 'muat-pallet',
      component: () => import('../components/MuatPallet'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login'),
    },
  ],
})