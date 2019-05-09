import _ from 'lodash';
import moment from 'moment';

import CONFIG from './config';
const knex = require('knex')(CONFIG.db);

import smsPass from './sms';

const merchantObjectConfig = {
  'info': { view: 'v_m_info' },
  'product_card': { view: 'v_m_bank_product_card' },
  'product_card_source': { view: 'v_m_bank_product_card_source' },
  'product_loan': { view: 'v_m_bank_product_loan' },
  'product_ticket': { view: 'v_m_bank_product_ticket'},
  'user': { model: 'bank_user', view: 'v_bank_user' },
  'user_team': { view: 'v_bank_user_team' },
  'user_level': { model: 'bank_user_level', view: 'bank_user_level' },
  'merchant_notice': { model: 'bank_merchant_notice', view: 'v_bank_merchant_notice' },
  'merchant_article': { view: 'v_bank_merchant_article' },
  'merchant_bill': { model: 'bank_merchant_bill', view: 'v_bank_merchant_bill' },

  'copy_library': { view: 'v_m_bank_copy_library' },
  'course': { view: 'v_m_bank_course' },

  'extend': { view: 'v_m_bank_merchant_extend' },

  'product_card_order': { view: 'v_bank_product_card_order' },
  'product_loan_order': { view: 'v_bank_product_loan_order' },
  'product_ticket_order': { view: 'v_bank_product_ticket_order' },
  'user_level_order': { view: 'v_bank_user_level_order' },
  'cash_order': { view: 'v_bank_cash_order' },

  'stat_card_order_by_day': { view: 'v_m_bank_stat_card_order_by_day'},
  'stat_card_order_by_month_x_product': { view: 'v_m_bank_stat_card_order_by_month_x_product'},

  'stat_loan_order_by_day': { view: 'v_m_bank_stat_loan_order_by_day'},
  'stat_loan_order_by_month_x_product': { view: 'v_m_bank_stat_loan_order_by_month_x_product'},

  'stat_ticket_order_by_day': { view: 'v_m_bank_stat_ticket_order_by_day'},
  'stat_ticket_order_by_month_x_product': { view: 'v_m_bank_stat_ticket_order_by_month_x_product'},

  'stat_level_order_by_day': { view: 'v_m_bank_stat_level_order_by_day'},

  'stat_card_order_by_merchant$month': { view: 'vs_bank_stat_card_order_by_merchant$month' },
  'stat_loan_order_by_merchant$month': { view: 'vs_bank_stat_loan_order_by_merchant$month' },
  'stat_ticket_order_by_merchant$month': { view: 'vs_bank_stat_ticket_order_by_merchant$month' },
  'stat_level_order_by_merchant$month': { view: 'vs_bank_stat_level_order_by_merchant$month' },

  'stat_card_order_by_merchant$month$source': { view: 'vs_bank_stat_card_order_by_merchant$month$source' },
  'stat_loan_order_by_merchant$month$product': { view: 'vs_bank_stat_loan_order_by_merchant$month$product' },
  'stat_ticket_order_by_merchant$month$product': { view: 'vs_bank_stat_ticket_order_by_merchant$month$product' },
};

const objectConfig = {

  'system_log': { model: 'bank_system_log', view: 'v_bank_system_log' },

  // @merchant
  'info@merchant': { view: 'v_m_info' },
  'product_card@merchant': { view: 'v_m_bank_product_card' },
  'product_card_source@merchant': { view: 'v_m_bank_product_card_source' },
  'product_loan@merchant': { view: 'v_m_bank_product_loan' },
  'product_ticket@merchant': { view: 'v_m_bank_product_ticket'},
  'user@merchant': { model: 'bank_user', view: 'v_bank_user' },
  'user_team@merchant': { view: 'v_bank_user_team' },
  'user_level@merchant': { model: 'bank_user_level', view: 'bank_user_level' },
  'merchant_notice@merchant': { model: 'bank_merchant_notice', view: 'v_bank_merchant_notice' },
  'merchant_article@merchant': { view: 'v_bank_merchant_article' },
  'merchant_bill@merchant': { model: 'bank_merchant_bill', view: 'v_bank_merchant_bill' },

  'copy_library@merchant': { view: 'v_m_bank_copy_library' },
  'course@merchant': { view: 'v_m_bank_course' },

  'extend@merchant': { view: 'v_m_bank_merchant_extend' },

  'sms@merchant': { view: 'v_m_bank_sms' },

  'product_card_order@merchant': { view: 'v_bank_product_card_order' },
  'product_loan_order@merchant': { view: 'v_bank_product_loan_order' },
  'product_ticket_order@merchant': { view: 'v_bank_product_ticket_order' },
  'user_level_order@merchant': { view: 'v_bank_user_level_order' },
  'cash_order@merchant': { view: 'v_bank_cash_order' },

  'stat_card_order_by_day@merchant': { view: 'v_m_bank_stat_card_order_by_day'},
  'stat_card_order_by_month_x_product@merchant': { view: 'v_m_bank_stat_card_order_by_month_x_product'},

  'stat_loan_order_by_day@merchant': { view: 'v_m_bank_stat_loan_order_by_day'},
  'stat_loan_order_by_month_x_product@merchant': { view: 'v_m_bank_stat_loan_order_by_month_x_product'},

  'stat_ticket_order_by_day@merchant': { view: 'v_m_bank_stat_ticket_order_by_day'},
  'stat_ticket_order_by_month_x_product@merchant': { view: 'v_m_bank_stat_ticket_order_by_month_x_product'},

  'stat_level_order_by_day@merchant': { view: 'v_m_bank_stat_level_order_by_day'},

  'stat_card_order_by_merchant$month@merchant': { view: 'vs_bank_stat_card_order_by_merchant$month' },
  'stat_loan_order_by_merchant$month@merchant': { view: 'vs_bank_stat_loan_order_by_merchant$month' },
  'stat_ticket_order_by_merchant$month@merchant': { view: 'vs_bank_stat_ticket_order_by_merchant$month' },
  'stat_level_order_by_merchant$month@merchant': { view: 'vs_bank_stat_level_order_by_merchant$month' },

  'stat_card_order_by_merchant$month$source@merchant': { view: 'vs_bank_stat_card_order_by_merchant$month$source' },
  'stat_loan_order_by_merchant$month$product@merchant': { view: 'vs_bank_stat_loan_order_by_merchant$month$product' },
  'stat_ticket_order_by_merchant$month$product@merchant': { view: 'vs_bank_stat_ticket_order_by_merchant$month$product' },

  // @user
  'team_user@user': { model: 'v_my_team_user' },

  'product_card_order_income@user': { view: 'v_bank_product_card_order_income' },
  'product_loan_order_income@user': { view: 'v_bank_product_loan_order_income' },
  'product_ticket_order_income@user': { view: 'v_bank_product_ticket_order_income' },
  'user_level_order_income@user': { view: 'v_bank_user_level_order_income' },
  'user_balance@user': { view: 'v_bank_user_balance' },
  'user_bank_card@user': { view: 'v_bank_user_bank_card' },
  'cash_order@user': { view: 'v_bank_cash_order'},
  'user_team@user': { view: 'v_bank_user_team' },

  'sms_code': { model: 'bank_sms_code' },

  'user': {
    model: 'bank_user',
    view: 'v_bank_user',
    property: {
      'referee': { body_id: 'user_id', property_id: 'referee_id', model: 'bank_user_referee' },
      'userLevel': { body_id: 'user_id', property_id: 'level_id', model: 'bank_user_x_user_level', view: 'v_bank_user_x_user_level'},

      'team_user': { body_id: 'user_id', view: 'v_my_team_user' },
      'product_card_order_income': { body_id: 'user_id', view: 'v_bank_product_card_order_income' },
      'product_loan_order_income': { body_id: 'user_id', view: 'v_bank_product_loan_order_income' },
      'product_ticket_order_income': { body_id: 'user_id', view: 'v_bank_product_ticket_order_income' },
      'user_level_order_income': { body_id: 'user_id', view: 'v_bank_user_level_order_income' },
      'user_balance': { body_id: 'user_id', view: 'v_bank_user_balance' },
      'user_bank_card': { body_id: 'user_id', view: 'v_bank_user_bank_card' },
      'cash_order': { body_id: 'user_id', view: 'v_bank_cash_order'},
      'user_team': { body_id: 'user_id', view: 'v_bank_user_team' },
    },
    postBefore: async function ({ id, objectConfig, object }, { referee_0_mobile, sms_code_id, sms_code, ...data }) {
      const { mobile, merchant_id, user_type } = data;
      let ext = {};
      if(user_type === 3) {
        if(!mobile) throw new Error('请填写手机号');
        if(!referee_0_mobile) throw new Error('请填写推荐人手机号');
        if(!sms_code_id) throw new Error('请重新获取验证码');
        if(!sms_code) throw new Error('请输入验证码');

        const user = await this.getObject(object, { mobile, merchant_id });
        if(user) throw new Error('该手机号已注册');
        const referee = await this.getObject(object, { mobile: referee_0_mobile, merchant_id });
        if(!referee) throw new Error('推荐人还不是会员');

        const level = await this.getObject('user_level', { value: 1, merchant_id });
        if(!level) throw new Error('请联系管理员，用户等级配置有误');

        const sms = await this.getObject('sms_code', { id: sms_code_id });
        console.log(sms);
        if(!sms) throw new Error('请重新获取验证码');
        if(sms.code != sms_code) throw new Error('验证码错误');

        ext = {
          referee_id: referee.id,
          level_id: level.id,
        }
      }

      return {
        ...data,
        ...ext,
      }
    },
    postAfter: async function ({ id, objectConfig, object }, data) {
      const { merchant_id, referee_id, mobile } = data;

      const referee = await this.getObject(object, { id: referee_id });
      const sms = await this.getObject('sms@merchant', { code: 'join.success.referee', merchant_id })
      if(sms) {
        const pass = smsPass[sms.pass_code];
        if(pass) {
          await pass.send(referee.mobile, { name: mobile }, JSON.parse(sms.pass_config));
        } else {
          console.log(`编码为${sms.pass_code}的通道未实现`);
        }
      } else {
        console.log('join.success.referee 短信未配置')
      }

      const referee_count = referee.referee_count;
      const nextLevel = await this.getObject('user_level', { merchant_id,
        value__gt: referee.level_value,
        referee_count__gt: referee.level_referee_count,
        referee_count__le: (referee.level_referee_count + referee_count - referee.cost_referee_count),
        order: 'referee_count'
      });

      if(nextLevel) {
        console.log('auto levelup')
        console.log({
          referee,
          value__gt: referee.level_value,
          referee_count__gt: referee.level_referee_count,
          referee_count__le: (referee.level_referee_count + referee_count - referee.cost_referee_count),
        })
      }


      if(nextLevel) {
        await this.knex('bank_user').where({id: referee.id}).increment('cost_referee_count', nextLevel.referee_count - referee.level_referee_count);
        this.patchObject(object, { id: referee.id }, { level_id: nextLevel.id })

        const smsList = [];
        smsList.push({
          sms_code: 'level_order.status.2.0',
          mobile: referee.mobile,
          from_level_name: referee.level_name,
          to_level_name: nextLevel.name,
        });

        if(smsList.length) {
          for(let i = 0; i < smsList.length; i += 1) {
            const { sms_code, mobile, ...o } = smsList[i];
            const sms = await this.getObject('sms@merchant', { code: sms_code, merchant_id })
            if(sms) {
              const pass = smsPass[sms.pass_code];
              if(pass) {
                await pass.send(mobile, o, JSON.parse(sms.pass_config))
              }
            }
          };
        }
      }

      let current_id = id;
      let refereeList = [];
      while(current_id) {
        const refereeQuery = await this.knex('v__bank_user_referee').where({current_id}).first();
        refereeList = [
          ...refereeList,
          refereeQuery.referee_0_id,
          refereeQuery.referee_1_id,
          refereeQuery.referee_2_id,
          refereeQuery.referee_3_id,
          refereeQuery.referee_4_id,
          refereeQuery.referee_5_id,
          refereeQuery.referee_6_id,
          refereeQuery.referee_7_id,
          refereeQuery.referee_8_id,
          refereeQuery.referee_9_id,
          refereeQuery.referee_10_id,
          refereeQuery.referee_11_id,
          refereeQuery.referee_12_id,
          refereeQuery.referee_13_id,
          refereeQuery.referee_14_id,
          refereeQuery.referee_15_id,
          refereeQuery.referee_16_id,
          refereeQuery.referee_17_id,
          refereeQuery.referee_18_id,
          refereeQuery.referee_19_id,
        ]
        current_id = refereeQuery.referee_19_id;
      }

      refereeList = _.compact(refereeList)

      await this.patchObjectProperty(object, id, 'referee', _.map(refereeList, (o, i) => ({
        user_id: id,
        referee_id: o,
        value: i
      })));
    },
    patchBefore: async function ({ object, objectConfig }, { referee_0_mobile, password, referee_id, ...data}, { id, level_id, level_value, merchant_id }) {
      if(data.mobile){
        if(!/^\d{11}$/.test(data.mobile)) throw new Error('手机号格式有误');
        const user = await this.getObject(object, {merchant_id, mobile: data.mobile, id__not: id});
        if(user) throw new Error('手机号已存在');
      }

      if(data.username){
        if(/^[0-9]*$/.test(data.username)) throw new Error('用户名不能为全数字');
        const user = await this.getObject(object, { merchant_id, username: data.username, id__not: id });
        if(user) throw new Error('用户名已存在');
      }

      let ext = {};
      if(referee_0_mobile){
        const referee = await this.getObject(object, {merchant_id, mobile: referee_0_mobile});
        if(!referee) throw new Error('推荐人手机号不是会员')
        ext.referee_id = referee.id
      }else if(referee_id != undefined) {
        ext.referee_id = referee_id;
      }

      if(password) ext.password = password;

      if(data.level_id && data.level_id != level_id) {

        const newLevel = await this.getObjectById('user_level', data.level_id)
        if(!newLevel) throw new Error('错误的新等级');
        if(newLevel.value > level_value) {
          const { user } = this.context;
          if(user.user_type == 3) {

            let userLevel = await this.getObjectProperty('user', user.id, 'userLevel', { level_id: data.level_id });
            if(!userLevel.length) throw new Error('没有配置升级次数');
            userLevel = userLevel[0];
            if(userLevel.up_count) {
              await this.knex('bank_user_x_user_level').where({user_id: user.id, level_id: data.level_id}).decrement('up_count', 1);
            }

            //throw new Error(`剩余次数：${userLevel[0].up_count}`)
          }

        }
      }

      return {
        ...data,
        ...ext,
      }

    },
    patchAfter: async function( { id, objectConfig, object }, { referee_id, ...coming }, { referee_id: old_referee_id, ...saved} ) {
      console.log(referee_id);
      console.log(coming);
      if(referee_id) {
        let rebuild_referee = true;
        if(old_referee_id == referee_id) {
          const list = await this.getObjectProperty(object, id, 'referee');
          console.log(list);
          if(list.length) rebuild_referee = false;
        }

        if(rebuild_referee) {
          let current_id = id;
          let refereeList = [];
          while(current_id) {
            const refereeQuery = await this.knex('v__bank_user_referee').where({current_id}).first();
            refereeList = [
              ...refereeList,
              refereeQuery.referee_0_id,
              refereeQuery.referee_1_id,
              refereeQuery.referee_2_id,
              refereeQuery.referee_3_id,
              refereeQuery.referee_4_id,
              refereeQuery.referee_5_id,
              refereeQuery.referee_6_id,
              refereeQuery.referee_7_id,
              refereeQuery.referee_8_id,
              refereeQuery.referee_9_id,
              refereeQuery.referee_10_id,
              refereeQuery.referee_11_id,
              refereeQuery.referee_12_id,
              refereeQuery.referee_13_id,
              refereeQuery.referee_14_id,
              refereeQuery.referee_15_id,
              refereeQuery.referee_16_id,
              refereeQuery.referee_17_id,
              refereeQuery.referee_18_id,
              refereeQuery.referee_19_id,
            ]
            current_id = refereeQuery.referee_19_id;
          }

          refereeList = _.compact(refereeList)

          await this.patchObjectProperty(object, id, 'referee', _.map(refereeList, (o, i) => ({
            user_id: id,
            referee_id: o,
            value: i
          })));
        }
      }
    }
  },
  'article': { model: 'bank_article', view: 'v_bank_article' },
  'news': { model: 'bank_news', view: 'bank_news' },
  'bank': { model: 'bank_bank', view: 'bank_bank' },

  'course': { model: 'bank_course', view: 'v_bank_course', property: {
    'merchant': { body_id: 'course_id', property_id: 'merchant_id', model: 'bank_merchant_x_course' }
  } },
  'course_type': { model: 'bank_course_type', view: 'bank_course_type' },

  'article_type': { model: 'bank_article_type', view: 'bank_article_type' },
  'merchant': { model: 'bank_merchant', view: 'bank_merchant', property: {
    'cardPrice': { body_id: 'merchant_id', property_id: 'card_id', model: 'bank_merchant_x_product_card', view: 'bank_merchant_x_product_card' },
    'cardSource': { body_id: 'merchant_id', property_id: 'source_id', model: 'bank_merchant_x_product_card_source', view: 'bank_merchant_x_product_card_source'},
    'loanPrice': { body_id: 'merchant_id', property_id: 'loan_id', model: 'bank_merchant_x_product_loan', view: 'bank_merchant_x_product_loan' },
    'ticketPrice': { body_id: 'merchant_id', property_id: 'ticket_id', model: 'bank_merchant_x_product_ticket', view: 'bank_merchant_x_product_ticket' },
    'sms': { body_id: 'merchant_id', property_id: 'sms_id', model: 'bank_merchant_x_sms', view: 'bank_merchant_x_sms' },
    'extend' : { body_id: 'merchant_id', property_id: 'extend_id', model: 'bank_merchant_x_extend' },
  } },
  'merchant_extend': { model: 'bank_merchant_extend', view: 'bank_merchant_extend' },
  'user_level': { model: 'bank_user_level', view: 'bank_user_level', property: {
    'card': { body_id: 'level_id', property_id: 'card_id', model: 'bank_user_level_x_product_card', view: 'bank_user_level_x_product_card' },
    'cardSource': { body_id: 'level_id', property_id: 'source_id', model: 'bank_user_level_x_product_card_source', view: 'bank_user_level_x_product_card_source' },
    'loanPrice': { body_id: 'level_id', property_id: 'loan_id', model: 'bank_user_level_x_product_loan', view: 'bank_user_level_x_product_loan' },
    'ticketPrice': { body_id: 'level_id', property_id: 'ticket_id', model: 'bank_user_level_x_product_ticket', view: 'bank_user_level_x_product_ticket' },
  } },

  'product_card': { model: 'bank_product_card', view: 'v_bank_product_card', property: {
    'type': { body_id: 'card_id', property_id: 'type_id', model: 'bank_product_card_x_type', view: 'bank_product_card_x_type' },
  } },
  'product_card_type': { model: 'bank_product_card_type', view: 'bank_product_card_type' },
  'product_card_source': { model: 'bank_product_card_source', view: 'bank_product_card_source' },
  'product_card_order': { model: 'bank_product_card_order', view: 'v_bank_product_card_order' },

  'product_loan': { model: 'bank_product_loan', view: 'v_bank_product_loan', property: {
    'type': { body_id: 'loan_id', property_id: 'type_id', model: 'bank_product_loan_x_type', view: 'bank_product_loan_x_type' },
  } },
  'product_loan_type': { model: 'bank_product_loan_type', view: 'v_bank_product_loan_type' },
  'product_loan_order': { model: 'bank_product_loan_order', view: 'v_bank_product_loan_order' },

  'product_ticket': { model: 'bank_product_ticket', view: 'v_bank_product_ticket'},
  'product_ticket_source': { model: 'bank_product_ticket_source', view: 'bank_product_ticket_source' },
  'product_ticket_order': { model: 'bank_product_ticket_order', view: 'v_bank_product_ticket_order' },

  'user_level_order': { model: 'bank_user_level_order', view: 'v_bank_user_level_order' },

  'sms': { model: 'bank_sms', view: 'bank_sms' },
  'payment': { model: 'bank_payment', view: 'bank_payment' },
  'agentpay': { model: 'bank_agentpay', view: 'bank_agentpay' },
  'bindcard': { model: 'bank_bindcard', view: 'bank_bindcard' },
  'product_ticket_process': { model: 'bank_product_ticket_process', view: 'bank_product_ticket_process' },

  'copy_library': { model: 'bank_copy_library', view: 'v_bank_copy_library', property: {
    'merchant': { body_id: 'copy_library_id', property_id: 'merchant_id', model: 'bank_merchant_x_copy_library' }
  } },

  'qr_spread': { model: 'bank_qr_spread', view: 'bank_qr_spread' },
  'user_balance': { model: 'bank_user_balance', view: 'v_bank_user_balance' },

  'merchant_notice_type': { model: 'bank_merchant_notice_type', view: 'bank_merchant_notice_type' },

  'user_bank_card': { model: 'bank_user_bank_card', view: 'bank_user_bank_card' },

  'cash_order': { model: 'bank_cash_order', view: 'v_bank_cash_order' },

  'logs': { model: 'bank_logs', view: 'bank_logs' },

  'merchant_notice': { model: 'bank_merchant_notice', view: 'v_bank_merchant_notice' },

  'merchant_article': { model: 'bank_merchant_article', view: 'v_bank_merchant_article' },
  'merchant_article_type': { model: 'bank_merchant_article_type' },
  'merchant_bill': { model: 'bank_merchant_bill', view: 'v_bank_merchant_bill' },
  'merchant_bill_type': { model: 'bank_merchant_bill_type' },

  'merchant_product_card': { view: 'v_m_bank_product_card' },
  'merchant_product_card_source': { view: 'v_m_bank_product_card_source' },
  'merchant_product_loan': { view: 'v_m_bank_product_loan' },
  'merchant_product_ticket': { view: 'v_m_bank_product_ticket'},

  'recharge_order': { model: 'bank_recharge_order', view: 'v_bank_recharge_order',
    postAfter: async (req, res, next, { id, oc }) => {
      const { base_id } = await knex(oc.model).max('id as base_id').where('create_time', '<', moment().millisecond(0).toDate()).first();
      const code = `RC${moment().format('YYMMDDHHmmss')}${_.padStart(id - (base_id || 0), 4,0)}`;
      await knex(oc.model).where({id}).update({code});
    },
  },

  'stat_card_order_by_merchant$month': { view: 'vs_bank_stat_card_order_by_merchant$month' },
  'stat_loan_order_by_merchant$month': { view: 'vs_bank_stat_loan_order_by_merchant$month' },
  'stat_ticket_order_by_merchant$month': { view: 'vs_bank_stat_ticket_order_by_merchant$month' },
  'stat_level_order_by_merchant$month': { view: 'vs_bank_stat_level_order_by_merchant$month' },
  'stat_cash_order_by_merchant$month': { view: 'vs_bank_stat_cash_order_by_merchant$month' },

  'stat_card_order_by_merchant$month$source': { view: 'vs_bank_stat_card_order_by_merchant$month$source' },
  'stat_loan_order_by_merchant$month$product': { view: 'vs_bank_stat_loan_order_by_merchant$month$product' },
  'stat_ticket_order_by_merchant$month$product': { view: 'vs_bank_stat_ticket_order_by_merchant$month$product' },

};


const objectConfigTable = objectConfig;

const daoDoQuery = (daoList, { order, sum, ...query}) => {
  _.forEach(query, (value, key) => {
    const args = key.split('__');
    if(args.length == 1){
      if(value === ''){
        _.forEach(daoList, dao => dao.whereNull(key))
      }else{
        _.forEach(daoList, dao => dao.where(key, value))
      }
    }else if(args.length == 2){
      if(args[1] == 'like'){
        _.forEach(daoList, dao => dao.where(args[0], 'like', `%${value}%`))
      }else if(args[1] === 'gt') {
        _.forEach(daoList, dao => dao.where(args[0], '>', value))
      }else if(args[1] === 'ge') {
        _.forEach(daoList, dao => dao.where(args[0], '>=', value))
      }else if(args[1] === 'lt') {
        _.forEach(daoList, dao => dao.where(args[0], '<', value))
      }else if(args[1] === 'le') {
        _.forEach(daoList, dao => dao.where(args[0], '<=', value))
      }else if(args[1] === 'not') {
        if(value === ''){
          _.forEach(daoList, dao => dao.whereNotNull(args[0]))
        } else {
          _.forEach(daoList, dao => dao.whereNot(args[0], value))
        }
      }else if(args[1] === 'in') {
        _.forEach(daoList, dao => dao.whereIn(args[0], value))
      }
    }
  })

  if(order){
    _.forEach(order.split(','), o => {
      if(_.endsWith(o, '+')){
        _.forEach(daoList, dao => dao.orderBy(_.trimEnd(o,'+'), 'asc'))
      }else if(_.endsWith(o, '__asc')){
        _.forEach(daoList, dao => dao.orderBy(_.trimEnd(o,'__asc'), 'asc'))
      } else {
        _.forEach(daoList, dao => dao.orderBy(_.trimEnd(o,'-'), 'desc'))
      }
    })
  }

  if(sum) {
    _.forEach(sum.split(','), o => {
      _.forEach(daoList, dao => dao.sum(`${o} as ${o}`));
    });
  }
}

class ObjectSession {
  constructor(knex, context) {
    this.knex = knex;
    this.context = context || {};
  }

  async getObjectList(object, { offset, limit, ...query }) {
    const objectConfig = objectConfigTable[object];
    if (!objectConfig) throw new Error(`404 getObjectList ${object}`);

    const offsetOK = Math.max(parseInt(offset) || 0, 0);
    const limitOK = Math.max(parseInt(limit) || 0, 0);

    const dao = this.knex(objectConfig.view || objectConfig.model);
    const daoCount = this.knex(objectConfig.view || objectConfig.model);
    daoDoQuery([dao, daoCount], query);
    if(limitOK) dao.offset(offsetOK).limit(limitOK);
    const list = await dao;
    const { total } = await daoCount.count('* as total').first();
    return { list, total };
  }

  async getObject(object, query) {
    const objectConfig = objectConfigTable[object];
    if (!objectConfig) throw new Error(`404 getObject ${object}`);

    const dao = this.knex(objectConfig.view || objectConfig.model);
    daoDoQuery([dao], query)
    return await dao.first();
  }

  async getObjectById(object, id) {
    const objectConfig = objectConfigTable[object];
    if (!objectConfig) throw new Error(`404 getObjectById ${object}`);

    const dao = this.knex(objectConfig.view || objectConfig.model);
    dao.where({id})
    return await dao.first();
  }

  async postObject(object, data) {
    const objectConfig = objectConfigTable[object];
    console.log(data);
    if(!objectConfig) throw new Error(`404 postObject ${object}`);

    let saveData = data;
    if(objectConfig.postBefore) {
      const postBefore = _.bind(objectConfig.postBefore, this);
      saveData = (await postBefore({ object, objectConfig }, data)) || saveData;
    }

    const body = _.omit(saveData, _.keys(objectConfig.property));
    const property = _.pick(saveData, _.keys(objectConfig.property));

    const dao = this.knex(objectConfig.model).returning('id');
    const id = (await dao.insert(body))[0];

    await Promise.all(_.map(property, async (o, p) => {
      await this.patchObjectProperty(object, id, p, o);
    }));

    if(objectConfig.postAfter) {
      const item = await this.knex(objectConfig.model).where({id}).first();
      const postAfter = _.bind(objectConfig.postAfter, this);
      await postAfter({ id, object, objectConfig }, item);
    }

    return { ...saveData, id };
  }

  async patchObject(object, query, data) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`404 patchObject ${object}`);

    const property = _.pick(data, _.keys(objectConfig.property));

    if(objectConfig.patchBefore || objectConfig.patchAfter || _.size(property)) {
      if(query.id) {
        return await this.patchObjectById(object, query.id, data);
      } else {
        const { list: patchList} = await this.getObjectList(object, query);
        for(let i = 0; i < patchList.length; i += 1) {
          const { id } = patchList[i];
          await this.patchObjectById(object, id, data);
        }
      }
    } else {
      const dao = this.knex(objectConfig.model);
      daoDoQuery([dao], query)
      await dao.update(data);
    }
  }

  async patchObjectById(object, id, data){
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`404 patchObjectById ${object}`);

    const item = await this.getObjectById(object, id);
    if(!item) throw new Error('无效的ID');

    let saveData = data;
    if(objectConfig.patchBefore) {
      const patchBefore = _.bind(objectConfig.patchBefore, this)
      saveData = (await patchBefore({ id, object, objectConfig }, data, item)) || saveData;
    }

    const body = _.omit(saveData, _.keys(objectConfig.property));
    const property = _.pick(saveData, _.keys(objectConfig.property));

    console.log(body);
    console.log(property);
    if(_.size(body)) {
      const dao = this.knex(objectConfig.model).where({id});
      await dao.update(body);
    }

    if(_.size(property)) {
      await Promise.all(_.map(_.pick(objectConfig.property, _.keys(property)), async (propertyConfig, propKey) => {
        await this.patchObjectProperty(object, id, propKey, property[propKey])
      }))
    }

    if(objectConfig.patchAfter) {
      const patchAfter = _.bind(objectConfig.patchAfter, this)
      await patchAfter({ id, objectConfig, object }, saveData, item);
    }
  }

  async getObjectProperty(object, id, propertyKey, { offset, limit, ...query }) {
    const objectConfig = objectConfigTable[object];
    if (!objectConfig) throw new Error(`404 getObjectProperty ${object}`);

    const offsetOK = Math.max(parseInt(offset) || 0, 0);
    const limitOK = Math.max(parseInt(limit) || 0, 0);

    const propertyConfig = objectConfig.property[propertyKey];

    if (limitOK) {
      const dao = this.knex(propertyConfig.view || propertyConfig.model);
      const daoCount = this.knex(propertyConfig.view || propertyConfig.model);
      daoDoQuery([dao, daoCount], {
        ...query,
        [propertyConfig.body_id]: id
      })
      dao.offset(offsetOK).limit(limitOK);
      const { total } = await daoCount.count('* as total').first();

      return {
        total,
        list: await dao,
      };
    } else {
      const dao = this.knex(propertyConfig.view || propertyConfig.model);
      daoDoQuery([dao], {
        ...query,
        [propertyConfig.body_id]: id
      });
      return await dao;
    }
  }

  async patchObjectProperty(object, id, propertyKey, propValue) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`404 patchObjectProperty ${object}`);

    const propertyConfig = objectConfig.property[propertyKey];

    const newList = propValue;
    const oldList = await this.knex(propertyConfig.model).where({[propertyConfig.body_id]: id});
    const addList = _.differenceBy(newList, oldList, propertyConfig.property_id);
    const delList = _.differenceBy(oldList, newList, propertyConfig.property_id);
    const updateList = _.intersectionBy(newList, oldList, propertyConfig.property_id);

    if(addList) {
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

    if(updateList) {
      await Promise.all(_.map(updateList, async o => {
        const data = _.omit(o, [propertyConfig.body_id, propertyConfig.property_id]);
        if(_.size(data)){
          await this.knex(propertyConfig.model)
            .where({
              [propertyConfig.body_id]:id,
              [propertyConfig.property_id]:o[propertyConfig.property_id],
            }).update(data);
        }
      }))
    }
  }

  async deleteObject(object, query) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`404 deleteObject ${object}`);

    if(objectConfig.deleteBefore) {
      if(query.id) {
        return await this.deleteObjectById(object, query.id);
      } else {
        const { list: deleteList} = await this.getObjectList(object, query);
        for(let i = 0; i < deleteList.length; i += 1) {
          const { id } = deleteList[i];
          await this.deleteObjectById(object, id);
        }
      }
    } else {
      const dao = this.knex(objectConfig.model)
      daoDoQuery([dao], query)
      await dao.delete();
    }
  }

  async deleteObjectById(object, id) {
    const objectConfig = objectConfigTable[object];
    if(!objectConfig) throw new Error(`404 deleteObjectById ${object}`);

    if(objectConfig.deleteBefore) {
      const item = await this.getObjectById(object, id);
      if(!item) throw new Error('无效的ID');

      const deleteBefore = _.bind(objectConfig.deleteBefore, this);
      await deleteBefore({ id, objectConfig, object}, item);
    }

    const dao = this.knex(objectConfig.model).where({id});
    await dao.delete();
  }
}

const getObjectList = async (object, query) => {
  const session = new ObjectSession(knex);
  return await session.getObjectList(object, query);
};

const getObject = async (object, query) => {
  const session = new ObjectSession(knex);
  return await session.getObject(object, query);
};

const getObjectProperty = async (object, id, propertyKey, query) => {
  const session = new ObjectSession(knex);
  return await session.getObjectProperty(object, id, propertyKey, query);
}

const postObject = async (object, data) => {
  const session = new ObjectSession(knex);
  return await session.postObject(object, data);
};

const patchObject = async (object, query, data, context) => {
  const objectConfig = objectConfigTable[object];
  if(!objectConfig) throw new Error(404);

  if(objectConfig.patchTransaction) {
    await knex.transaction(async trx => {
      const session = new ObjectSession(trx, context);
      await session.patchObject(object, query, data);
    })

  } else {
    const session = new ObjectSession(knex, context);
    await session.patchObject(object, query, data);
  }
};

const patchObjectProperty = async (object, id, propertyKey, propValue) => {
  const session = new ObjectSession(knex);
  return await session.patchObjectProperty(object, id, propertyKey, propValue);
};

const deleteObject = async (object, query) => {
  const session = new ObjectSession(knex);
  return await session.deleteObject(object, query);
};

export default {
  objectConfig,
  merchantObjectConfig,

  knex,
  getObjectList, getObject, getObjectProperty,
  postObject, patchObject, deleteObject,
}
