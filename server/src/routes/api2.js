import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import request from 'request-promise';

import wrap from './wrap';
import objectService from '../object2';

const router = require('express').Router();
router.use(async (req, res, next) => {
  const { host } = req.headers;
  const token = req.headers['x-token'];
  const { protocol } = req;

  req.merchant = await objectService.getObject('merchant', { host });;

  if(token){
    const user_token = await objectService.getObject('user_token', { token });
    if(user_token){
      const { user_id } = user_token;
      const user = await objectService.getObject('user', {id: user_id });
      req.user = user;
    }
  }
  next();
});

router.post('/authorize', wrap(async (req, res, next) => {
  const { merchant } = req;
  const { account, mobile, username, password, auth_type } = req.body;
  const user_agent = req.headers['user-agent'];
  const merchant_id = merchant ? merchant.id : null;

  if(!account && !mobile && !username) throw new Error('用户名不能为空');
  if(!password) throw new Error('密码不能为空');

  let user_type = null;
  if(auth_type == 'oem-admin-pc') {
    user_type = 2;
  }else if(auth_type == 'admin-pc') {
    user_type = 1;
  }else {
    user_type = 3;
  }

  let user;
  if(mobile) {
    user = await objectService.getObject('user', { merchant_id, mobile, password, user_type });
  }else if(username) {
    user = await objectService.getObject('user', { merchant_id, username, password, user_type });
  }else {
    user = await objectService.getObject('user', { merchant_id, username: account, password, user_type });
    if(!user) {
      user = await objectService.getObject('user', { merchant_id, mobile: account, password, user_type });
    }
  }

  if(!user) throw new Error('错误的用户名或密码')

  if(user.is_disabled) throw new Error(user.disabled_reason || '账号已被禁用');

  const ts = moment().unix();
  const token = new Buffer(`user:${user.id}:${ts}`).toString('base64');

  await objectService.postObject('user_token', {
    user_agent, token,
    user_id: user.id, create_ip: req.ip,
  })

  res.status(201).json({
    token,
    display_name: user.nickname || user.name || user.mobile || user.username,
    user
  })
}));

router.post('/object', wrap(async (req, res, next) => {
  const { body, user } = req;

  const result = await Promise.reduce(_.map(body, o => o ? JSON.parse(o) : {}), async (result, {object, method, ...args}) => {

    let resultItem = null
    if(method === 'filter') {

      const { $query, path } = args;

      const { prop, ...query } = args.query || {};
      const objectQuery = _.omitBy(query, (o, k) => k.indexOf('.') !== -1);
      const propQuery = _.omitBy(query, (o, k) => k.indexOf('.') === -1);

      let list = await objectService.getObjectList(object, {
        ...objectQuery,
        ..._.mapValues($query, o => _.get(result, o)),
      }, path);

      if(prop) {
        const propList = prop.split(',');
        const ids = _.map(list, 'id');
        await Promise.each(propList, async propKey => {
          const propValueArray = await objectService.getObjectPropertyArray(object, ids, propKey, _(propQuery).omitBy((p,k) => k.indexOf(`${propKey}.`)).mapKeys((p, k) => k.substr(propKey.length+1)).value());
          list = _.zipWith(list, propValueArray, (a, b) => ({
            ...a, [propKey]: b,
          }))
        })
      }

      resultItem = list;

    } else if(method === 'count') {
      const { query = {} } = args;
      resultItem = await objectService.getObjectCount(object, query);
    } else if(method === 'create') {
      const { data } = args;
      resultItem = await objectService.postObject(object, data);
    } else if(method === 'update') {
      const { query, data } = args;
      resultItem = await objectService.patchObject({ object, query, data, client: {
        wx_openid: user.wx_openid,
        request_ip: req.ip,
      }});
    } else if(method === 'delete') {
      const { query } = args;
      resultItem = await objectService.deleteObject(object, query);
    } else if(method === 'get') {
      const { $query, path } = args;

      const { prop, ...query } = args.query || {};
      const objectQuery = _.omitBy(query, (o, k) => k.indexOf('.') !== -1);
      const propQuery = _.omitBy(query, (o, k) => k.indexOf('.') === -1);

      resultItem = await objectService.getObject(object, {
        ...objectQuery,
        ..._.mapValues($query, o => _.get(result, o)),
      }, path);

      if(resultItem && prop) {
        const propList = prop.split(',');
        await Promise.each(propList, async propKey => {
          resultItem[propKey] = await objectService.getObjectProperty(object, resultItem.id, propKey)
        })
      }


    }

    result.push(resultItem);
    return result;
  }, [])
  res.send(result);
}))

router.get('/:object', wrap(async (req, res, next) => {
  const { object } = req.params;
  const { prop, ...query } = req.query;
  const objectQuery = _.omitBy(query, (o, k) => k.indexOf('.') !== -1);
  const propQuery = _.omitBy(query, (o, k) => k.indexOf('.') === -1);

  let list = await objectService.getObjectList(object, objectQuery);

  if(prop) {
    const propList = prop.split(',');
    const ids = _.map(list, 'id');
    await Promise.each(propList, async propKey => {
      const propValueArray = await objectService.getObjectPropertyArray(object, ids, propKey, _(propQuery).omitBy((p,k) => k.indexOf(`${propKey}.`)).mapKeys((p, k) => k.substr(propKey.length+1)).value());
      list = _.zipWith(list, propValueArray, (a, b) => ({
        ...a, [propKey]: b,
      }))
    })
  }
  const count = req.query.limit ? (await objectService.getObjectCount(object, objectQuery)) : list.length;
  res.set('X-API-Version', 'v2').set('X-Object-Count', count).json(_.map(list, o => _.omit(o, ['password'])));
}))

router.get('/:object/:id', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  const { prop } = req.query;
  let item = await objectService.getObject(object, { id });
  if(item && prop) {
    const propList = prop.split(',');
    await Promise.each(propList, async propKey => {
      item[propKey] = await objectService.getObjectProperty(object, id, propKey)
    })
  }
  res.json(item);
}));

router.post('/:object', wrap(async (req, res, next) => {
  const { object } = req.params;
  const { user, body } = req;

  let id;
  if(_.isArray(body)) {
    id = await Promise.mapSeries(body, o => objectService.postObject(object, {
      ...o,
      creator_id: user.id,
    }))
  } else {
    id = await objectService.postObject(object, {
      ...req.body,
      creator_id: user.id,
    });
  }

  res.set('X-API-Version', 'v2').json({ id });
}))

router.patch('/:object/:id', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  await objectService.patchObject(object, { id: parseInt(id) }, req.body);
  res.json({id})
}))

router.patch('/:object', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  const { query, data } = req.body;
  await objectService.patchObject(object, query, data);
  res.set('X-API-Version', 'v2').json({id})
}))

router.delete('/:object/:id', wrap(async (req, res, next) => {
  const { object, id } = req.params;
  await objectService.deleteObject(object, { id })
  res.set('X-API-Version', 'v2').sendStatus(204)
}))

router.delete('/:object', wrap(async (req, res, next) => {
  if(!_.size(req.query)) throw new Error('缺少删除参数')
  const { object } = req.params;
  await objectService.deleteObject(object, req.query)
  res.set('X-API-Version', 'v2').sendStatus(204)
}))

router.get('/:object/:id/:prop', wrap(async (req, res, next) => {
  const { object, id, prop } = req.params;
  let list = await objectService.getObjectProperty(object, id, prop);
  res.set('X-API-Version', 'v2').json(list);
}));

module.exports = router;
