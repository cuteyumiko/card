import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

const GATEWAY = 'https://openapi.alipay.com/gateway.do';

const current_public_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvUV3UtUa43iv3k3bYe1x
sozIdSrlpStfO3V14Gi4CmXNpXZQAKkQfCR16T/KQWl3aedOZRaHgKpTvzHcirEo
Wzbx6SL6UUZ6ufjIK6cnXu2/dhHC8C4hHIIbsox69b+D7G/c4WPRmxnQBv+SVI65
CitoXiVMsYV/NVY4321gfK9BSSQTw5IOFos1937JYd9xXheMjpaYanACC4eZkW1M
tIIzLnxS0nRNNeGPFufd/1JSrfwtLNQOZBLdTGAnsYhAoQAL0xsrwnQXHDTXEhpH
am935SUqsD7v/L0JKY+Jcs7Nr0Ow28B/BYk5o/hehDbj5fphWszYzOBlqMl9jJW3
gwIDAQAB
-----END PUBLIC KEY-----`

export default {
  name: '支付宝 (APP支付)',
  config: [
    { label: 'App ID', name: 'app_id' },
    { label: '商户私钥', name: 'private_key', type: 'textarea' },
    { label: '支付宝公钥匙', name: 'public_key', type: 'textarea' },
  ],

  async createPayInfo({ app_id, private_key, public_key }, order) {
    const {
      subject, out_trade_no, total_fee, notify_url, return_url
    } = order;

    let data = {
      app_id, method: 'alipay.trade.app.pay',
      charset: 'utf-8', sign_type: 'RSA2',
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'), version: '1.0',
      notify_url,
      biz_content: JSON.stringify({
        subject, out_trade_no, product_code: 'QUICK_MSECURITY_PAY',
        total_amount: total_fee.toFixed(2),
      })
    }
    data.sign = crypto
      .createSign('RSA-SHA256')
      .update(_(data).map((value, key)=>({key, value})).filter(o=>o.value).sortBy('key').map(o=>`${o.key}=${o.value}`).join('&'))
      .sign(private_key, 'base64');

    const alipay_app = qs.stringify(data);
    return { alipay_app }
  },

  async notify({ partner, private_key, public_key }, req, res) {
    res.send('success')

    console.log(req.body);

    const { sign, sign_type, ...data } = req.body;

    const ret = crypto
      .createVerify('RSA-SHA256')
      .update(_(data).map((value, key)=>({key, value})).filter(o=>o.value).sortBy('key').map(o=>`${o.key}=${o.value}`).join('&'))
      .verify(public_key, sign, 'base64');
    console.log(ret);
    if(!ret) return;

    const { out_trade_no } = data;
    return out_trade_no;
  },
}
