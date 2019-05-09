import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';

const GATEWAY = 'http://dysmsapi.aliyuncs.com/';

const signObject = (obj, key, method) => {
  const str = method + '&%2F&' + encodeURIComponent(_(obj).map((value, key)=>({key, value:encodeURIComponent(value)})).filter(o=>o.value).sortBy('key').map(o=>`${o.key}=${o.value}`).join('&'));
  return crypto
    .createHmac('sha1', key)
    .update(str)
    .digest('base64')
}

export default {
  name: '阿里大鱼',
  config: [
    { label: 'Access Key ID', name: 'accessKeyId' },
    { label: 'Access Key Secret', name: 'secretAccessKey' },
    { label: '签名名称', name: 'signName' },
    { label: '模版CODE', name: 'templateCode' },
  ],

  async send(mobile, params, { accessKeyId, secretAccessKey, signName, templateCode }) {

    let reqObject = {
      AccessKeyId: accessKeyId, Timestamp: moment().utc().format('YYYY-MM-DD HH:mm:ss') + 'Z',
      SignatureMethod: 'HMAC-SHA1', SignatureVersion: '1.0',
      SignatureNonce: Math.random().toString(36).substr(2, 15),
      Format: 'JSON',
      Action: 'SendSms',
      Version: '2017-05-25',
      RegionId: 'cn-hangzhou',
      PhoneNumbers: mobile,
      SignName: signName,
      TemplateCode: templateCode,
      TemplateParam: JSON.stringify(params)
    };

    reqObject.Signature = signObject(reqObject, secretAccessKey+'&', 'GET');

    console.log(reqObject);
    let result = await request.get(GATEWAY, {
      qs:reqObject, json:true
    })
    console.log(result)

    return {};
  }
}
