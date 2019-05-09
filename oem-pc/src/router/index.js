import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/pc',
  routes: [
    { path: '/login', component: () => import('@/components/Login') },
    { path: '/',
      component: () => import('@/components/Layout'),
      children: [
        { path: '/', component: () => import('@/components/HelloWorld') },

        { path: '/user', component: () => import('@/components/User') },
        { path: '/user/:referee_id/user', component: () => import('@/components/User') },
        { path: '/user/:user_id/balance', component: () => import('@/components/UserBalance') },
        { path: '/user/:user_id/income', component: () => import('@/components/UserIncome') },

        { path: '/product_card_order', component: () => import('@/components/ProductCardOrder') },
        { path: '/product_loan_order', component: () => import('@/components/ProductLoanOrder') },
        { path: '/product_ticket_order', component: () => import('@/components/ProductTicketOrder') },
        { path: '/user_level_order', component: () => import('@/components/UserLevelOrder') },
      ],
    },
  ],
});
