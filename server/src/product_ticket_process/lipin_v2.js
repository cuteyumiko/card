import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

const GATEWAY = 'http://www.lipin.com/supapi/api';

export default {
  name: '卡卡礼品网v2',
  config: [
    { label: '商户号', name: 'uid' },
    { label: '密钥', name: 'key' },
    { label: '卡类型', name: 'cardid', list: [
      { label: '京东E卡', value: '2'},
      // { label: '京东钢镚', value: '58'},
      // { label: '中石化加油卡无卡号', value: '63'},
    ]},
    { label: '面值', name: 'price' },
  ],

  async process({ uid, key, cardid, price }, {
    ticket_number, ticket_password, code, notify_url
  }) {

    if(cardid == 2) {
      ticket_password = _(ticket_password.replace(/[\u002d\u2013]/g,'')).chunk(4).map(o => o.join('')).value().join('-')
    }

    const form = {
      orderid: code,
      uid,
      urgent: 0,
      cardid,
      type: 0,
      url: notify_url,
      card: JSON.stringify([
        { pass: ticket_password, price },
      ]),
      time: moment().unix(),
      remark: '',
    };

    const signStr = `orderid=${form.orderid}&uid=${form.uid}&urgent=${form.urgent}&cardid=${form.cardid}&type=${form.type}&url=${form.url}&card=${form.card}&time=${form.time}&remark=${form.remark}${key}`
    form.sign = crypto.createHash('md5').update(signStr).digest('hex').toLowerCase();
    console.log(form);
    console.log(signStr);
    const resp = await request.post(`${GATEWAY}/submit`, { form } );

    const respJSON = JSON.parse(resp);
    if(respJSON.state != '1'){
      throw new Error(respJSON.msg)
    }
  },

  async notify({ uid, key, cardid, price }, req, res) {
    console.log(req.body);
    const { sign, orderid, money, correct, state, note } = req.body;
    const form = {
      orderid,
      uid,
      money,
      correct,
      state
    };
    const signStr = `orderid=${form.orderid}&uid=${form.uid}&money=${form.money}&correct=${form.correct}&state=${form.state}${key}`;
    // console.log(signStr);
    // console.log(crypto.createHash('md5').update(signStr).digest('hex').toLowerCase())
    if(sign != crypto.createHash('md5').update(signStr).digest('hex').toLowerCase()){
      throw new Error('签名验证失败');
    }
    res.send('ok')
    const bodyJSON = JSON.stringify(req.body);
    if(state != '7'){
      return [ orderid, 3, note, bodyJSON ];
    }
    return [ orderid, 2, note, bodyJSON ];
  },
}
