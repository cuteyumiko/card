<template>
  <div style="padding:10px;">
    <router-link tag="div" to="/share_qr_spread">
      <img src="/static/jifen-banner.jpg" style="width:100%;" />
    </router-link>
    <div style="display:flex;">
      <div style="background:#8b531d;border-right:4px solid #c4c3c1;"><div style="color:#fff;padding:5px;padding-right:20px;">选择银行</div></div>
      <div style="margin-left:10px;padding:5px;border:1px solid #bfbfbf;flex:1;" @click="showSourcePopupPiker = true">
        {{currentSource.name}}
        <i class="iconfont icon-unfold" style="float:right;" />
      </div>
    </div>

    <div v-if="currentSource.description" style="color:#4960fa;margin-top:10px;text-align:justify;line-height:0.5rem;">
      {{currentSource.description}}
    </div>

    <div style="border-top:1px solid #dcdcdc;margin:10px 0;"></div>

    <table style="font-size:0.3rem;width:100%;text-align:center;" cellspacing="0">
      <thead>
        <tr>
          <th class="product-title" rowspan="2" colspan="2">
            积分卡
          </th>
          <th class="level-title" :colspan="levelList.length">代理级别</th>
          <th class="points-title" rowspan="2">兑换积分</th>
          <th class="settle-type-title" rowspan="2">结算时间</th>
        </tr>
        <tr>
          <th class="level-title" v-for="o in levelList" :key="o.id">{{o.name}}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="o in list" :key="o.id">
          <td class="product-icon">
            <img :src="o.source_icon" style="width:24px;height:24px;" >
          </td>
          <td class="product-item">
            <div>{{o.source_name}}</div>
            <div>{{o.name}}</div>
          </td>
          <td class="level-item" v-for="p in levelList" :key="p.id">{{p[`ticket_${o.id}`]}}</td>
          <td class="points-item">{{o.points}}</td>
          <td class="settle-type-item">{{o.settle_type_name}}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin:10px;">您当前为{{info.user.level_name}}</div>

    <div style="display:flex;font-size:0.5rem;text-align:center;color:#fff;">
      <div style="flex:1;padding:5px;">
        <vux-x-button class="btn-apply" @click.native="$router.push('/record/ticket')">兑换记录</vux-x-button>
      </div>
      <div style="flex:1;padding:5px;">
        <vux-x-button class="btn-apply" :disabled="!currentSource.id" @click.native="goApply">立即兑换</vux-x-button>
      </div>
    </div>

    <img src="/static/jifen-liucheng.jpg" style="width:100%;" />

    <vux-popup-picker :show.sync="showSourcePopupPiker" :show-cell="false" :columns="1" @on-change="handleChangeSource" :data="popupSourceList" ></vux-popup-picker>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      loading: false,
      search: { source_id: '', is_enabled: 1 },
      list: [],

      sourceList: [],
      levelList: [],

      showSourcePopupPiker: false,

      settleTypeList: [
        { id: 1, name: '隔天' },
        { id: 2, name: '秒到' },
      ],
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
    currentSource() {
      if (this.search.source_id === '') return { id: '', name: '全部银行' };
      return _.find(this.sourceList, { id: parseInt(this.search.source_id, 10) }) || { name: this.search.source_id };
    },

    popupSourceList() {
      return [
        { value: '', name: '全部银行' },
        ..._.map(this.sourceList, o => ({
          ...o, value: `${o.id}`,
        })),
      ];
    },
  },
  watch: {
    search: {
      async handler() {
        await this.reload();
      },
      deep: true,
    },
  },
  methods: {
    reload: _.throttle(async function _reload() {
      this.loading = true;

      try {
        const { source_id, ...params } = this.search;
        if (source_id) params.source_id = source_id;
        const { body } = (await this.$http.get('/api/product_ticket', { params }));
        this.list = _.map(body, o => ({
          ...o,
          settle_type_name: (_.find(this.settleTypeList, { id: o.settle_type }) || { name: o.settle_type }).name,
          create_time: moment.unix(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
        }));
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }

      this.loading = false;
    }, 200, { leading: false }),
    async handleChangeSource([idx]) {
      this.search = {
        ...this.search,
        source_id: idx,
      };
    },

    goApply() {
      this.$router.push(`/product_ticket_source/${this.currentSource.id}`);
    },
  },
  async mounted() {
    document.title = '积分兑换';
    this.sourceList = (await this.$http.get('/api/product_ticket_source?is_enabled=1')).body;
    let levelList = (await this.$http.get('/api/m/user_level')).body;

    levelList = await Promise.all(_.map(levelList, async (o) => {
      let price = (await this.$http.get(`/api/user_level/${o.id}/ticketPrice`)).body;
      price = _(price).mapKeys(p => `ticket_${p.ticket_id}`).mapValues('money').value();
      return {
        ...o,
        ...price,
      };
    }));
    this.levelList = levelList;
    this.reload();
  },
};
</script>

<style scoped lang="less">
.btn-apply {
  flex:1;
  background-color:#22243b;
  color:#fff;
}
.btn-apply:disabled {
  background-color: #bbb;
  color: #fff;
}

.product-title {
  background-color: #ffb078;
  color: #fff;
  font-size: 0.3rem;
}
.product-icon {
  border: 1px solid #ffb078;
  border-right: 0;
  border-top: 0;
}

.product-item {
  border: 1px solid #ffb078;
  border-left: 0;
  border-top: 0;
  width: 80px;
}

.level-title {
  background-color: #0062ba;
  color: #fff;
}

.level-item {
  border: 1px solid #0062ba;
  border-top: 0;
  border-left: 0;
}

.points-title {
  background-color: #00bab7;
  color: #fff;
}

.points-item {
  border: 1px solid #00bab7;
  border-top: 0;
  border-left: 0;
}

.settle-type-title {
  background-color: #65ab9f;
  color: #fff;
}

.settle-type-item {
  border: 1px solid #65ab9f;
  border-top: 0;
  border-left: 0;
}
</style>
