import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import cheerio from 'cheerio';
import qs from 'querystring';

import CONFIG from '../config';
const knex = require('knex')(CONFIG.db);

const GATEWAY = 'https://api.mch.weixin.qq.com';

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
  name: '微信h5支付',
  config: [
    { label: 'AppID', name: 'appid' },
    { label: 'mch_id', name: 'mch_id' },
    { label: 'key', name: 'key' },
  ],

  async createPayInfo({ appid, mch_id, key }, order) {
    const {
      clientIp,
      subject, out_trade_no, total_fee,
      notify_url,
    } = order;

    const nonce_str = Math.random().toString(36).substr(2, 15);

    let reqObject = {
      spbill_create_ip: clientIp,
      appid, mch_id, nonce_str, trade_type: 'MWEB',
      body:subject, out_trade_no,
      total_fee: total_fee * 100,
      notify_url,
    };

    reqObject.sign = signObject(reqObject, key)

    let xml = await request.post(`${GATEWAY}/pay/unifiedorder`, {
      body:obj2xml(reqObject),
    })

    const { sign, ...respObject } = xml2obj(xml)

    if(sign != signObject(respObject, key)){
      throw new Error('响应签名错误')
    }

    if(respObject.return_code != 'SUCCESS'){
      throw new Error(respObject.return_msg)
    }

    return {
      paymentLink: respObject.mweb_url
    }
  },

  async notify({ appid, mch_id, key }, req, res) {
    const xml = req.body;

    const { sign, ...obj } = xml2obj(xml)
    if(sign != signObject(obj, key)){
      await knex('bank_logs').insert({
        name: '微信H5支付通知签名失败',
        content: xml
      });
    }else{
      res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
      return obj.out_trade_no;
    }

  },
}
