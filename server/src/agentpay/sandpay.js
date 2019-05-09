import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

import NodeRSA from 'node-rsa';

const GATEWAY = 'https://caspay.sandpay.com.cn/agent-main/openapi';

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
  name: '杉德支付',
  config: [
    { label: '商户号', name: 'merId' },
    { label: '产品列表', name: 'productId', list: [
      { label: '代付对私', value: '00000004'},
    ]},
    { label: '私钥', name: 'private_key', type: 'textarea' },
  ],

  async payment({ merId, productId, private_key }, { code: orderCode, ...order }) {

    const nonce_str = Math.random().toString(36).substr(2, 3);

    orderCode = `${orderCode}-${nonce_str}`;
    const encrypt = (data, pk) => {
      const rsa = new NodeRSA(pk)
      rsa.setOptions({encryptionScheme: 'pkcs1'})

      const aesKey = Math.random().toString(36).substr(2, 16);
      const dataJSON = JSON.stringify(data);
      console.log(aesKey);

      const encryptKey = rsa.encrypt(aesKey, 'base64');

      const cipher = crypto.createCipheriv('aes-128-ecb', aesKey, '');
      cipher.setAutoPadding(true)
      let encryptData = cipher.update(dataJSON, 'utf8', 'base64');
      encryptData += cipher.final('base64');

      const sign = crypto
        .createSign('RSA-SHA1')
        .update(dataJSON)
        .sign(private_key, 'base64');

      return { encryptKey, encryptData, sign }
    }

    const decrypt = (encryptData, encryptKey, pk) => {
      const rsa = new NodeRSA(pk);
      rsa.setOptions({encryptionScheme: 'pkcs1'})

      let aesKey = new Buffer(rsa.decrypt(encryptKey, 'base64'), 'base64').toString();
      console.log(aesKey)

      const decipher = crypto.createDecipheriv('aes-128-ecb', aesKey, '')
      decipher.setAutoPadding(true)
      let dataJSON = decipher.update(encryptData, 'base64','utf8')
      dataJSON += decipher.final('utf8');
      return dataJSON;
    }

    const {
      bank_card_no, bank_card_name, money,
    } = order;


    const data = {
      version: '01',
      productId,
      tranTime: moment().format('YYYYMMDDHHmmss'),
      orderCode,
      tranAmt: _.padStart(parseInt(money * 100), 12, 0),
      currencyCode: '156',
      accAttr: '0',
      accType: '4',
      accNo: bank_card_no,
      accName: bank_card_name,
      remark: '提现',
    };

    const form = {
      transCode: 'RTPM',
      merId,
      ...encrypt(data, public_key),
    }

    console.log(form,data);
    let body = await request.post(`${GATEWAY}/agentpay`, { form });
    body = qs.parse(body);
    console.log({body});

    let respData = decrypt(body.encryptData, body.encryptKey, private_key);
    console.log(respData);

    respData = JSON.parse(respData);
    if(respData.respCode != '0000' || respData.resultFlag != '0'){
      throw new Error(respData.respDesc)
    }
  },

  async notify({ mid, productId, private_key, certificate }, req, res) {

  },
}
