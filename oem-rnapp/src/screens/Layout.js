import { createStackNavigator } from 'react-navigation';
import Login from './Login';
import Join from './Join';
import Forgot from './Forgot';
import Home from './HomeLayout';
import Home2 from './HomeLayout2';

import CardApply from './product/CardApply';
import LoanApply from './product/LoanApply';
import TicketSource1 from './product/TicketSource1';
import TicketSource2 from './product/TicketSource2';
import TicketApply from './product/TicketApply';

import BuyLevel from './buylevel/Layout';

import Notice from './Notice';
import NoticeDetail from './NoticeDetail';
import Team from './Team';
import TeamDetail from './TeamDetail';

import Share from './Share';
import ShareFaceJoin from './ShareFaceJoin';
import ShareCopyLibrary from './ShareCopyLibrary';
import ShareJoinLink from './ShareJoinLink';

import MyShop from './myshop/Layout';

import MyIncome from './myincome/Layout';

import Market from './market/Layout';
import CardQR from './market/CardQR';
import LoanQR from './market/LoanQR';

import Record from './record/Layout';

import CashApply from './CashApply';
import SelectBankCard from './SelectBankCard';

import CollegeDetail from './forum/CollegeDetail';

import MyChief from './MyChief';
import About from './About';

import MyBankCard from './MyBankCard';
import MyBankCardCreate from './MyBankCardCreate';
import MyInfo from './MyInfo';

import SelectBank from './SelectBank';
import BkgeTable from './BkgeTable';

import Rank from './Rank';
import Welcome from './Welcome';

import License from './License';

import FAQ from './FAQ';

import Train from './forum/Train';
import ChangePassword from './ChangePassword';
import ExtendImage from './ExtendImage';
import MerchantArticle from './MerchantArticle';

import Wuliao from './Wuliao';
import MerchantBill from './MerchantBill';

const routeConfigs = {
  login: Login,
  join: Join,
  forgot: Forgot,
  home: Home,
  home2: Home2,
  cardApply: CardApply,
  loanApply: LoanApply,
  ticketSource1: TicketSource1,
  ticketSource2: TicketSource2,
  ticketApply: TicketApply,
  buyLevel: BuyLevel,

  notice: Notice,
  notice_detail: NoticeDetail,

  team: Team,
  team_detail: TeamDetail,

  share: Share,
  shareFaceJoin: ShareFaceJoin,
  shareCopyLibrary: ShareCopyLibrary,
  shareJoinLink: ShareJoinLink,
  myshop: MyShop,
  cardQR: CardQR,
  loanQR: LoanQR,

  myincome: MyIncome,
  market: Market,
  record: Record,

  cashApply: CashApply,
  selectBankCard: SelectBankCard,

  collegeDetail: CollegeDetail,

  myChief: MyChief,
  about: About,
  myBankCard: MyBankCard,
  myBankCardCreate: MyBankCardCreate,
  myInfo: MyInfo,

  selectBank: SelectBank,
  bkgeTable: BkgeTable,
  rank: Rank,
  welcome: Welcome,

  license: License,
  faq: FAQ,
  train: Train,
  changePassword: ChangePassword,

  extendImage: ExtendImage,
  merchantArticle: MerchantArticle,
  wuliao: Wuliao,
  merchantBill: MerchantBill,
}

export default createScreen = ( { initialRouteName = 'login' } ) => createStackNavigator(routeConfigs,{
  initialRouteName,
  navigationOptions: {
    header: null,
  }
})
