import _ from 'lodash';
import moment from 'moment';

import CONFIG from '../config';
const knex = require('knex')(CONFIG.db);

export default {
  async changeValue(user_id, value, info) {
    const balance = await knex('bank_user_balance').where({user_id}).orderBy('id', 'desc').first();

    const freeze_value = balance ? (balance.freeze_value || 0) : 0;
    let current_value = balance ? (balance.current_value || 0) : 0;

    if(value < 0 && current_value < -value ) throw new Error('账户余额不足');

    const change_value = value;
    current_value += change_value;

    return (await knex('bank_user_balance').insert({...info, user_id, current_value, change_value, freeze_value}))[0]
  },

  async freezeValue(user_id, value) {
    const balance = await knex('bank_user_balance').where({user_id}).orderBy('id', 'desc').first();

    let freeze_value = balance ? (balance.freeze_value || 0) : 0;
    let current_value = balance ? (balance.current_value || 0) : 0;

    if(value > 0 && current_value < value) throw new Error('冻结: 账户余额不足');
    if(value < 0 && freeze_value < -value) throw new Error('释放: 冻结余额不足');

    let change_value = -value;
    freeze_value += value;
    current_value += change_value;
    if(value < 0) { change_value = 0; }

    return (await knex('bank_user_balance').returning('id').insert({user_id, current_value, change_value, freeze_value}))[0];
  },

  async changeFreeze(user_id, value) {
    const balance = await knex('bank_user_balance').where({user_id}).orderBy('id', 'desc').first();

    let freeze_value = balance ? (balance.freeze_value || 0) : 0;
    let current_value = balance ? (balance.current_value || 0) : 0;

    if(value < 0 && freeze_value < -value) throw new Error('冻结余额不足');
    freeze_value += value;

    return (await knex('bank_user_balance').insert({user_id, current_value, change_value: 0, freeze_value}))[0]
  }
}
