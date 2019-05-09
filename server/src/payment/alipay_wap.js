import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

const GATEWAY = 'https://openapi.alipay.com/gateway.do';

export default {
  name: '支付宝WAP(新版)',
  config: [
    { label: 'App ID', name: 'app_id' },
    { label: '私钥', name: 'private_key', type: 'textarea' },
  ],

  async createPayInfo({ app_id, private_key }, order) {
    const {
      subject, out_trade_no, total_fee, notify_url, return_url
    } = order;

    let data = {
      app_id, method: 'alipay.trade.wap.pay',
      charset: 'utf-8', sign_type: 'RSA2',
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'), version: '1.0',
      notify_url, return_url,
      biz_content: JSON.stringify({
        subject, out_trade_no, product_code: 'QUICK_WAP_WAY',
        total_amount: total_fee.toFixed(2),
      })
    }
    data.sign = crypto
      .createSign('RSA-SHA256')
      .update(_(data).map((value, key)=>({key, value})).filter(o=>o.value).sortBy('key').map(o=>`${o.key}=${o.value}`).join('&'))
      .sign(private_key, 'base64');

    const paymentLink = [GATEWAY, qs.stringify(data)].join('?');
    return { paymentLink }
  }
}
