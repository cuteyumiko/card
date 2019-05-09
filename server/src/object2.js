import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';

import CONFIG from './config';
const knex = require('knex')(CONFIG.db);

const objectConfigTable = {
  'system_log': { model: 't_system_log', view: 'v_system_log' },
  // 'task': { model: 't_task', ...require('./object/task') },

  'merchant': { model: 'bank_merchant' },
  'user_token': { model: 'bank_user_token' },
  'user_level': { model: 'bank_user_level', view: 'bank_user_level' },

  'user': { model: 'bank_user', view: 'v_bank_user' },
  'bindcard': { model: 'bank_bindcard' },
  'agentpay': { model: 'bank_agentpay' },

  'delivery_address': { model: 't_delivery_address', view: 't_delivery_address' },
  'product_insurance_claim_order': { model: 't_product_insurance_claim_order', view: 'v_product_insurance_claim_order',
    property: {
      'item': { body_id: 'body_id', property_id: 'id', model: 't_product_insurance_claim_order_item' },
      'claim': { body_id: 'claim_order_id', property_id: 'claim_id', model: 't_product_insurance_claim_order_x_claim' },
    }
  },

  'user_bank_card': { model: 'bank_user_bank_card', view: 'v_bank_user_bank_card', ...require('./object/user_bank_card') },

  'product_card': { model: 'bank_product_card', view: 'v_bank_product_card',
    property: {
      property: { body_id: 'card_id', property_id: 'property_id', model: 'bank_product_card_x_property', view: 'v_bank_product_card_x_property' },
      type: { body_id: 'card_id', property_id: 'type_id', model: 'bank_product_card_x_type', view: 'bank_product_card_x_type' },
    },
  },
  'product_card_property': { model: 'bank_product_card_property' },
  'product_card_with_merchant': { view: 'v_bank_product_card_with_merchant',
    property: {
      property: { body_id: 'card_id', property_id: 'property_id', model: 'bank_product_card_x_property', view: 'v_bank_product_card_x_property' },
    }
  },

  'product_loan': { model: 'bank_product_loan', view: 'v_bank_product_loan',
    property: {
      property: { body_id: 'loan_id', property_id: 'property_id', model: 'bank_product_loan_x_property', view: 'v_bank_product_loan_x_property' },
      type: { body_id: 'loan_id', property_id: 'type_id', model: 'bank_product_loan_x_type', view: 'bank_product_loan_x_type' },
    },
  },
  'product_loan_property': { model: 'bank_product_loan_property' },
  'product_loan_with_merchant': { view: 'v_bank_product_loan_with_merchant',
    property: {
      property: { body_id: 'loan_id', property_id: 'property_id', model: 'bank_product_loan_x_property', view: 'v_bank_product_loan_x_property' },
      type: { body_id: 'loan_id', property_id: 'type_id', model: 'bank_product_loan_x_type', view: 'bank_product_loan_x_type' },
    },
  },

  'product_ticket': { model: 'bank_product_ticket', view: 'v_bank_product_ticket',
    property: {
      property: { body_id: 'ticket_id', property_id: 'property_id', model: 'bank_product_ticket_x_property', view: 'v_bank_product_ticket_x_property' },
    },
  },
  'product_ticket_property': { model: 'bank_product_ticket_property' },

  'product_ticket_with_merchant': { view: 'v_bank_product_ticket_with_merchant',
    property: {
      property: { body_id: 'ticket_id', property_id: 'property_id', model: 'bank_product_ticket_x_property', view: 'v_bank_product_ticket_x_property' },
    },
  },
  'product_ticket_source': { model: 'bank_product_ticket_source', view: 'bank_product_ticket_source',
    property: {
      property: { body_id: 'source_id', property_id: 'property_id', model: 'bank_product_ticket_source_x_property', view: 'v_bank_product_ticket_source_x_property' },
    }
  },
  'product_ticket_source_property': { model: 'bank_product_ticket_source_property' },

  'user_level_x_product_card': { view: 'v_bank_user_level_x_product_card' },
  'user_level_x_product_loan': { view: 'v_bank_user_level_x_product_loan' },
  'user_level_x_product_ticket': { view: 'v_bank_user_level_x_product_ticket' },
  'merchant_notice': { model: 'bank_merchant_notice', view: 'v_bank_merchant_notice' },
  'course': { view: 'v_m_bank_course' },
  'product_loan_type': { model: 'bank_product_loan_type', view: 'v_bank_product_loan_type' },
};

class BaseObjectSession {
  constructor({ knex }) {
    this.knex = knex;
  }

  doQuery(dao, { order, sum, ...query }) {
    _.forEach(query, (value, key) => {
      const args = key.split('__');

      if(args.length == 1){
        if(value === ''){
          dao.whereNull(key)
        }else{
          dao.where(key, value)
        }
      }else if(args.length == 2){
        if(args[1] == 'like'){
          if(value) dao.where(args[0], 'like', `%${value}%`);
        }else if(args[1] === 'gt') {
          dao.where(args[0], '>', value)
        }else if(args[1] === 'ge') {
          dao.where(args[0], '>=', value)
        }else if(args[1] === 'lt') {
          dao.where(args[0], '<', value)
        }else if(args[1] === 'le') {
          dao.where(args[0], '<=', value)
        }else if(args[1] === 'not') {
          if(value === ''){
            dao.whereNotNull(args[0])
          } else {
            dao.whereNot(args[0], value)
          }
        }else if(args[1] === 'in') {
          if(_.isArray(value)) dao.whereIn(args[0], value)
          else dao.whereIn(args[0], value.split(','))
        }
      }
    })

    if(order){
      _.forEach(order.split(','), o => {
        if(_.endsWith(o, '__asc')){
          dao.orderBy(o.replace(/__asc$/, ''), 'asc')
        }else{
          dao.orderBy(o.replace(/[-]/, ''), 'desc')
        }
      })
    }

    if(sum) {
      _.forEach(sum.split(','), o => {
        dao.sum(`${o} as ${o}`)
      });
    }
  }

  async postObject(object, _data) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);

    let data = _data;
    if(objectConfig.postBefore) {
      const postBefore = _.bind(objectConfig.postBefore, this);
      data = (await postBefore({ object, objectConfig }, data)) || data;
    }

    const body = _.omit(data, _.keys(objectConfig.property));
    const property = _.pick(data, _.keys(objectConfig.property));

    const dao = this.knex(objectConfig.model).returning('id');
    const id = (await dao.insert(body))[0];

    if(_.size(property)){
      await Promise.props(_.mapValues(property, async (o, p) => {
        await this.patchObjectProperty(object, id, p, o);
      }));
    }

    if(objectConfig.postAfter) {
      const item = await this.knex(objectConfig.model).where({id}).first();
      const postAfter = _.bind(objectConfig.postAfter, this);
      await postAfter({ id, object, objectConfig }, item);
    }

    return id;
  }

  async patchObjectById(object, id, _data) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);

    const item = await this.getObject(object, { id });
    if(!item) throw new Error('无效的对象ID');

    let data = _data;
    if(objectConfig.patchBefore) {
      const patchBefore = _.bind(objectConfig.patchBefore, this)
      data = (await patchBefore({ id, object }, data, item)) || data;
    }

    const body = _.omit(data, _.keys(objectConfig.property));
    const property = _.pick(data, _.keys(objectConfig.property));

    if(_.size(body)) {
      const dao = this.knex(objectConfig.model).where({id});
      await dao.update(body);
    }

    if(_.size(property)){
      await Promise.props(_.mapValues(property, async (o, p) => {
        await this.putObjectProperty(object, id, p, o);
      }));
    }

    if(objectConfig.patchAfter) {
      const patchAfter = _.bind(objectConfig.patchAfter, this)
      await patchAfter({ id, objectConfig, object }, data, item);
    }

    return id;
  }

  async patchObject(object, query, _data) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);

    const dao = this.knex(objectConfig.model);
    this.doQuery(dao, query)
    await dao.update(_data);
  }

  async getObject(object, query) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);

    const dao = this.knex(objectConfig.view || objectConfig.model);
    this.doQuery(dao, query)
    return await dao.first();
  }

  async getObjectList(object, { offset, limit, ...query } = {}) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);

    const offsetOK = Math.max(parseInt(offset) || 0, 0);
    const limitOK = Math.max(parseInt(limit) || 0, 0);

    const dao = this.knex(objectConfig.view || objectConfig.model);
    this.doQuery(dao, query)
    if(limitOK) dao.offset(offsetOK).limit(limitOK);
    return await dao;
  }

  async getObjectCount(object, { offset, limit, ...query } = {}) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);

    const dao = this.knex(objectConfig.view || objectConfig.model);
    this.doQuery(dao, query)
    const { total } = await dao.count('* as total').first();
    return total;
  }

  async deleteObject(object, query) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);

    const dao = this.knex(objectConfig.model);
    this.doQuery(dao, query)
    return await dao.delete();
  }

  async getObjectProperty(object, id, propKey, { offset, limit, ...propQuery } = {}) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);
    const propertyConfig = objectConfig.property[propKey];
    if(!propertyConfig) throw new Error(`未知的对象属性 ${object}.${propKey}`);

    const offsetOK = Math.max(parseInt(offset) || 0, 0);
    const limitOK = Math.max(parseInt(limit) || 0, 0);

    const dao = this.knex(propertyConfig.view || propertyConfig.model);
    this.doQuery(dao, {
      ...propQuery,
      [propertyConfig.body_id]: id
    })
    if(limitOK) dao.offset(offsetOK).limit(limitOK);
    return await dao;
  }

  async getObjectPropertyArray(object, ids, propKey, { offset, limit, ...propQuery } = {}) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);
    const propertyConfig = objectConfig.property[propKey];
    if(!propertyConfig) throw new Error(`未知的对象属性 ${object}.${propKey}`);

    const offsetOK = Math.max(parseInt(offset) || 0, 0);
    const limitOK = Math.max(parseInt(limit) || 0, 0);

    const dao = this.knex(propertyConfig.view || propertyConfig.model);
    this.doQuery(dao, {
      ...propQuery,
      [`${propertyConfig.body_id}__in`]: ids
    })
    if(limitOK) dao.offset(offsetOK).limit(limitOK);
    const list = await dao;
    return _.map(ids, o => _.filter(list, { [propertyConfig.body_id]: o}));
  }

  async patchObjectProperty(object, id, propKey, propValue) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);
    const propertyConfig = objectConfig.property[propKey];
    if(!propertyConfig) throw new Error(`未知的对象属性 ${object}.${propKey}`);

    const newList = propValue;
    const oldList = await this.knex(propertyConfig.model).where({[propertyConfig.body_id]: id});
    const addList = _.differenceBy(newList, oldList, propertyConfig.property_id);
    const updateList = _.intersectionBy(newList, oldList, propertyConfig.property_id);

    if(_.size(addList)) {
      await this.knex(propertyConfig.model).insert(_.map(addList, o => ({
        ...o,
        [propertyConfig.body_id]: id
      })));
    }

    if(_.size(updateList)) {
      await Promise.each(updateList, async o => {
        const data = _.omit(o, [propertyConfig.body_id, propertyConfig.property_id]);
        if(_.size(data)){
          await this.knex(propertyConfig.model)
            .where({
              [propertyConfig.body_id]:id,
              [propertyConfig.property_id]:o[propertyConfig.property_id],
            }).update(data);
        }
      })
    }
  }

  async putObjectProperty(object, id, propKey, propValue) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`未知的对象类型 ${object}`);
    const propertyConfig = objectConfig.property[propKey];
    if(!propertyConfig) throw new Error(`未知的对象属性 ${object}.${propKey}`);

    const newList = propValue;
    const oldList = await this.knex(propertyConfig.model).where({[propertyConfig.body_id]: id});
    const addList = _.differenceBy(newList, oldList, propertyConfig.property_id);
    const delList = _.differenceBy(oldList, newList, propertyConfig.property_id);
    const updateList = _.intersectionBy(newList, oldList, propertyConfig.property_id);

    if(_.size(addList)) {
      await this.knex(propertyConfig.model).insert(_.map(addList, o => ({
        ...o,
        [propertyConfig.body_id]: id
      })));
    }

    if(delList) {
      await Promise.all(_.map(delList, async o => {
        await this.knex(propertyConfig.model)
          .where({
            [propertyConfig.body_id]:id,
            [propertyConfig.property_id]:o[propertyConfig.property_id],
          }).delete();
      }))
    }

    if(_.size(updateList)) {
      await Promise.each(updateList, async o => {
        const data = _.omit(o, [propertyConfig.body_id, propertyConfig.property_id]);
        if(_.size(data)){
          await this.knex(propertyConfig.model)
            .where({
              [propertyConfig.body_id]:id,
              [propertyConfig.property_id]:o[propertyConfig.property_id],
            }).update(data);
        }
      })
    }
  }
}

export default {
  knex,

  async postObject(object, data) {
    const session = new BaseObjectSession({ knex });
    return await session.postObject(object, data);
  },

  async patchObject(object, query, data) {
    const session = new BaseObjectSession({ knex });
    const { id } = query;
    if(id) return await session.patchObjectById(object, id, data);
    else return await session.patchObject(object, query, data);
  },

  async getObject(object, query) {
    console.log({object, query})
    const session = new BaseObjectSession({ knex });
    return await session.getObject(object, query);
  },

  async getObjectList(object, query) {
    const session = new BaseObjectSession({ knex });
    return await session.getObjectList(object, query);
  },

  async getObjectCount(object, query) {
    const session = new BaseObjectSession({ knex });
    return await session.getObjectCount(object, query);
  },

  async deleteObject(object, query) {
    const session = new BaseObjectSession({ knex });
    return await session.deleteObject(object, query);
  },

  async getObjectProperty(object, id, propertyKey, propertyQuery = {}) {
    const session = new BaseObjectSession({ knex });
    return await session.getObjectProperty(object, id, propertyKey, propertyQuery);
  },

  async getObjectPropertyArray(object, ids, propertyKey, propertyQuery = {}) {
    const session = new BaseObjectSession({ knex });
    return await session.getObjectPropertyArray(object, ids, propertyKey, propertyQuery);
  },
}
