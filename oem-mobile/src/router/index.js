import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: HelloWorld },
    { path: '/product_card', component: () => import('@/components/ProductCard2') },
    { path: '/product_card_qr', component: () => import('@/components/ProductCardQR') },
    { path: '/product_card_apply', component: () => import('@/components/ProductCardApply') },

    { path: '/product_loan', component: () => import('@/components/ProductLoan2') },
    { path: '/product_loan_qr', component: () => import('@/components/ProductLoanQR') },
    { path: '/product_loan_apply', component: () => import('@/components/ProductLoanApply2') },

    { path: '/product_shop', component: () => import('@/components/ProductShop') },

    { path: '/(product_ticket|level_info)',
      component: () => import('@/components/ProductTicketLayout'),
      children: [
        { path: '/product_ticket', component: () => import('@/components/ProductTicket') },
        { path: '/level_info', component: () => import('@/components/levelUp/Home') },
      ],
    },
    { path: '/product_ticket_apply', component: () => import('@/components/ProductTicketApply') },
    { path: '/product_ticket_source/:id', component: () => import('@/components/ProductTicketSource') },

    { path: '/level_up',
      component: () => import('@/components/levelUp/Layout'),
      children: [
        { path: '/level_up', component: () => import('@/components/levelUp/Home') },
        { path: '/level_up/notes', component: () => import('@/components/levelUp/Notes') },
        { path: '/level_up/faq', component: () => import('@/components/levelUp/FAQ') },
      ],
    },

    { path: '/income',
      redirect: '/income/detail',
      component: () => import('@/components/income/Layout'),
      children: [
        { path: '/income/detail', component: () => import('@/components/income/Detail') },
        { path: '/income/cash_order', component: () => import('@/components/income/CashOrder') },
      ],
    },
    { path: '/record',
      redirect: '/record/card',
      component: () => import('@/components/record/Layout'),
      children: [
        { path: '/record/card', component: () => import('@/components/record/Card') },
        { path: '/record/loan', component: () => import('@/components/record/Loan') },
        { path: '/record/ticket', component: () => import('@/components/record/Ticket') },
        { path: '/record/level_up', component: () => import('@/components/record/LevelUp') },
      ],
    },
    { path: '/course', component: () => import('@/components/Course') },
    { path: '/course_detial', component: () => import('@/components/CourseDetail') },

    { path: '/notice/:id', component: () => import('@/components/NoticeItem') },

    { path: '/tutorial', component: () => import('@/components/Tutorial') },
    { path: '/tutorial/:id', component: () => import('@/components/TutorialItem') },
    { path: '/team', component: () => import('@/components/Team') },
    { path: '/team/:level_id', component: () => import('@/components/TeamLevel') },
    { path: '/ranking', component: () => import('@/components/Ranking') },
    { path: '/personal', component: () => import('@/components/Personal') },

    { path: '/share', component: () => import('@/components/Share') },
    { path: '/share_link_join', component: () => import('@/components/ShareLinkJoin') },
    { path: '/share_qr_spread', component: () => import('@/components/ShareQrSpread') },
    { path: '/share_copy_library', component: () => import('@/components/ShareCopyLibrary') },
    { path: '/share_face_join', component: () => import('@/components/ShareFaceJoin') },

    { path: '/(login/join)',
      component: () => import('@/components/loginJoin/Layout'),
      children: [
        { path: '/login', component: () => import('@/components/loginJoin/Login') },
        { path: '/join', component: () => import('@/components/loginJoin/Join') },
      ],
    },
    { path: '/forgot', component: () => import('@/components/loginJoin/Forgot') },

    { path: '/my_bank_card', component: () => import('@/components/MyBankCard') },
    { path: '/my_bank_card/create', component: () => import('@/components/MyBankCardCreate') },
    { path: '/my_bank_card/:id', component: () => import('@/components/MyBankCardEdit') },
    { path: '/my_info', component: () => import('@/components/MyInfo') },
    { path: '/my_chief', component: () => import('@/components/MyChief') },

    { path: '/about', component: () => import('@/components/About') },

    { path: '/cash_apply', component: () => import('@/components/CashApply') },
    { path: '/notice', component: () => import('@/components/Notice') },
    { path: '/change_password', component: () => import('@/components/ChangePassword') },

    { path: '/select_bank_card', component: () => import('@/components/SelectBankCard') },
    { path: '/license', component: () => import('@/components/License') },
    { path: '/baoxian_license', component: () => import('@/components/BaoxianLicense') },
    { path: '/wx_auth', component: () => import('@/components/WxAuth') },

    { path: '/debug', component: () => import('@/components/Debug') },
    { path: '/recharge', component: () => import('@/components/Recharge') },

    { path: '/app_download', component: () => import('@/components/AppDownload2') },
    { path: '/app_download2', component: () => import('@/components/AppDownload2') },
  ],
});
