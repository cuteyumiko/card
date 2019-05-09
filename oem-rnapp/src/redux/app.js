import {
  DeviceInfo,
  Dimensions,
  Platform,
  NativeModules,
} from 'react-native';
import { createActions, handleActions, combineActions } from 'redux-actions';
import axios from 'axios';


const actions = createActions({
  SET_MERCHANT: merchant => ({ merchant }),
  SET_TOKEN: token => ({ token }),
  SET_USER: user => ({ user }),
  SET_BANK_CARD_ID: bankCardId => ({ bankCardId }),
  SET_BANK_CARD_LIST: bankCardList => ({ bankCardList }),
  SET_BANK_ID: bankId => ({ bankId }),
  SET_BANK_LIST: bankList => ({ bankList }),
})

const {
  setMerchant, setToken, setUser,
  setBankCardId, setBankCardList,
  setBankId, setBankList,
 } = actions;

const X_WIDTH = 375;
const X_HEIGHT = 812;
const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;

const { PlatformConstants = {} } = NativeModules;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const isIPhoneX = (() => {
 if (Platform.OS === 'web') return false;
 const { minor = 0 } = PlatformConstants.reactNativeVersion || {};
 if (minor >= 50) return DeviceInfo.isIPhoneX_deprecated;
 return (
   Platform.OS === 'ios' &&
   ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
     (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
 );
})();

const isIPad = (() => {
  if (Platform.OS !== 'ios' || isIPhoneX) return false;
  if (D_HEIGHT > D_WIDTH && D_WIDTH < PAD_WIDTH) return false;
  if (D_WIDTH > D_HEIGHT && D_HEIGHT < PAD_WIDTH) return false;
  return true;
})();

const isIPhone = (() => {
  if(Platform.OS !== 'ios' || isIPad) return false;
  return true;
})();

const reducers = handleActions({
  [combineActions(
    setMerchant, setToken, setUser,
    setBankCardId, setBankCardList,
    setBankId, setBankList
  )]: (state, { payload }) => ({ ...state, ...payload }),
}, {
  merchant: null,
  token: null,
  user: null,
  bankCardId: null,
  bankCardList: [],
  bankId: null,
  bankList: [],

  ...(() => {
    if (isIPhoneX) {
      return {
        marginTop: 44,
        marginBottom: 34,
      };
    } else if (isIPhone) {
      return {
        marginTop: 20,
        marginBottom: 0,
      };
    } else if(isIPad) {
      return {
        marginTop: 20,
        marginBottom: 0,
      }
    } else {
      return {
        marginTop: 0,
        marginBottom: 0,
      }
    }
  })()
})

export default {
  actions,
  reducers,
}
