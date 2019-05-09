import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import url from 'url';
import qs from 'querystring';

import CONFIG from '../config';
const knex = require('knex')(CONFIG.db);

const wrap = fn => (req, res, next) => fn(req, res, next).catch(async e => {
  const { user = {} } = req;
  const message = e.message;
  await objectService.postObject('system_log', {
    name: `请求 [ ${req.originalUrl} ] 出错 [ ${message} ]`, level_id: 3,
    create_ip: req.ip, creator_id: user.id,
    content: e.stack
  });
  res.status(500).send(message)
});
const router = require('express').Router();

import path from 'path';
import crypto from 'crypto';

import smsPass from '../sms';
import paymentPass from '../payment';
import agentpayPass from '../agentpay';
import bindcardPass from '../bindcard';
import productTicketProcessPass from '../product_ticket_process';

import orderService from '../service/order';
import balanceService from '../service/balance';
import weixinService from '../service/weixin';
import objectService from '../object';

const db = {
  async log(content, name, merchant_id) {
    await knex('bank_logs').insert({
      merchant_id,
      name,
      content
    })
  }
}

const signObject = obj => {
  const str = _(obj)
    .map((value, key)=>({key, value}))
    .filter(o=>o.value).sortBy('key')
    .map(o=>`${o.key}=${o.value}`)
    .join('&')
  return crypto.createHash('sha1').update(str).digest('hex').toUpperCase()
}

router.use(async (req, res, next) => {

  const { host } = req.headers;
  const token = req.headers['x-token'];
  const { protocol } = req;

  req.merchant = await knex('bank_merchant').where({host}).first();

  if(token){
    const user_token = await knex('bank_user_token').where({token}).whereNull('cancel_time').first();
    if(user_token){
      const { user_id } = user_token;
      const user = await knex('bank_user').where({id: user_id}).first();
      if(user && user.merchant_id) {
        user.merchant = await knex('bank_merchant').where({id: user.merchant_id}).first();
      }
      req.user = user;
    }
  }
  next();
});

const upload = require('multer')({dest: 'runtime/upload' });
const md5File = require('md5-file/promise');
const fs = require('fs-extra')
const qiniu = require('qiniu');

const putFile = (key, localFile) => new Promise((resolve, reject) => {
  const config = new qiniu.conf.Config();
  const formUploader = new qiniu.form_up.FormUploader(config);

  const accessKey = 'accessKey';
  const secretKey = 'secretKey';
  const scope = 'hello';

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const putPolicy = new qiniu.rs.PutPolicy({scope});
  const uploadToken = putPolicy.uploadToken(mac);
  const putExtra = new qiniu.form_up.PutExtra();

  formUploader.putFile(uploadToken, key, localFile, putExtra, (err, body, info) => {
    if(err) reject(err); else resolve({body, info});
  });
})
router.post('/upload', upload.any(), async (req, res, next) => {

  const list = await Promise.all(_.map(req.files, async o => {
    const md5 = await md5File(o.path);
    const newpath = path.join(md5, o.originalname);

    await putFile(newpath, o.path);
    await fs.move(o.path, path.join(o.destination, newpath), { overwrite: true });
    return {
      status: 'success',
      name: o.originalname,
      url: `https://cdn.hello.com/${newpath}`,//`/upload/${newpath}`
    }
  }))

  const { format } = req.query;

  if(format == 'tinymce'){
    res.json({ location: list[0].url });
  } else {
    res.json(list);
  }

})

router.post('/authorize', wrap(async (req, res, next) => {
  const { merchant } = req;
  const { account, mobile, username, password, auth_type } = req.body;
  const user_agent = req.headers['user-agent'];
  const merchant_id = merchant ? merchant.id : null;

  await db.log(auth_type, '/authorize', merchant_id);
  if(!account && !mobile && !username) throw new Error('用户名不能为空');
  if(!password) throw new Error('密码不能为空');

  const dao = knex('bank_user');

  let user_type = null;
  if(auth_type == 'oem-admin-pc') {
    user_type = 2;
  }else if(auth_type == 'admin-pc') {
    user_type = 1;
  }else {
    user_type = 3;
  }

  if(mobile) {
    dao.where({merchant_id, mobile, password, user_type})
  }else if(username) {
    dao.where({merchant_id, username, password, user_type})
  }else {
    dao.where({merchant_id, username:account, password, user_type})
    .orWhere({merchant_id, mobile:account, password, user_type})
  }

  const user = await dao.first();

  if(!user) throw new Error('错误的用户名或密码')

  if(user.is_disabled) throw new Error(user.disabled_reason || '账号不存在');

  const ts = moment().unix();
  const token = new Buffer(`user:${user.id}:${ts}`).toString('base64');

  const data = { user_agent, token };
  data.user_id = user.id;
  data.create_ip = req.ip;
  await knex('bank_user_token').insert(data);
  const info = {
    id: user.id,
    display_name: user.nickname || user.name || user.mobile || user.username,
    user: await knex('v_bank_user').where({id: user.id}).first(),
    merchant,
  };
  res.status(201).json({token, info})
}));

router.post('/register', wrap(async (req, res, next) => {
  const { merchant } = req;
  const { referee_0_mobile, sms_code_id, sms_code, ...data } = req.body;
  const { mobile } = data;

  if(!merchant) throw new Error('商户信息不存在');

  const id = await objectService.postObject('user', {
    ...req.body,
    merchant_id: merchant.id,
    create_ip: req.ip,
    user_type: 3,
  })
  return res.json({id});
}));

router.post('/reset_password', async (req, res, next) => {
  const { merchant } = req;
  const { sms_code, ...data } = req.body;
  const { mobile } = data;

  if(!merchant) return res.status(500).send('商户不存在')
  const merchant_id = merchant.id;
  let user = await knex('bank_user').where({mobile, merchant_id}).first();

  if(!user) {
    return res.status(500).send('该手机号还不是会员')
  }

  const smsCode = await knex('bank_sms_code').where({mobile, code: sms_code}).whereNull('update_time').first();
  if(!smsCode){
    return res.status(400).send('验证码不正确')
  }else {
    await knex('bank_sms_code').where({id: smsCode.id}).update({update_time: moment().toDate(), update_ip: req.ip});
  }

  const id = user.id;
  await knex('bank_user').where({id}).update({password: data.password});
  res.status(200).json({id})
})

router.get('/token_info', async (req, res, next) => {
  const { merchant, user } = req;
  if(!user) return res.status(404).send('对象不存在');
  const info = {
    id: user.id,
    display_name: user.nickname || user.name || user.mobile || user.username,
    user: await knex('v_bank_user').where({id: user.id}).first(),
    merchant,
  };
  res.json(info)
});

router.post('/exchange_wxopenid', async (req, res, next) => {
  const { code } = req.body;
  console.log(code)
  const [appid, secret] = ['wx665c06ee53103fbb', '58c2ff5e1313f64ed1e48110dcdd0180'];

  if(!code) return res.status(500).send('code不能为空');

  let body = await request.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
    qs:{
      appid, secret, code, grant_type: 'authorization_code'
    }, json:true
  })

  let { errcode, openid, access_token } = body;
  if(errcode) return res.status(500).send(`${errcode}`);

  res.send(openid)
});

router.post('/wx_config', async (req, res, next) => {
  const { merchant } = req;
  const { wx_appid, wx_secret } = merchant;

  if(!wx_appid || !wx_secret) return res.status(404).send('没有配置wx_appid或wx_secret');
  // const [appid, secret] = ['wx665c06ee53103fbb', '58c2ff5e1313f64ed1e48110dcdd0180'];

  const nonce_str = Math.random().toString(36).substr(2, 15);
  const timestamp = moment().unix();

  console.log({wx_appid, wx_secret})
  const access_token = await weixinService.getAccessToken(wx_appid, wx_secret);
  console.log({access_token})
  const jsapi_ticket = await weixinService.getJsapiTicket(access_token);
  console.log({jsapi_ticket})


  const { url } = req.body;
  console.log(url);

  const configObj = {
    noncestr: nonce_str, jsapi_ticket, timestamp, url
  }

  const config = {
    appId: wx_appid,
    timestamp: configObj.timestamp,
    nonceStr: configObj.noncestr,
    signature: signObject(configObj),
  }
  console.log(config)

  res.json(config);
});

router.get('/weixin', async (req, res, next) => {
  const access_token = await weixinService.getAccessToken('wx665c06ee53103fbb', '58c2ff5e1313f64ed1e48110dcdd0180');
  const jsapi_ticket = await weixinService.getJsapiTicket(access_token);
  res.json({access_token, jsapi_ticket})
});

router.get('/user/:id', async (req, res, next) => {
  const { merchant } = req;
  const merchant_id = merchant ? merchant.id : null;
  const { id } = req.params;
  const dao = knex('bank_user').where({id})

  if(merchant_id){
    dao.where({merchant_id});
  }

  const item = await dao.first();
  if(!item) return res.status(404).send('对象不存在')
  res.json(_.omit(item, ['password']));
});

router.post('/user', async (req, res, next) => {
  const { merchant } = req;
  const { referee_0_mobile, ...data } = req.body;
  const merchant_id = merchant ? merchant.id : data.merchant_id;

  if(data.mobile){
    if(!/^\d{11}$/.test(data.mobile)) return res.status(422).send('手机号格式有误');
    if(await knex('bank_user').where({mobile: data.mobile, merchant_id}).first()) return res.status(409).send('手机号已存在');
  }

  if(data.username){
    if(/^[0-9]*$/.test(data.username)) return res.status(422).send('用户名不能为全数字');
    if(await knex('bank_user').where({username: data.username, merchant_id}).first()) return res.status(409).send('用户名已存在');
  }

  if(referee_0_mobile){
    const referee = await knex('bank_user').where({merchant_id, mobile: referee_0_mobile}).first();
    if(!referee) return res.status(500).send('推荐人手机号不是会员')
    data.referee_id = referee.id
  }

  data.merchant_id = merchant_id;
  data.create_ip = req.ip;
  let id = await knex('bank_user').returning('id').insert(data);
  id = id[0]
  res.status(201).json({...data, id})
});

router.patch('/user/:id', wrap(async (req, res, next) => {
  const { merchant, user } = req;
  const { referee_0_mobile, password, ...data } = req.body;
  const { id } = req.params

  const item = await objectService.getObject('user', {id});

  await objectService.patchObject('user', { id }, req.body, { user });

  if(data.level_id && item.level_id != data.level_id) {
    console.log(2)
    const newLevel = await knex('bank_user_level').where({id: data.level_id}).first();
    if(newLevel.value > item.level_value) {
      console.log(3)
      const smsList = [];
      smsList.push({
        sms_code: 'level_order.status.2.0',
        mobile: data.mobile || item.mobile,
        from_level_name: item.level_name,
        to_level_name: newLevel.name,
      });

      if(smsList.length) {
        await Promise.all(_.map(smsList, async ({ sms_code, mobile, ...o}) => {
          const sms = await knex('v_m_bank_sms').where({code: sms_code, merchant_id: item.merchant_id}).first();
          if(sms) {
            const pass = smsPass[sms.pass_code];
            if(pass) {
              await pass.send(mobile, o, JSON.parse(sms.pass_config))
            }
          }
        }))
      }
    }
  }

  res.status(200).json({...data, id})
}));

router.delete('/user/:id', wrap(async (req, res, next) => {
  const { merchant } = req;
  const merchant_id = merchant ? merchant.id : null;
  const { id } = req.params

  const where = { id };
  if(merchant_id){
    where.merchant_id = merchant_id;
  }

  await knex('bank_user').where(where).delete();
  res.sendStatus(204)
}));

router.get('/pass/:type', wrap(async (req, res, next) => {
  const map = {
    sms: smsPass,
    payment: paymentPass,
    agentpay: agentpayPass,
    bindcard: bindcardPass,
    product_ticket_process: productTicketProcessPass };
  const { type } = req.params;
  const pass = map[type];
  if(!pass) return next();
  res.json(_.map(pass, ({ name, config }, code) => ({ code, name, config })));
}));

router.get('/i', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) return res.status(401).send('没有提供认证信息');

  const directUser = {
    level: (await knex('bank_user').select('level_id').count('id as total').groupBy('level_id').where({referee_id: user.id})),
  };

  const indirectUser = {
    level: (await knex('v_bank_user').select('level_id').count('id as total').groupBy('level_id')
      .orWhere({referee_1_id: user.id}).orWhere({referee_2_id: user.id}).orWhere({referee_3_id: user.id})
      .orWhere({referee_4_id: user.id}).orWhere({referee_5_id: user.id}).orWhere({referee_6_id: user.id})
      .orWhere({referee_7_id: user.id}).orWhere({referee_8_id: user.id}).orWhere({referee_9_id: user.id})),
  }

  res.json({directUser, indirectUser});
}));


router.get('/i/chief', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) return res.status(401).send('没有提供认证信息');

  const userTree = await knex('v_bank_user').where({id: user.id }).first();

  const ids = _.compact([
    userTree.referee_id,
    userTree.referee_1_id, userTree.referee_2_id, userTree.referee_3_id,
    userTree.referee_4_id, userTree.referee_5_id, userTree.referee_6_id,
    userTree.referee_7_id, userTree.referee_8_id, userTree.referee_9_id
  ])

  let userList = await knex('v_bank_user').whereIn('id', ids);
  userList = _.sortBy(userList, o => ids.indexOf(o.id))

  const chief = _.find(userList, o => o.level_income_money > userTree.level_income_money)

  res.json(chief);
}));

router.get('/i/info', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) return res.status(401).send('没有提供认证信息');
  const { nickname, name, mobile, weixin, weixin_qr } = user;

  res.json({
    nickname, name, mobile, weixin, weixin_qr
  })
}));

router.post('/i/info', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) return res.status(401).send('没有提供认证信息');

  const data = _.defaults(
    _.pick(req.body, ['nickname', 'name', 'weixin', 'weixin_qr', 'head_image', 'shop_message']),
    _.pick(user, ['nickname', 'name', 'weixin', 'weixin_qr', 'head_image', 'shop_message']),
  )

  await knex('bank_user').where({id: user.id}).update({
    ...data,
    status: (data.nickname&&data.name&&data.weixin) ? 2 : 1,
  })

  res.sendStatus(201);
}));

router.get('/i/user', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) return res.status(401).send('没有提供认证信息');

  let { offset, limit, order, ...query } = req.query;
  offset = Math.max(parseInt(offset) || 0, 0);
  limit = Math.max(parseInt(limit) || 0, 0);
  const dao = knex('v_bank_user_team'), daoCount = knex('v_bank_user_team');

  dao.where({referee_id: user.id});
  daoCount.where({referee_id: user.id});

  _.forEach(query, (value, key) => {
    const args = key.split('__');
    if(args.length == 1){
      if(value === ''){
        dao.whereNull(key)
        daoCount.whereNull(key)
      }else{
        dao.where(key, value)
        daoCount.where(key, value)
      }
    }else if(args.length == 2){
      if(args[1] == 'like'){
        dao.where(args[0], 'like', `%${value}%`)
        daoCount.where(args[0], 'like', `%${value}%`)
      }else if(args[1] == 'gt') {
        dao.where(args[0], '>', value)
        daoCount.where(args[0], '>', value)
      }
    }
  })

  if(order){
    _.forEach(order.split(','), o => {
      if(_.endsWith(o, '+')){
        dao.orderBy(_.trimEnd(o,'+'), 'asc')
      }else{
        dao.orderBy(_.trimEnd(o,'-'), 'desc')
      }
    })
  }

  if(limit) dao.offset(offset).limit(limit)
  let list = await dao;
  list = _.map(list, ({password, ...o}) => ({
    ...o,
    create_time: o.create_time ? moment(o.create_time).unix() : o.create_time,
    update_time: o.update_time ? moment(o.update_time).unix() : o.update_time,
  }));
  const { total } = await daoCount.count('id as total').first()
  res.set('X-Total-Count', total).json(list)
}));

const myObjectConfig = {
  'product_card_order_income': { view: 'v_bank_product_card_order_income' },
  'product_loan_order_income': { view: 'v_bank_product_loan_order_income' },
  'product_ticket_order_income': { view: 'v_bank_product_ticket_order_income' },
  'user_level_order_income': { view: 'v_bank_user_level_order_income' },
  'user_balance': { view: 'v_bank_user_balance' },
  'user_bank_card': { view: 'v_bank_user_bank_card' },
  'cash_order': { view: 'v_bank_cash_order'},
  'user_team': { view: 'v_bank_user_team' },
};

router.get('/i/:object', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) throw new Error('用户信息不存在')

  const { object } = req.params;
  const { total, list } = await objectService.getObjectList(`${object}@user`, {
    ...req.query,
    user_id: user.id,
  });
  res.set('object-server', '1').set('X-Total-Count', total).json(list);
}));

router.post('/i/password', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) throw new Error('用户信息不存在');

  const { old_password, new_password } = req.body;

  if(user.password != old_password) throw new Error('旧密码错误');

  await objectService.patchObject('user', { id: user.id}, { password: new_password });
  res.sendStatus(200)
}));

router.get('/my/:object', wrap(async (req, res, next) => {
  const { object } = req.params;
  const { user } = req;
  if(!user) throw new Error('用户信息不存在');

  const result = await objectService.getObjectProperty('user', user.id, object, req.query);

  if(result.list) {
    const { list, total } = result;
    res.set('X-Total-Count', total).json(list)
  } else {
    res.set('X-Total-Count', result.length).json(result)
  }
}));

router.get('/m/price', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');
}));

router.post('/sms_code', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');

  const dao = knex('bank_sms_code').returning('id');

  const { ...data } = req.body;
  const { mobile, code: sms_code } = data;
  if(!mobile) return res.status(400).send('手机号不能为空');
  const sms = await knex('v_m_bank_sms').where({code: sms_code, merchant_id: merchant.id}).first();
  if(!sms) return res.status(400).send('短信通道未配置，请联系管理员');
  const pass = smsPass[sms.pass_code];
  if(!pass) return res.status(400).send(`编码为${sms.pass_code}的通道未实现，请联系管理员`);

  const user = await knex('bank_user').where({mobile, merchant_id: merchant.id}).first();

  if(sms_code == 'join.code') {
    if(user) return res.status(500).send('该手机号已注册');
  }else if(sms_code == 'reset.code') {
    if(!user) return res.status(500).send('该手机号未注册');
  }

  const code = Math.random().toString(10).substr(2, 4);
  data.code = code;
  data.create_ip = req.ip;

  let id = (await dao.insert(data))[0];
  const result = await pass.send(mobile, { code }, JSON.parse(sms.pass_config))

  res.status(201).json({id})
}));


router.post('/m/user', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');

  const { referee_0_mobile, ...data } = req.body;

  if(referee_0_mobile){
    const referee = await knex('bank_user').where({merchant_id: merchant.id, mobile: referee_0_mobile}).first();
    if(!referee) return res.status(500).send('推荐人手机号不是会员')
    data.referee_id = referee.id
  }

  const dao = knex('bank_user').returning('id');

  data.create_ip = req.ip;
  data.merchant_id = merchant.id;
  if(req.user) data.creator_id = req.user.id;

  let id = (await dao.insert(data))[0];
  res.status(201).json({id})
}));

router.patch('/m/user/:id', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');
  const { id } = req.params;

  const { referee_0_mobile, ...data } = req.body;
  if(referee_0_mobile){
    const referee = await knex('bank_user').where({merchant_id, mobile: referee_0_mobile}).first();
    if(!referee) return res.status(500).send('推荐人手机号不是会员')
    data.referee_id = referee.id
  }
  const dao = knex('bank_user').where({id, merchant_id: merchant.id});
  data.update_ip = req.ip;
  data.update_time = moment().toDate();

  await dao.update(data);
  res.status(200).json({...data, id})
}));

const merchantObjectConfig = objectService.merchantObjectConfig;

router.get('/m/:object', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) throw new Error('商户信息不存在');

  const { object } = req.params;
  const { total, list } = await objectService.getObjectList(`${object}@merchant`, {
    ...req.query,
    merchant_id: merchant.id,
  });
  res.set('object-server', '1').set('X-Total-Count', total).json(list);
}));

router.get('/m/:object/:id', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');

  const { object, id } = req.params;
  const oc = merchantObjectConfig[object];
  if(!oc) return next();

  const dao = knex(oc.view).where({merchant_id:merchant.id, id})

  const item = await dao.first();
  if(!item) return res.status(404).send('对象不存在')
  res.json(item);
}));

router.post('/m/:object', wrap(async (req, res, next) => {
  const { merchant, user } = req;
  if(!merchant) throw new Error('商户信息不存在');
  if(!user) throw new Error('用户信息不存在');

  const { object } = req.params;
  const id = await objectService.postObject(object, {
    ...req.body,
    create_ip: req.ip,
    merchant_id: merchant.id,
    creator_id: user.id
  })

  res.json({id})
}));

router.patch('/m/:object/:id', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');

  const { object, id } = req.params;
  const oc = merchantObjectConfig[object];
  if(!oc) return next();

  const dao = knex(oc.model).where({id, merchant_id: merchant.id});

  const { ...data } = req.body;
  data.update_ip = req.ip;
  data.update_time = moment().toDate();

  await dao.update(data);
  res.status(200).json({...data, id})
}));

router.delete('/m/:object/:id', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');

  const { object, id } = req.params;
  const oc = merchantObjectConfig[object];
  if(!oc) return next();

  const dao = knex(oc.model).where({id, merchant_id: merchant.id});

  try{
    await dao.delete();
  } catch (e) {
    return next(e);
  }
  res.sendStatus(204)
}));

router.post('/product_card_order', wrap(async (req, res, next) => {

  const { ...data } = req.body;
  const { name, mobile, idno, card_id } = data;
  const creator_id = data.creator_id || req.user.id;

  if(!mobile) return res.status(500).send('请输入手机号')
  if(!idno) return res.status(500).send('请输入身份证号')
  if(!card_id) return res.status(500).send('请选择产品')

  if(!creator_id) return res.status(500).send('创建者id不存在')
  const creator = await knex('bank_user').where({id: creator_id}).first();
  if(!creator) return res.status(500).send('创建者不存在');

  const product = await knex('bank_product_card').where({id: card_id}).first();
  if(!product) return res.status(500).send('产品不存在');
  const source_id = product.source_id;
  if(!source_id) return res.status(500).send('产品未设置来源');
  const source = await knex('bank_product_card_source').where({id: source_id}).first();
  if(!source) return res.status(500).send('产品来源不存在');

  const order = await knex('v_bank_product_card_order').whereNot({status: 3}).where({source_id, mobile}).first();
  let id;

  if(!order) {
    const birthday = moment(idno.substr(6, 8), 'YYYYMMDD').format('YYYY-MM-DD');
    const sex = idno.substr(16, 1) % 2 ? 1 : 0;
    const user_agent = req.headers['user-agent'];
    const c = 'lywluo';
    const key = 'sywl4qpc7p9Ywx';

    const v = crypto.createHash('md5').update(`${mobile}${c}${key}`).digest('hex').toLowerCase();

    const body = {
      name, birthday, sex, idcard: idno, phone: mobile, ua: user_agent, ip: req.ip,
    };
    const r = await request.post('http://i.95baoxian.com/api/yiwaixian/reg', { qs: {
      c, v
    }, body, json:true });

    await knex('bank_product_card').where({id: card_id}).increment('got_count', 1);

    const dao = knex('bank_product_card_order').returning('id');
    data.create_ip = req.ip;
    data.status = 1;
    data.creator_id = creator_id;

    id = (await dao.insert(data))[0];

    const { base_id } = await knex('bank_product_card_order').max('id as base_id').where('create_time', '<', moment().millisecond(0).toDate()).first();
    const code = `C${moment().format('YYMMDDHHmmss')}${_.padStart(id - (base_id || 0), 4,0)}`;
    await knex('bank_product_card_order').where({id}).update({code});

    if(product.is_recommend){
      const userTree = await knex('v_bank_user').where({id: data.creator_id }).first();

      const ids = _.compact([
        userTree.id, userTree.referee_id,
        userTree.referee_1_id, userTree.referee_2_id, userTree.referee_3_id,
        userTree.referee_4_id, userTree.referee_5_id, userTree.referee_6_id,
        userTree.referee_7_id, userTree.referee_8_id, userTree.referee_9_id
      ])

      let userPrice = await knex('v_bank_user_level_card').whereIn('id', ids).where({card_id});
      userPrice = _.sortBy(userPrice, o => ids.indexOf(o.id))

      let curPrice = 0;
      userPrice = _.filter(userPrice, o => {
        if(o.money > curPrice) {
          curPrice = o.money;
          return true;
        }
        return false;
      })

      const platformPrice = (await knex('bank_product_card').where({id: card_id}).first()).money;
      let merchantPrice = (await knex('bank_merchant_x_product_card').where({merchant_id: creator.merchant_id, card_id }).first()).money;
      await knex('bank_product_card_order').where({id}).update({merchant_income:merchantPrice - curPrice, platform_income: platformPrice - merchantPrice});

      userPrice = _.map(userPrice, (o, idx, arr) => {
        if(idx == 0) return { ...o, get_money: o.money, comments: '直推用户' };
        const lower_id = ids[ids.indexOf(o.id) - 1];
        return { ...o, get_money: o.money - arr[idx - 1].money, comments: '下级代理', lower_id };
      })

      await knex('bank_product_card_income').insert(_.map(userPrice, o => ({
        user_id: o.id, order_id: id, money: o.get_money, comments: o.comments, lower_id: o.lower_id
      })));
    }
  } else {
    id = order.id;
  }

  let href = product.href;
  if(href.indexOf('www.qichangkeji.vip/gongzhonghaoWeb/page/cardAction.html') !== -1) {
    const params = qs.parse(url.parse(href).query);

    const { id: inhref_id, userId: inhref_userId } = params;

    const info = await request.post('http://www.qichangkeji.vip/qckjgzhManager/DownSingleLoan/selectDownSingleLoanById.do', { form: { id: inhref_id, fatherId: inhref_userId }, json: true });

    await request.post('http://www.qichangkeji.vip/qckjgzhManager/DownUser/AAAinsertAdd.do', { form: {
      ip: req.id,
      isChecked: 0,
      goodsId: inhref_id,
      type: info.type || 1,
      name,
      phone: mobile,
      idCard: idno,
      fatherId: inhref_userId,
      otherUserId: 0
    }})

    href = info.link || href;
  }
  res.status(201).json({id, href})
}));

router.put('/product_card_order/:id/status', wrap(async (req, res, next) => {
  const { id } = req.params;

  const item = await knex('v_bank_product_card_order').where({id}).first();
  if(!item) return res.status(404).send('订单不存在')
  if(item.status == 2) return res.status(500).send('订单已结束');

  const { status } = req.body;
  await knex('bank_product_card_order').where({id}).update({status});

  if(status == 2) {

    await knex('bank_user').where({id:item.creator_id}).increment('invite_card_current', 1);
    const { invite_card_current, invite_card_target, invite_card_cost } = await knex('bank_user').where({id:item.creator_id}).first();

    if( invite_card_cost < invite_card_target && invite_card_current >= invite_card_target ) {
      const count = invite_card_target - invite_card_cost;
      await knex('bank_user').where({id: item.creator_id}).update({invite_card_cost: invite_card_target});
      await balanceService.changeValue(item.creator_id, count * 10, { comments: '信用卡任务奖励' })
    }

    const incomeList = await knex('v_bank_product_card_order_income').where({order_id: id});
    const smsList = [];
    if(incomeList.length){
      await Promise.all(_.map(incomeList, async ({user_id, user_mobile, money, comments, lower_id, lower_mobile}) => {
        const balance = await knex('bank_user_balance').where({user_id}).orderBy('id', 'desc').first();
        const change_value = money;
        if(change_value){
          const current_value = balance ? (balance.current_value + change_value) : change_value;
          const freeze_value = balance ? balance.freeze_value : 0;
          await knex('bank_user_balance').insert({user_id, current_value, change_value, card_order_id: id, freeze_value, comments, lower_id})

          smsList.push({
            sms_code: comments === '直推用户' ? 'card_order.status.2.1' : 'card_order.status.2.2',
            name: comments === '直推用户' ? item.mobile : lower_mobile,
            mobile: user_mobile,
            income_money: change_value.toFixed(2),
          })
        }
      }))
    }

    if(smsList.length) {
      const product_name = item.product_name;
      const order_code = item.code;

      await Promise.all(_.map(smsList, async ({ sms_code, mobile, ...o}) => {
        const sms = await knex('v_m_bank_sms').where({code: sms_code, merchant_id: item.merchant_id}).first();
        if(!sms) return res.status(400).send(`编码为${sms_code}的短信模版未配置，请联系管理员`);
        const pass = smsPass[sms.pass_code];
        if(!pass) return res.status(400).send(`编码为${sms.pass_code}的通道未实现，请联系管理员`);
        await pass.send(mobile, { ...o, product_name, order_code }, JSON.parse(sms.pass_config))
      }))
    }
  }

  res.status(200).json({id})
}));

router.post('/product_loan_order', wrap(async (req, res, next) => {

  const { ...data } = req.body;
  const { name, mobile, idno, loan_id } = data;
  const creator_id = data.creator_id || req.user.id;

  if(!mobile) return res.status(500).send('请输入手机号')
  if(!idno) return res.status(500).send('请输入身份证号')
  if(!loan_id) return res.status(500).send('请选择产品')

  if(!creator_id) return res.status(500).send('创建者id不存在')
  const creator = await knex('bank_user').where({id: creator_id}).first();
  if(!creator) return res.status(500).send('创建者不存在');

  const product = await knex('bank_product_loan').where({id: loan_id}).first();
  if(!product) return res.status(500).send('产品不存在')

  const order = await knex('bank_product_loan_order').whereNot({status: 3}).where({loan_id, mobile}).first();

  let id;
  if(!order) {

    const birthday = moment(idno.substr(6, 8), 'YYYYMMDD').format('YYYY-MM-DD');
    const sex = idno.substr(16, 1) % 2 ? 1 : 0;
    const user_agent = req.headers['user-agent'];
    const c = 'lywluo';
    const key = 'sywl4qpc7p9Ywx';

    const v = crypto.createHash('md5').update(`${mobile}${c}${key}`).digest('hex').toLowerCase();

    const body = {
      name, birthday, sex, idcard: idno, phone: mobile, ua: user_agent, ip: req.ip,
    };
    const r = await request.post('http://i.95baoxian.com/api/yiwaixian/reg', { qs: {
      c, v
    }, body, json:true });

    await knex('bank_product_loan').where({id: loan_id}).increment('got_count', 1);

    const dao = knex('bank_product_loan_order').returning('id');
    data.create_ip = req.ip;
    data.status = 1;
    data.creator_id = creator_id;

    id = (await dao.insert(data))[0];

    const { base_id } = await knex('bank_product_loan_order').max('id as base_id').where('create_time', '<', moment().millisecond(0).toDate()).first();
    const code = `L${moment().format('YYMMDDHHmmss')}${_.padStart(id - (base_id || 0), 4,0)}`;
    await knex('bank_product_loan_order').where({id}).update({code});

    if(product.is_recommend) {
      const userTree = await knex('v_bank_user').where({id: data.creator_id }).first();

      const ids = _.compact([
        userTree.id, userTree.referee_id,
        userTree.referee_1_id, userTree.referee_2_id, userTree.referee_3_id,
        userTree.referee_4_id, userTree.referee_5_id, userTree.referee_6_id,
        userTree.referee_7_id, userTree.referee_8_id, userTree.referee_9_id
      ])

      let userPrice = await knex('v_bank_user_level_loan').whereIn('id', ids).where({loan_id});
      userPrice = _.sortBy(userPrice, o => ids.indexOf(o.id))

      let curPrice = 0;
      userPrice = _.filter(userPrice, o => {
        if(o.money > curPrice) {
          curPrice = o.money;
          return true;
        }
        return false;
      })

      const platformPrice = (await knex('bank_product_loan').where({id: loan_id}).first()).money;
      let merchantPrice = (await knex('bank_merchant_x_product_loan').where({merchant_id: creator.merchant_id, loan_id }).first()).money;
      await knex('bank_product_loan_order').where({id}).update({merchant_income:merchantPrice - curPrice, platform_income: platformPrice - merchantPrice});

      userPrice = _.map(userPrice, (o, idx, arr) => {
        if(idx == 0) return { ...o, get_money: o.money, comments: '直推用户' };
        const lower_id = ids[ids.indexOf(o.id) - 1];
        return { ...o, get_money: o.money - arr[idx - 1].money, comments: '下级代理', lower_id };
      })

      await knex('bank_product_loan_income').insert(_.map(userPrice, o => ({
        user_id: o.id, order_id: id, money: o.get_money, comments: o.comments, lower_id: o.lower_id
      })));
    }
  } else {
    id = order.id;
  }

  let href = product.href;
  if(href.indexOf('www.qichangkeji.vip/gongzhonghaoWeb/page/singleAction.html') !== -1) {
    const params = qs.parse(url.parse(href).query);

    const { id: inhref_id, userId: inhref_userId } = params;

    const info = await request.post('http://www.qichangkeji.vip/qckjgzhManager/DownSingleLoan/selectDownSingleLoanById.do', { form: { id: inhref_id, fatherId: inhref_userId }, json: true });

    await request.post('http://www.qichangkeji.vip/qckjgzhManager/DownUser/AAAinsertAdd.do', { form: {
      ip: req.id,
      isChecked: 0,
      goodsId: inhref_id,
      type: info.type || 1,
      name,
      phone: mobile,
      idCard: idno,
      fatherId: inhref_userId,
      otherUserId: 0
    }})

    href = info.link || href;
  }

  res.status(201).json({id, href})
}));

router.put('/product_loan_order/:id/status', wrap(async (req, res, next) => {
  const { id } = req.params;

  const item = await knex('v_bank_product_loan_order').where({id}).first();
  if(!item) return res.status(404).send('订单不存在')
  if(item.status == 2) return res.status(500).send('订单已结束');

  const { status } = req.body;

  if(status == 2 && item.product_money_unit == '％' && !item.money ) return res.status(500).send('此订单需要确定贷款金额');

  await knex('bank_product_loan_order').where({id}).update({status});

  if(status == 2) {
    const incomeList = await knex('v_bank_product_loan_order_income').where({order_id: id});
    const smsList = [];
    if(incomeList.length) {
      const calcMoney = item.product_money_unit == '％' ? (o => o * item.money / 100) : (o => o);
      await Promise.all(_.map(incomeList, async ({user_id, user_mobile, money, comments, lower_id, lower_mobile}) => {
        const balance = await knex('bank_user_balance').where({user_id}).orderBy('id', 'desc').first();
        const change_value = calcMoney(money);
        if(change_value) {
          const current_value = balance ? (balance.current_value + change_value) : change_value;
          const freeze_value = balance ? balance.freeze_value : 0;
          await knex('bank_user_balance').insert({user_id, current_value, change_value, loan_order_id: id, freeze_value, comments, lower_id})

          smsList.push({
            sms_code: comments === '直推用户' ? 'loan_order.status.2.1' : 'loan_order.status.2.2',
            name: comments === '直推用户' ? item.mobile : lower_mobile,
            mobile: user_mobile,
            income_money: change_value.toFixed(2),
          })
        }
      }))
    }

    if(smsList.length) {
      const product_name = item.product_name;
      const order_code = item.code;

      await Promise.all(_.map(smsList, async ({ sms_code, mobile, ...o}) => {
        const sms = await knex('v_m_bank_sms').where({code: sms_code, merchant_id: item.merchant_id}).first();
        if(!sms) return res.status(400).send(`编码为${sms_code}的短信模版未配置，请联系管理员`);
        const pass = smsPass[sms.pass_code];
        if(!pass) return res.status(400).send(`编码为${sms.pass_code}的通道未实现，请联系管理员`);
        await pass.send(mobile, { ...o, product_name, order_code }, JSON.parse(sms.pass_config))
      }))
    }

  }

  res.status(200).json({id})
}));

router.post('/product_ticket_order', wrap(async (req, res, next) => {
  const { ...data } = req.body;
  const { ticket_number, ticket_password, ticket_id } = data;
  const creator_id = data.creator_id || req.user.id;

  // if(!ticket_number) return res.status(500).send('请输入卡号')
  if(!ticket_password) return res.status(500).send('请输入卡密')
  if(!ticket_id) return res.status(500).send('请选择产品')
  const ticket = await knex('bank_product_ticket').where({id: ticket_id}).first();
  if(!ticket) return res.status(500).send('产品不存在')

  if(!creator_id) return res.status(500).send('创建者id不存在')
  const creator = await knex('bank_user').where({id: creator_id}).first();
  if(!creator) return res.status(500).send('创建者不存在');

  const order = ticket_number
    ? await knex('bank_product_ticket_order').where({ ticket_id }).where(d => d.where({ticket_number, ticket_password})).first()
    : await knex('bank_product_ticket_order').where({ ticket_id }).where({ticket_password}).first();

  if(order) return res.status(500).send('此卡已提交')

  await knex('bank_product_ticket').where({id: ticket_id}).increment('got_count', 1);

  const dao = knex('bank_product_ticket_order').returning('id');
  data.create_ip = req.ip;
  data.status = 1;
  data.creator_id = creator_id;

  let id = (await dao.insert(data))[0];

  const { base_id } = await knex('bank_product_ticket_order').max('id as base_id').where('create_time', '<', moment().millisecond(0).toDate()).first();
  const code = `T${moment().format('YYMMDDHHmmss')}${_.padStart(id - (base_id || 0), 4,0)}`;
  await knex('bank_product_ticket_order').where({id}).update({code});

  const userTree = await knex('v_bank_user').where({id: data.creator_id }).first();

  const ids = _.compact([
    userTree.id, userTree.referee_id,
    userTree.referee_1_id, userTree.referee_2_id, userTree.referee_3_id,
    userTree.referee_4_id, userTree.referee_5_id, userTree.referee_6_id,
    userTree.referee_7_id, userTree.referee_8_id, userTree.referee_9_id
  ])

  let userPrice = await knex('v_bank_user_level_ticket').whereIn('id', ids).where({ticket_id});
  userPrice = _.sortBy(userPrice, o => ids.indexOf(o.id))

  let curPrice = 0;
  userPrice = _.filter(userPrice, o => {
    if(o.money > curPrice) {
      curPrice = o.money;
      return true;
    }
    return false;
  })

  const platformPrice = (await knex('bank_product_ticket').where({id: ticket_id}).first()).money;
  let merchantPrice = (await knex('bank_merchant_x_product_ticket').where({merchant_id: creator.merchant_id, ticket_id }).first()).money;
  await knex('bank_product_ticket_order').where({id}).update({merchant_income: merchantPrice - curPrice, platform_income: platformPrice - merchantPrice})

  userPrice = _.map(userPrice, (o, idx, arr) => {
    if(idx == 0) return { ...o, get_money: o.money, comments: '直推用户' };
    const lower_id = ids[ids.indexOf(o.id) - 1];
    return { ...o, get_money: o.money - arr[idx - 1].money, comments: '下级代理', lower_id };
  })

  await knex('bank_product_ticket_income').insert(_.map(userPrice, o => ({
    user_id: o.id, order_id: id, money: o.get_money, comments: o.comments, lower_id: o.lower_id
  })));

  if(ticket.process_id){
    console.log('调用处理接口')
    const process = await knex('bank_product_ticket_process').where({id: ticket.process_id}).first();
    if(process) {
      const pass = productTicketProcessPass[process.pass_code];
      if(pass) {
        try {
          await pass.process(JSON.parse(process.pass_config), {
            ticket_number, ticket_password, code,
            notify_url: `${req.protocol}://${req.hostname}/webhook/product_ticket_process/${process.id}`,
          });
          await orderService.changeTicketOrderStatus(id, 4);
          await knex('bank_product_ticket_order').where({id}).update('comments', `使用${process.name} 通道核销中`);
        }catch(e){
          await orderService.changeTicketOrderStatus(id, 3);
          await knex('bank_product_ticket_order').where({id}).update('comments', e.message);
        }
      }
    }
  }


  res.status(201).json({id})
}));

router.put('/product_ticket_order/:id/status', wrap(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try{
    await orderService.changeTicketOrderStatus(id, status);
    res.status(200).json({id})
  } catch (e) {
    res.status(500).send(e.message);
  }
}));


router.post('/user_level_order', wrap(async (req, res, next) => {

  const { ...data } = req.body;
  const { to_level_id } = data;
  const { level_id, id: creator_id } = req.user;

  if(!level_id) return res.status(500).send('当前用户没有等级，无法升级');

  const from_level = await knex('bank_user_level').where({id: level_id}).first();
  if(!from_level) return res.status(500).send('当前等级信息不存在');

  const to_level = await knex('bank_user_level').where({id: to_level_id}).first();
  if(!to_level) return res.status(500).send('目标等级信息不存在');
  if(!to_level.money) return res.status(500).send('目标等级无法通过订单升级');

  const money = to_level.money - (from_level.money || 0);
  if(money <= 0) return res.status(500).send('无需升级到目标等级');

  const dao = knex('bank_user_level_order').returning('id');
  data.from_level_id = from_level.id;
  data.to_level_id = to_level.id;
  data.money = money;
  data.create_ip = req.ip;
  data.status = 1;
  data.creator_id = creator_id;

  let id = (await dao.insert(data))[0];

  const { base_id } = await knex('bank_user_level_order').max('id as base_id').where('create_time', '<', moment().millisecond(0).toDate()).first();
  const code = `L${moment().format('YYMMDDHHmmss')}${_.padStart(id - (base_id || 0), 4,0)}`;
  await knex('bank_user_level_order').where({id}).update({code});

  const userTree = await knex('v_bank_user').where({id: data.creator_id }).first();

  const ids = _.compact([
    userTree.id,
    userTree.referee_id,
    userTree.referee_1_id, userTree.referee_2_id, userTree.referee_3_id,
    userTree.referee_4_id, userTree.referee_5_id, userTree.referee_6_id,
    userTree.referee_7_id, userTree.referee_8_id, userTree.referee_9_id
  ])

  let userPrice = await knex('v_bank_user').whereIn('id', ids)

  userPrice = _.sortBy(userPrice, o => ids.indexOf(o.id))

  // 自己 和 自己同级别的上线 不分
  let curPrice = userPrice[0].level_income_money;
  // 筛选掉不分的用户
  userPrice = _.filter(userPrice, o => {
    if(o.level_income_money > curPrice) {
      curPrice = o.level_income_money;
      return true;
    }
    return false;
  })

  console.log(curPrice);

  // let merchantPrice = (await knex('bank_merchant_x_product_card').where({merchant_id: creator.merchant_id, card_id }).first()).money;
  await knex('bank_user_level_order').where({id}).update({merchant_income: ((money * (100 - curPrice)) / 100).toFixed(2), platform_income: 0 })

  userPrice = _.map(userPrice, (o, idx, arr) => {
    const get_money = (idx == 0) ? o.level_income_money : (o.level_income_money - arr[idx - 1].level_income_money);
    const lower_id = ids[ids.indexOf(o.id) - 1];
    return { ...o, get_money, lower_id };
  })

  await knex('bank_user_level_income').insert(_.map(userPrice, o => ({
    user_id: o.id, order_id: id, money: ((o.get_money * money) / 100).toFixed(2), lower_id: o.lower_id
  })));

  res.status(201).json({id})
}));

router.put('/user_level_order/:id/payment', wrap(async (req, res, next) => {
  console.log('abc')
  const { id } = req.params;

  const item = await knex('v_bank_user_level_order').where({id}).first();
  if(!item) throw new Error('订单不存在')
  if(item.status == 2) throw new Error('订单已结束');

  const { payment_id, ...data } = req.body;

  const payment = await knex('bank_payment').where({id: payment_id}).first();
  if(!payment) throw new Error('支付方式未配置，请联系管理员');
  const pass = paymentPass[payment.pass_code];
  if(!pass) throw new Error(`编码为${sms.pass_code}的通道未实现，请联系管理员`);

  const payInfo = await pass.createPayInfo(JSON.parse(payment.pass_config), {
    creator_id: item.creator_id,
    clientIp: req.ip, subject: '会员升级',
    out_trade_no: item.code, total_fee: item.creator_mobile == '18662019771' ? 0.01 : item.money,
    return_url: `${req.protocol}://${req.hostname}/`,
    notify_url: `${req.protocol}://${req.hostname}/webhook/payment/${payment.id}`,
    ...data,
  })

  res.json({id, payInfo})
}));

router.put('/user_level_order/:id/status', wrap(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try{
    await orderService.changeLevelOrderStatus(id, status);
    res.status(200).json({id})
  } catch (e) {
    res.status(500).send(e.message);
  }
}));

router.post('/cash_order', wrap(async (req, res, next) => {
  const { user } = req;
  if(!user) return res.status(500).send('请先登陆');
  const { merchant } = user;
  if(!merchant) return res.status(500).send('该用户没有对应的oem商户');
  if(user.is_cash_disabled) throw new Error('您的账户暂时无法提现');
  const { ...data } = req.body;
  const money = parseFloat(data.money);

  if(money <= 0) return res.status(500).send('请输入金额');
  if(money < merchant.min_cash_order) return res.status(500).send(`提现额度不能小于${merchant.min_cash_order}元`);

  let balance_id = null;
  try {
    balance_id = await balanceService.freezeValue(user.id, money)
  } catch(e) {
    return res.status(500).send(e.message);
  }

  // const balance = await knex('bank_user_balance').where({user_id:user.id}).orderBy('id', 'desc').first();
  // if(!balance || money > balance.current_value) return res.status(500).send('账户余额不足');
  //
  // const current_value = balance.current_value - money;
  // await knex('bank_user_balance').insert({user_id:user.id, current_value, change_value: -money, freeze_value: (balance.freeze_value || 0) + money})

  const dao = knex('bank_cash_order').returning('id');

  data.create_ip = req.ip;
  data.creator_id = user.id;
  data.cash_fee = merchant.cash_fee;

  let id = (await dao.insert(data))[0];
  await knex('bank_user_balance').where({id: balance_id}).update({cash_order_id: id});

  const { base_id } = await knex('bank_cash_order').max('id as base_id').where('create_time', '<', moment().millisecond(0).toDate()).first();
  const code = `TX${moment().format('YYMMDDHHmmss')}${_.padStart(id - (base_id || 0), 4,0)}`;
  await knex('bank_cash_order').where({id}).update({code});

  res.status(201).json({id})

  if(user.merchant && user.merchant.max_cash_day) {
    let { cash_day } = await knex('bank_cash_order').sum('money as cash_day')
      .where({creator_id: user.id, status: 2})
      .where(knex.raw(`DATE_FORMAT(create_time, '%Y-%m-%d')`), '=', moment().format('YYYY-MM-DD')).first();

    cash_day = cash_day || 0;
    if(user.merchant.max_cash_day >= (cash_day + money)){
      const agentpay = await knex('bank_agentpay').where({is_enabled:1}).first();
      if(agentpay) {
        const pass = agentpayPass[agentpay.pass_code];
        if(pass) {
          try {
            const bank = await objectService.getObject('bank', { name: data.bank_name});
            if(!bank) throw new Error(`银行未设置 ${item.bank_name}`);

            const status = await pass.payment(JSON.parse(agentpay.pass_config), {
              code, money: money - data.cash_fee,

              bank_card_no: data.bank_card_no,
              bank_card_name: data.bank_card_name,
              notify_url: `https://h5.hello.com/webhook/agentpay/${agentpay.id}`,

              bank_name: bank.name,
              bank_code: bank.code,
            })

            if(status == 2) {
              await orderService.changeCashOrderStatus(id, 2);
              await knex('bank_cash_order').where({id}).update('comments', '代付打款成功');
            } else if(status == 4) {
              await orderService.changeCashOrderStatus(id, 4);
              await knex('bank_cash_order').where({id}).update('comments', '已提交通道打款');
            } else {
              throw new Error(`错误的打款状态: ${status}`)
            }
          } catch(e){
            console.log('打款异常');
            console.log(e);
            await knex('bank_cash_order').where({id}).update({comments: `异常${e.message}`});
          }
        }
      }
    }else{
      await knex('bank_cash_order').where({id}).update('comments', `该用户本日已提现${cash_day}元, 代付超限需人工确认`);
    }
  } else {
    await knex('bank_cash_order').where({id}).update('comments', '该用户的oem未配提现额度，需要手工确认');
  }

}));

router.put('/cash_order/:id/status', wrap(async (req, res, next) => {
  const { id } = req.params;
  const { status, method } = req.body;
  const item = await knex('v_bank_cash_order').where({id}).first();
  if(!item) return res.status(500).send('订单不存在');

  try {
    if(method == 'agentpay' && status == 2) {
      const agentpay = await knex('bank_agentpay').where({is_enabled:1}).first();
      if(agentpay) {
        const pass = agentpayPass[agentpay.pass_code];
        if(pass) {
          try {

            const bank = await objectService.getObject('bank', { name: item.bank_name});
            if(!bank) throw new Error(`银行未设置 ${item.bank_name}`);
            await pass.payment(JSON.parse(agentpay.pass_config), {
              code: item.code, money: item.money - item.cash_fee,
              bank_card_no: item.bank_card_no,
              bank_card_name: item.bank_card_name,
              notify_url: `https://h5.hello.com/webhook/agentpay/${agentpay.id}`,
              bank_name: bank.name,
              bank_code: bank.code
            })
            await orderService.changeCashOrderStatus(id, 2);
            await knex('bank_cash_order').where({id}).update('comments', '代付打款成功');
          } catch(e){
            await knex('bank_cash_order').where({id}).update({comments: e.message});
          }
        }
      }
    }else{
      await orderService.changeCashOrderStatus(id, status);
      if(status == 2) {
        await knex('bank_cash_order').where({id}).update('comments', '手工打款成功');
      }
    }
  }catch(e){
    console.log(e);
  }

  res.status(200).json({id})
}));


router.post('/user_bank_card', wrap(async (req, res, next) => {
  const dao = knex('bank_user_bank_card').returning('id');

  const { ...data } = req.body;
  const { bank_card_name, bank_id, bank_card_no, mobile, idno } = data;
  data.create_ip = req.ip;
  data.creator_id = req.user.id;
  data.status = 1;

  let id = (await dao.insert(data))[0];

  const bindcard = await objectService.getObject('bindcard', { code: 'chuanglan'});
  if(!bindcard) return res.status(400).send('绑卡通道未配置，请联系管理员');
  const pass = bindcardPass[bindcard.pass_code];
  if(!pass) return res.status(400).send(`编码为${bindcard.pass_code}的通道未实现，请联系管理员`);

  const { base_id } = await knex('bank_user_bank_card').max('id as base_id').where('create_time', '<', moment().millisecond(0).toDate()).first();
  const code = `BC${moment().format('YYMMDDHHmmss')}${_.padStart(id - (base_id || 0), 4,0)}`;
  await knex('bank_user_bank_card').where({id}).update({code});

  try {
    await pass.applyBind(JSON.parse(bindcard.pass_config), {
      code, bank_card_name, bank_card_no, mobile, idno
    })
    await knex('bank_user_bank_card').where({id}).update({status: 2});
  } catch(e) {
    return res.status(500).send(e.message);
  }

  res.status(201).json({id})
}));

const objectConfig = objectService.objectConfig;

router.get('/:object', wrap(async (req, res, next) => {

  const { object } = req.params;
  const { user } = req;
  const { prop, ...query } = req.query;
  const objectQuery = _.omitBy(query, (o, k) => k.indexOf('.') !== -1);
  const propQuery = _.omitBy(query, (o, k) => k.indexOf('.') === -1);

  const result = await objectService.getObjectList(object, objectQuery);
  let { total, list } = result;
  if(prop) {
    list = await Promise.all(_.map(list, async o => {
      return {
        ...o,
        [prop]: (await objectService.getObjectProperty(object, o.id, prop, _(propQuery).omitBy((p,k) => k.indexOf(`${prop}.`)).mapKeys((p, k) => k.substr(prop.length+1)).value()))
      }
    }))
  }

  res.set('X-Total-Count', total).json(_.map(list, o => _.omit(o, 'password')))
}));

router.get('/:object/:id', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  const oc = objectConfig[object];
  if(!oc) return next();

  const dao = knex(oc.view || oc.model).where({id})

  const item = await dao.first();
  if(!item) return res.status(404).send('对象不存在')
  res.json(item);
}));

router.post('/:object', wrap(async (req, res, next) => {
  const { object } = req.params;
  const oc = objectConfig[object];
  if(!oc) return next();

  const dao = knex(oc.model).returning('id');

  const { ...data } = req.body;
  data.create_ip = req.ip;
  if(req.user && !data.creator_id) data.creator_id = req.user.id;

  let id = (await dao.insert(data))[0];

  if(oc.postAfter) {
    await oc.postAfter(req, res, next, { id, oc });
  }
  res.status(201).json({id})
}));

router.post('/:object/:id/payment', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  const oc = objectConfig[object];
  if(!oc) return next();

  const item = await knex(oc.view || oc.model).where({id}).first();
  if(!item) throw new Error('订单不存在');
  if(item.status == 2) throw new Error('订单已结束');

  const { payment_id, ...data } = req.body;
  const payment = await knex('bank_payment').where({id: payment_id}).first();
  if(!payment) throw new Error('无效的支付方式');
  const pass = paymentPass[payment.pass_code];
  if(!pass) throw new Error('错误的支付方式');

  const payInfo = await pass.createPayInfo(JSON.parse(payment.pass_config), {
    creator_id: item.creator_id,
    clientIp: req.ip, subject: '会员升级',
    out_trade_no: item.code, total_fee: item.creator_mobile == '18662019771' ? 0.01 : item.money,
    return_url: `${req.protocol}://${req.hostname}/`,
    notify_url: `${req.protocol}://${req.hostname}/webhook/pay/${object}/${payment_id}`,
    ...data,
  })

  res.json({ payInfo })
}));

router.patch('/:object/:id', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  const oc = objectConfig[object];
  if(!oc) return next();

  const dao = knex(oc.model).where({id});

  const { ...data } = req.body;
  data.update_ip = req.ip;
  data.update_time = moment().toDate();

  await dao.update(data);
  res.status(200).json({...data, id})
}));

router.delete('/:object/:id', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  const oc = objectConfig[object];
  if(!oc) return next();

  const dao = knex(oc.model).where({id});

  try{
    await dao.delete();
  } catch (e) {
    return next(e);
  }
  res.sendStatus(204)
}));

router.get('/:object/:id/:prop', wrap(async (req, res, next) => {
  const { object, id, prop } = req.params;
  const props = await objectService.getObjectProperty(object, id, prop, req.query);
  res.json(props);
}));

router.put('/:object/:id/:prop', wrap(async (req, res, next) => {
  const { object, id, prop } = req.params;
  await objectService.patchObject(object, { id }, { [prop]: req.body });
  return res.json({id});
}));

router.get('/info', (req, res, next) => {
  const { merchant } = req;
  res.json({ merchant });
});

router.get('/rebuild_referee', wrap(async (req, res, next) => {
  const { merchant } = req;
  if(!merchant) return res.status(404).send('商户信息不存在');

  const { list: userList} = await objectService.getObjectList('user', { merchant_id: merchant.id});
  for(let i = 0; i < userList.length; i++) {
    const { referee_id, id } = userList[i]
    console.log(`rebuild_referee: ${i+1}/${userList.length}, ${id}`);
    console.log({id, referee_id});
    await objectService.patchObject('user', { id }, { referee_id });
  }
}))

module.exports = router;
