import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
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

        { path: '/merchant', component: () => import('@/components/Merchant') },
        { path: '/merchant/:merchant_id/user', component: () => import('@/components/User') },
        { path: '/merchant/:merchant_id/user_level', component: () => import('@/components/UserLevel') },
        { path: '/merchant_extend', component: () => import('@/components/MerchantExtend') },
        { path: '/merchant_article_type', component: () => import('@/components/MerchantArticleType') },
        { path: '/merchant/:merchant_id/article', component: () => import('@/components/MerchantArticle') },
        { path: '/merchant_bill_type', component: () => import('@/components/MerchantBillType') },
        { path: '/merchant/:merchant_id/bill', component: () => import('@/components/MerchantBill') },

        { path: '/course', component: () => import('@/components/Course') },
        { path: '/course_type', component: () => import('@/components/CourseType') },

        { path: '/product_card', component: () => import('@/components/ProductCard') },
        { path: '/product_card_property', component: () => import('@/components/ProductCardProperty') },
        { path: '/product_card_type', component: () => import('@/components/ProductCardType') },
        { path: '/product_card_source', component: () => import('@/components/ProductCardSource') },
        { path: '/product_card_order', component: () => import('@/components/ProductCardOrder') },

        { path: '/product_loan', component: () => import('@/components/ProductLoan') },
        { path: '/product_loan_property', component: () => import('@/components/ProductLoanProperty') },
        { path: '/product_loan_type', component: () => import('@/components/ProductLoanType') },
        { path: '/product_loan_order', component: () => import('@/components/ProductLoanOrder') },

        { path: '/product_ticket', component: () => import('@/components/ProductTicket') },
        { path: '/product_ticket_property', component: () => import('@/components/ProductTicketProperty') },
        { path: '/product_ticket_type', component: () => import('@/components/ProductTicketType') },
        { path: '/product_ticket_source', component: () => import('@/components/ProductTicketSource') },
        { path: '/product_ticket_source_property', component: () => import('@/components/ProductTicketSourceProperty') },
        { path: '/product_ticket_order', component: () => import('@/components/ProductTicketOrder') },

        { path: '/user_level_order', component: () => import('@/components/UserLevelOrder') },

        { path: '/article', component: () => import('@/components/Article') },
        { path: '/article_type', component: () => import('@/components/ArticleType') },
        { path: '/user_level', component: () => import('@/components/UserLevel') },

        { path: '/sms', component: () => import('@/components/Sms') },
        { path: '/payment', component: () => import('@/components/Payment') },
        { path: '/agentpay', component: () => import('@/components/Agentpay') },
        { path: '/bindcard', component: () => import('@/components/Bindcard') },
        { path: '/product_ticket_process', component: () => import('@/components/ProductTicketProcess') },

        { path: '/copy_library', component: () => import('@/components/CopyLibrary') },
        { path: '/qr_spread', component: () => import('@/components/QrSpread') },
        { path: '/cash_order', component: () => import('@/components/CashOrder') },
        { path: '/bank', component: () => import('@/components/Bank') },
        { path: '/logs', component: () => import('@/components/Logs') },
        { path: '/recharge_order', component: () => import('@/components/RechargeOrder') },


        { path: '/stat_card_order', component: () => import('@/components/HelloCardOrder') },
        { path: '/stat_loan_order', component: () => import('@/components/HelloLoanOrder') },
        { path: '/stat_ticket_order', component: () => import('@/components/HelloTicketOrder') },
        { path: '/stat_level_order', component: () => import('@/components/HelloLevelOrder') },

        { path: '/:object', component: () => import('@/components/Object') },
      ],
    },
  ],
});
