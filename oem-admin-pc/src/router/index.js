import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/admin',
  routes: [
    { path: '/login', component: () => import('@/components/Login') },
    { path: '/',
      component: () => import('@/components/Layout'),
      children: [
        { path: '/', component: () => import('@/components/HelloWorld') },
        { path: '/stat_card', component: () => import('@/components/HelloCard') },
        { path: '/stat_card_detail', component: () => import('@/components/HelloCardDetail') },
        { path: '/stat_loan', component: () => import('@/components/HelloLoan') },
        { path: '/stat_loan_detail', component: () => import('@/components/HelloLoanDetail') },
        { path: '/stat_ticket', component: () => import('@/components/HelloTicket') },
        { path: '/stat_ticket_detail', component: () => import('@/components/HelloTicketDetail') },

        { path: '/stat_card_order', component: () => import('@/components/HelloCardOrder') },
        { path: '/stat_loan_order', component: () => import('@/components/HelloLoanOrder') },
        { path: '/stat_ticket_order', component: () => import('@/components/HelloTicketOrder') },
        { path: '/stat_level_order', component: () => import('@/components/HelloLevelOrder') },


        { path: '/user', component: () => import('@/components/User') },
        { path: '/user/:referee_id/user', component: () => import('@/components/User') },
        { path: '/user/:user_id/balance', component: () => import('@/components/UserBalance') },
        { path: '/user/:user_id/income', component: () => import('@/components/UserIncome') },

        { path: '/user_level', component: () => import('@/components/UserLevel') },
        { path: '/notice', component: () => import('@/components/MerchantNotice') },
        { path: '/product_card_order', component: () => import('@/components/ProductCardOrder') },
        { path: '/product_loan_order', component: () => import('@/components/ProductLoanOrder') },
        { path: '/product_ticket_order', component: () => import('@/components/ProductTicketOrder') },
        { path: '/user_level_order', component: () => import('@/components/UserLevelOrder') },
        { path: '/cash_order', component: () => import('@/components/CashOrder') },
      ],
    },
  ],
});
