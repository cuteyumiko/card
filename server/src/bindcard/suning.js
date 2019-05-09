import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

import NodeRSA from 'node-rsa';

const GATEWAY = 'https://fopenapi.suning.com/v2/gateway.htm';

const public_key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCbFR1mQQxAnXtzEZIp/Lo4RVzU2c/FGCc7QoR
HqBQTAxRXtn+n94ldgQBauDNm+nMu5UtsS0r+hXfaeTdJrhJ7pMZUy90kjLdvmzJ5EbjoQGoJdCz
mthWBNvRD+m2tAAxYbDb0mcCpvor93RIkbkcphZudCvkG8+/xAfNmJdyZQIDAQAB
-----END PUBLIC KEY-----`;

export default {
  name: '苏宁绑卡',
  config: [
    { label: '商户号', name: 'merchantNo' },
    { label: 'app_id', name: 'app_id' },
    { label: '私钥', name: 'private_key', type: 'textarea' },
  ],

  async applyBind({ merchantNo, app_id, private_key }, { bank_card_name, bank_card_no, idno, mobile, code: outOrderNo }) {

    const encrypt = (data, pk) => {

      const str = _(data)
        .map((value, key)=>({key, value}))
        .filter(o=>o.value).sortBy('key')
        .map(o=>`${o.key}=${o.value}`)
        .join('&')
      console.log(str);
      const hash = crypto.createHash('md5').update(str).digest('hex').toUpperCase();
      console.log(hash);
      return crypto.createSign('RSA-SHA1').update(hash).sign(pk, 'base64');
    }

    const cardInfo = {
      hostName: bank_card_name,
      cardNo: bank_card_no,
      certType: '01',
      certNo: idno,
      telNo: mobile,
    };

    const form = {
      timestamp: moment().format('YYYYMMDDHHmmss'),
      cardInfo: JSON.stringify(cardInfo),
      outOrderNo,
      service: 'suning.fosps.epp.authenticatefacade.authenticate',
      app_id,
      merchantNo,
      serviceType: 4,
      version: '1.0',
    };

    form.sign = encrypt(form, private_key);
    form.signkey_index = '0001';
    form.sign_type = 'RSA2';

    let body = await request.post(`${GATEWAY}`, { form });
    // body = qs.parse(body);
    console.log({body});


    let respData = JSON.parse(body);
    console.log(respData);

    if(respData.responseCode != '0000'){
      throw new Error(respData.responseMsg)
    }

    return 4;


  },

  async payment({ merchantNo, productCode, private_key }, { code: orderCode, ...order}) {

    const nonce_str = Math.random().toString(36).substr(2, 3);

    orderCode = `${orderCode}-${nonce_str}`;
    const encrypt = (data, pk) => {

      const str = _(data)
        .map((value, key)=>({key, value}))
        .filter(o=>o.value).sortBy('key')
        .map(o=>`${o.key}=${o.value}`)
        .join('&')
      console.log(str);
      const hash = crypto.createHash('md5').update(str).digest('hex').toUpperCase();

      return crypto.createSign('RSA-SHA1').update(hash).sign(pk, 'base64');
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
      bank_name, bank_code, notify_url,
    } = order;


    // const data = {
    //   version: '01',
    //   productId,
    //   tranTime: moment().format('YYYYMMDDHHmmss'),
    //   orderCode,
    //   tranAmt: _.padStart(parseInt(money * 100), 12, 0),
    //   currencyCode: '156',
    //   accAttr: '0',
    //   accType: '4',
    //   accNo: bank_card_no,
    //   accName: bank_card_name,
    //   remark: '提现',
    // };

    // const form = {
    //   transCode: 'RTPM',
    //   merId,
    //   ...encrypt(data, public_key),
    // }

    const form = {
      merchantNo,
      publicKeyIndex: '0001',
      inputCharset: 'UTF-8',
      body: JSON.stringify([{
        batchNo: orderCode,
        merchantNo,
        productCode,
        totalNum: 1,
        totalAmount: parseInt(money * 100),
        currency: 'CNY',
        payDate: moment().format('YYYYMMDD'),
        notifyUrl: notify_url,
        detailData: [{
          serialNo: orderCode,
          receiverCardNo: bank_card_no,
          receiverName: bank_card_name,
          receiverType: 'PERSON',
          receiverCurrency: 'CNY',
          bankName: bank_name,
          bankCode: bank_code,
          amount: parseInt(money * 100),
        }],
      }])
    }


    form.signature = encrypt(form, private_key),
    form.signAlgorithm = 'RSA',

    console.log(form);
    let body = await request.post(`${GATEWAY}`, { form });
    // body = qs.parse(body);
    console.log({body});


    // if(body) {
    //   const rsa = new NodeRSA(private_key);
    //   rsa.setOptions({encryptionScheme: 'pkcs1'})
    //
    //   let aesKey = rsa.decrypt(body.encryptKey, 'base64');
    //   aesKey = new Buffer(aesKey, 'base64').toString()
    //   const decipher = crypto.createDecipheriv('aes-128-ecb', aesKey, '')
    //   decipher.setAutoPadding(true)
    //   body.data = decipher.update(body.encryptData, 'base64','binary')
    //   body.data += decipher.final('binary');
    // }

    let respData = JSON.parse(body);
    console.log(respData);

    if(respData.responseCode != '0000'){
      throw new Error(respData.responseMsg)
    }

    return 4;

    // console.log('加密测试')
    // const { encryptKey, encryptData } = encrypt('衫德支付', public_key)
    // console.log({ encryptKey, encryptData })
    // console.log('解密测试')
    // const testdata = decrypt(encryptData, encryptKey, private_key);
    // console.log(testdata)


    // let respAceKey = privateRsa.decrypt(body.encryptKey, 'base64');
    // respAceKey = new Buffer(respAceKey, 'base64').toString()
    // let decipher = crypto.createDecipheriv('aes-128-ecb', respAceKey, '')
    // decipher.setAutoPadding(true)
    // let dec = decipher.update(body.encryptData, 'base64','binary')
    // dec += decipher.final('binary')
    // console.log(dec)
    console.log(1)
  },

  async notify({ mid, productId, private_key, certificate }, req, res) {

    console.log('苏宁通知');
    const { content, sign, sign_type, vk_version } = req.body;
    console.log({content, sign, sign_type, vk_version})

    const responseObject = JSON.parse(content);

    return responseObject.batchNo.split('-')[0];
  },
}
