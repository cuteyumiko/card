import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';

import bindcardPass from '../bindcard';

module.exports = {
  postBefore: async function ({ objectConfig }, data ) {
    const { creator_id } = data;
    const creator = await this.getObject('user', { id: creator_id });
    if(!creator) throw new Error('用户信息不存在');
    const merchant = await this.getObject('merchant', { id: creator_id});
    if(!merchant) throw new Error('商户信息不存在');

    if(merchant.bindcard_id) {
      const bindcard_config = await this.getObject('bindcard', { id: merchant.bindcard_id });
      const bindcard_api = bindcardPass[bindcard_config.pass_code];
      if(!bindcard_api) throw new Error('绑卡信息配置有误');
      await bindcard_api.bind(JSON.parse(bindcard_config.pass_config), { ...data });
    }
  }
}
