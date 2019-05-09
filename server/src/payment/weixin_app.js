import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import cheerio from 'cheerio';
import qs from 'querystring';

import CONFIG from '../config';
const knex = require('knex')(CONFIG.db);

const GATEWAY = 'https://api.mch.weixin.qq.com';

import weixinService from '../service/weixin';

const signObject = (obj, key) => {
  const str = _(obj)
    .map((value, key)=>({key, value}))
    .filter(o=>o.value).sortBy('key')
    .concat({key:'key', value:key})
    .map(o=>`${o.key}=${o.value}`)
    .join('&')
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
}

const obj2xml = obj => `<xml>${_.map(obj, (o,k)=>`<${k}>${o}</${k}>`).join('')}</xml>`

const xml2obj = xml => {
  const $ = cheerio.load(xml, {xmlMode: true});

  let ret = $('xml').children().map((i, el)=>{
    return {
      name: el.name,
      value: $(el).text()
    }
  }).toArray()

  return _(ret).mapKeys('name').mapValues('value').value()
}

export default {
  name: '微信APP支付',
  config: [
    { label: 'AppID', name: 'appid' },
    { label: 'AppSecret', name: 'secret' },
    { label: 'mch_id', name: 'mch_id' },
    { label: 'key', name: 'key' },
  ],

  async createPayInfo({ appid, mch_id, key, secret }, order) {
    const {
      clientIp,
      subject, out_trade_no, total_fee,
      notify_url, wx_open_id, referer_url,
    } = order;

    console.log(wx_open_id);

    const nonce_str = Math.random().toString(36).substr(2, 15);
    const timestamp = moment().unix();

    let reqObject = {
      spbill_create_ip: clientIp,
      appid, mch_id, nonce_str, trade_type: 'APP',
      body:subject, out_trade_no,
      total_fee: total_fee * 100,
      notify_url,
    };

    reqObject.sign = signObject(reqObject, key)

    let xml = await request.post(`${GATEWAY}/pay/unifiedorder`, {
      body:obj2xml(reqObject),
    })

    const { return_code, return_msg, ...respObject } = xml2obj(xml)

    if(return_code != 'SUCCESS'){
      throw new Error(return_msg);
    }

    const weixin_app = {
      appId: appid,
      partnerId: mch_id,
      prepayId: respObject.prepay_id,
      package: 'Sign=WXPay',
      nonceStr: nonce_str,
      timeStamp: timestamp,
      sign: signObject({
        appid, partnerid: mch_id,
        prepayid: respObject.prepay_id,
        package: 'Sign=WXPay', noncestr: nonce_str,
        timestamp,
      }, key)
    }

    return {
      weixin_app,
    }
  },

  async notify({ appid, mch_id, key }, req, res) {
    const xml = req.body;
    console.log(xml);

    const { sign, ...obj } = xml2obj(xml)
    if(sign != signObject(obj, key)){
      console.log('签名失败')
      await knex('bank_logs').insert({
        name: '微信H5支付通知签名失败',
        content: xml
      });
    }else{
      console.log(obj);
      res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
      return obj.out_trade_no;
    }

  },
}
