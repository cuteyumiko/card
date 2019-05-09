import _ from 'lodash';
import moment from 'moment';

import CONFIG from '../config';
const knex = require('knex')(CONFIG.db);
import request from 'request-promise';

export default {

  async getAccessToken(appid, secret) {

    let ret_access_token;
    const weixin_access_token = await knex('bank_weixin_access_token').where({appid}).where('expires_time', '>', moment().add(1000, 's').toDate()).first();
    if(!weixin_access_token){
      const { errno, errmsg, access_token, expires_in } = await request.get('https://api.weixin.qq.com/cgi-bin/token', {
        qs: {
          grant_type: 'client_credential',
          appid, secret
        }, json: true,
      })

      if(errno) {
        await knex('bank_logs').insert({
          name: 'weixin_access_token',
          content: `${appid} ${errno} ${errmsg}`
        });
      }else {
        await knex('bank_weixin_access_token').insert({
          appid, access_token, expires_time: moment().add(expires_in, 's').toDate()
        })
      }

      ret_access_token = access_token;
    }else {
      ret_access_token = weixin_access_token.access_token;
    }
    return ret_access_token;
  },

  async getJsapiTicket(access_token) {
    let ret_jsapi_ticket;
    const weixin_jsapi_ticket = await knex('bank_weixin_jsapi_ticket').where({access_token}).where('expires_time', '>', moment().add(1000, 's').toDate()).first();
    if(!weixin_jsapi_ticket){
      const { errno, errmsg, ticket, expires_in } = await request.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
        qs: {
          type: 'jsapi',
          access_token
        }, json: true,
      })

      if(errno) {
        await knex('bank_logs').insert({
          name: 'weixin_access_token',
          content: `${access_token} ${errno} ${errmsg}`
        });
      }else {
        await knex('bank_weixin_jsapi_ticket').insert({
          access_token, jsapi_ticket: ticket, expires_time: moment().add(expires_in, 's').toDate()
        })
      }

      ret_jsapi_ticket = ticket;
    }else {
      ret_jsapi_ticket = weixin_jsapi_ticket.jsapi_ticket;
    }
    return ret_jsapi_ticket;
  }
}
