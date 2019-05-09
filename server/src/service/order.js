import _ from 'lodash';
import moment from 'moment';

import CONFIG from '../config';
const knex = require('knex')(CONFIG.db);

import smsPass from '../sms';
import balanceService from '../service/balance';

export default {

  async changeTicketOrderStatus(id, status) {
    const item = await knex('v_bank_product_ticket_order').where({id}).first();
    if(!item) throw new Error('订单不存在')
    if(item.status == 2 || item.status == 3) throw new Error('订单已结束');

    await knex('bank_product_ticket_order').where({id}).update({status});

    if(status == 2) {
      const incomeList = await knex('v_bank_product_ticket_order_income').where({order_id: id});
      const smsList = [];
      await Promise.all(_.map(incomeList, async ({user_id, user_mobile, money, comments, lower_id, lower_mobile}) => {
        const balance = await knex('bank_user_balance').where({user_id}).orderBy('id', 'desc').first();
        const change_value = money;
        if(change_value){
          const current_value = balance ? (balance.current_value + change_value) : change_value;
          const freeze_value = balance ? balance.freeze_value : 0;
          await knex('bank_user_balance').insert({user_id, current_value, change_value, ticket_order_id: id, freeze_value, comments, lower_id})

          smsList.push({
            sms_code: comments === '直推用户' ? 'ticket_order.status.2.1' : 'ticket_order.status.2.2',
            name: comments === '直推用户' ? '本人' : lower_mobile,
            mobile: user_mobile,
            income_money: change_value.toFixed(2),
          })
        }
      }))

      if(smsList.length) {
        const product_name = item.product_name;
        const order_code = item.code;

        await Promise.all(_.map(smsList, async ({ sms_code, mobile, ...o}) => {
          const sms = await knex('v_m_bank_sms').where({code: sms_code, merchant_id: item.merchant_id}).first();
          if(sms) {
            const pass = smsPass[sms.pass_code];
            if(pass) {
              await pass.send(mobile, { ...o, product_name, order_code }, JSON.parse(sms.pass_config))
            }
          }
        }))
      }
    }
  },

  async changeLevelOrderStatus(id, status) {
    const item = await knex('v_bank_user_level_order').where({id}).first();
    if(!item) throw new Error('订单不存在')
    if(item.status == 2) throw new Error('订单已结束')

    if(status == 2) {
      const user = await knex('v_bank_user').where({id: item.creator_id}).first();

      if(user.level_id !== item.from_level_id) throw new Error('用户等级已变，订单无法完成')

      await knex('bank_user').where({id: item.creator_id}).update({level_id: item.to_level_id});
    }

    await knex('bank_user_level_order').where({id}).update({status});

    if(status == 2) {

      console.log(item);
      if(item.to_level_award_card_count && (item.to_level_award_card_count > item.from_level_award_card_count)) {
        await knex('bank_user').where({id:item.creator_id}).increment('invite_card_target', item.to_level_award_card_count - item.from_level_award_card_count)
      }

      const incomeList = await knex('v_bank_user_level_order_income').where({order_id: id});;
      const smsList = [];
      smsList.push({
        sms_code: 'level_order.status.2.0',
        mobile: item.creator_mobile,
        from_level_name: item.from_level_name,
        to_level_name: item.to_level_name,
      });

      await Promise.all(_.map(incomeList, async ({user_id, user_mobile, money, lower_id, lower_name}) => {
        if(money) {
          await balanceService.changeValue(user_id, money, { level_order_id: id, lower_id });
          smsList.push({
            sms_code: item.creator_id == lower_id ? 'level_order.status.2.1' : 'level_order.status.2.2',
            mobile: user_mobile,
            name: lower_name,
            income_money: money.toFixed(2),
            // product_name : `从${item.from_level_name}到${item.to_level_name}`,
            from_level_name: item.from_level_name,
            to_level_name: item.to_level_name,
          })
        }
      }))


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
  },

  async changeCashOrderStatus(id, status){
    const item = await knex('v_bank_cash_order').where({id}).first();
    if(!item) throw new Error('订单不存在');
    if(item.status == 2 || item.status == 3) throw new Error('订单已结束');

    await knex('bank_cash_order').where({id}).update({status});

    if(status == 2) {
      await knex('bank_cash_order').where({id}).update({close_time: moment().toDate()});
      const user_id = item.creator_id;

      await balanceService.changeFreeze(user_id, -item.money);

      // const change_value = -item.money;
      // const balance = await knex('bank_user_balance').where({user_id}).orderBy('id', 'desc').first();
      //
      // if(change_value){
      //   const current_value = balance ? balance.current_value : 0;
      //   const freeze_value = balance ? ((balance.freeze_value || 0) + change_value) : change_value
      //   await knex('bank_user_balance').insert({user_id, current_value, freeze_value})
      // }

      const sms = await knex('v_m_bank_sms').where({code: 'cash_order.status.2', merchant_id: item.merchant_id}).first();
      if(!sms) throw new Error(400).send('编码为cash_order.status.2的短信模版未配置，请联系管理员');
      const pass = smsPass[sms.pass_code];
      if(!pass) throw new Error(400).send(`编码为${sms.pass_code}的通道未实现，请联系管理员`);
      const result = await pass.send(item.creator_mobile, { income_money: item.money }, JSON.parse(sms.pass_config))

    } else if(status == 3) {
      await knex('bank_cash_order').where({id}).update({close_time: moment().toDate()});
      const user_id = item.creator_id;

      await balanceService.freezeValue(user_id, -item.money);
    }
  },
}
