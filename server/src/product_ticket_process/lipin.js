import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

const GATEWAY = 'http://www.lipin.com/api';

export default {
  name: '卡卡礼品网',
  config: [
    { label: '商户号', name: 'MerNo' },
    { label: '密钥', name: 'key' },
    { label: '卡类型', name: 'type', list: [
      { label: '京东E卡50', value: '5'},
      { label: '京东E卡100', value: '6'},
    ]}
  ],

  async process({ MerNo, key, type }, {
    ticket_number, ticket_password, code, notify_url
  }) {

    if(type == 5 || type == 6) {
      ticket_password = _(ticket_password.replace(/[\u002d\u2013]/g,'')).chunk(4).map(o => o.join('')).value().join('-')
    }

    const form = {
      orderid: code,
      MerNo,
      urgent: 0,
      type: 0,
      ReturnURL: notify_url,
      remark: '',
      Card: JSON.stringify([
        { type,
          // card: ticket_number, 
          pass: ticket_password },
      ]),
      time: moment().unix()
    };



    console.log(form)
    form.sign = crypto.createHash('md5').update(_.values(form).join('')+key).digest('hex').toUpperCase()
    const resp = await request.post(`${GATEWAY}/submit`, { form } );

    const respJSON = JSON.parse(resp);
    if(respJSON.state != '1'){
      throw new Error(respJSON.msg)
    }
  },

  async notify({ MerNo, key, type }, req, res) {
    const { sign, orderid, money, correct, status, note } = req.body;
    const form = {
      orderid,
      MerNo,
      money,
      correct,
      status
    };
    if(sign != crypto.createHash('md5').update(_.values(form).join('')+key).digest('hex').toLowerCase()){
      res.send('err')
      throw new Error('签名验证失败');
    }
    res.send('ok')
    const bodyJSON = JSON.stringify(req.body);
    if(status != '7'){
      return [ orderid, 3, note, bodyJSON ];
    }
    return [ orderid, 2, note, bodyJSON ];
  },
}
