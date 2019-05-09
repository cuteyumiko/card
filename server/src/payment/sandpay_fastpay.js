import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

import CONFIG from '../config';
const knex = require('knex')(CONFIG.db);

const GATEWAY = 'https://cashier.sandpay.com.cn';

const public_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyIwo8Jq6XiUSY8cMrDfT
Rb65QaWcPH2hITZrei3jgLIdHP3kTQjZueWhp2nQ7H9s6nD99MYSydB4YKZ5qVAo
VxuwRE1fnNKOx8M3npIcr/JKtvCN5TrE1XIUyxWG3F7sPbsafN+7Gwxqh5gT4/u/
zq5busBztvXh+/woiqi3EGQ1WO9+P4AtYA6nr3KoVU7hdO8Aj+6aXMjQQTtDrgH/
oiAHkEMJfrQmZ6irdnxzRwQ53D/GzVieAqME/sUMeIBWiy/Uj7d2TVJZkLLlC76l
g6AVo/z9Wl26T0wyttxlCzjfZt1naT3B5IIp8k6lYrOdj3SX1gMD3ej0NGnnrQuu
vwIDAQAB
-----END PUBLIC KEY-----`;

export default {
  name: '杉德快捷支付',
  config: [
    { label: '商户号', name: 'mid' },
    { label: '私钥', name: 'private_key', type: 'textarea' },
  ],

  async createPayInfo({ mid, private_key }, order) {

    const {
      clientIp,
      subject, out_trade_no, total_fee, notify_url, return_url,
      creator_id
    } = order;

    const data = {
      head: {
        version: '1.0',
        method: 'sandPay.fastPay.quickPay.index',
        productId: '00000016',
        accessType: '1',
        mid,
        channelType: '07',
        reqTime: moment().format('YYYYMMDDHHmmss'),
      },
      body: {
        userId: creator_id,
        orderCode: out_trade_no,
        orderTime: moment().format('YYYYMMDDHHmmss'),
        totalAmount: _.padStart(parseInt(total_fee * 100), 12, 0),
        subject,
        body: subject,
        currencyCode: 156,
        notifyUrl: notify_url,
        frontUrl: return_url,
        clearCycle: 0,
      }
    }
    console.log(data);

    const form = {
      charset: 'utf-8',
      signType: '01',
      data: JSON.stringify(data),
    };
    form.sign = encodeURIComponent(crypto.createSign('RSA-SHA1').update(form.data).sign(private_key, 'base64'));
    return {
      postForm: {
        form,
        action: `${GATEWAY}/fastPay/quickPay/index`,
      }
    }
  },

  async notify({ mid, productId, private_key }, req, res) {
    const { sign, data } = req.body;

    const sign2 = crypto
      .createVerify('RSA-SHA1')
      .update(data)
      .verify(public_key, sign, 'base64');

    if(!crypto.createVerify('RSA-SHA1').update(data).verify(public_key, sign, 'base64')){
      await knex('bank_logs').insert({
        name: '杉德快捷支付通知签名失败',
        content: JSON.stringify(req.body)
      });
    }else {
      const dataJSON = JSON.parse(data);
      res.send('resp=000000');
      return dataJSON.body.orderCode
    }
  },
}
