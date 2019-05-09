import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

const GATEWAY = 'https://mapi.alipay.com/gateway.do';

const public_key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnxj/9qwVfgoUh/y2W89L6BkRA
FljhNhgPdyPuBV64bfQNN1PjbCzkIM6qRdKBoLPXmKKMiFYnkd6rAoprih3/PrQE
B/VsW8OoM8fxn67UDYuyBTqA23MML9q1+ilIZwBC2AQ2UBVOrFXfFl75p6/B5Ksi
NG9zpgmLCUYuLkxpLQIDAQAB
-----END PUBLIC KEY-----`

export default {
  name: '支付宝WAP(mapi)',
  config: [
    { label: 'PID', name: 'partner' },
    { label: '私钥', name: 'private_key', type: 'textarea' },
  ],

  async createPayInfo({ partner, private_key }, order) {
    const {
      subject, out_trade_no, total_fee, notify_url, return_url
    } = order;

    let data = {
      service:'alipay.wap.create.direct.pay.by.user', partner,
      _input_charset: 'utf-8', notify_url, return_url,
      out_trade_no, subject,
      payment_type: '1', total_fee: total_fee.toFixed(2),
      show_url: return_url,
    };

    data.sign = crypto
      .createSign('RSA-SHA1')
      .update(_(data).map((value, key)=>({key, value})).filter(o=>o.value).sortBy('key').map(o=>`${o.key}=${o.value}`).join('&'))
      .sign(private_key, 'base64')
    data.sign_type = 'RSA'

    const paymentLink = [GATEWAY, qs.stringify(data)].join('?')
    return { paymentLink };
  },

  async notify({ partner, private_key }, req, res) {
    res.send('success')

    console.log(req.body);

    const { sign, sign_type, ...data } = req.body;

    const ret = crypto
      .createVerify('RSA-SHA1')
      .update(_(data).map((value, key)=>({key, value})).filter(o=>o.value).sortBy('key').map(o=>`${o.key}=${o.value}`).join('&'))
      .verify(public_key, sign, 'base64');
    console.log(ret);
    if(!ret) return;

    const { out_trade_no } = data;
    return out_trade_no;
  },
}
