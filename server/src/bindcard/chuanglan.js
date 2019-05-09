import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

import NodeRSA from 'node-rsa';

const GATEWAY = 'https://api.253.com/open/bankcard/card-auth-detail';


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
  name: '创蓝万数253',
  config: [
    { label: 'APPID', name: 'appId' },
    { label: 'APPID', name: 'appKey' },
  ],

  async applyBind({ appId, appKey }, { ...order }) {

    const {
      bank_card_name, bank_id, bank_card_no, mobile, idno,
    } = order;

    const form = {
      appId,
      appKey,
      name: bank_card_name, idNum: idno,
      cardNo: bank_card_no, mobile
    }

    console.log(form);
    let body = await request.post(`${GATEWAY}`, { form, json: true });
    console.log({body});


    if(body.code === '200000' && body.data.result === '01') return;

    throw new Error( (body.data && body.data.remark) || body.message);
  },

  async notify({ mid, productId, private_key, certificate }, req, res) {

  },
}
