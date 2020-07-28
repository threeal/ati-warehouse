import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/login',
      name: 'login',
      component: () => import('../views/Login'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register'),
    },
    {
      path: '/document',
      name: 'document-list',
      component: () => import('../views/DocumentList'),
    },
    {
      path: '/document/:documentId',
      name: 'document-detail',
      component: () => import('../views/DocumentDetail'),
    },
    {
      path: '/document/:documentId/pallet/:palletId',
      name: 'pallet-detail',
      component: () => import('../views/PalletDetail'),
    },
    {
      path: '/document/:documentId/basket/:basketId',
      name: 'basket-detail',
      component: () => import('../views/BasketDetail'),
    },
  ],
});

router.beforeEach((to, _, next) => {
  const user = localStorage.getItem('user');
  if (to.path === '/login' || to.path === '/register') {
    if (user) {
      next('/document');
    }
    else {
      next();
    }
  }
  else {
    if (user) {
      next();
    }
    else {
      next('/login');
    }
  }
});

export default router