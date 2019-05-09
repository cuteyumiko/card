<template>
  <div>
    <div style="position:relative;margin-bottom:70px;">
      <img :src="this.merchant.extendImage.myshop_top_image || '../assets/myshop-bg.png'" style="width:100%;height:120px;" />

      <div style="position:absolute; bottom: -40px;left:0;right:0;text-align:center">
        <img :src="user.head_image || headImage" style="width:80px;height:80px;border-radius:40px;border:2px solid #fff;" />
        <div style="position:absolute; bottom: -35px;left:0;right:0;">
          <div>
            <div style="display:inline-block;background:#FFC031;padding:3px 10px;border-radius:50px;color:#fff;">{{user.level_name}}</div>
          </div>
          <div>{{user.shop_message}}</div>
        </div>
      </div>
    </div>
    <div style="display:flex;">
      <div style="flex:1;" @click="idx = 0">
        <div class="tab-item" :class="{active: idx === 0}">信用卡</div>
      </div>
      <div style="flex:1;" @click="idx = 1">
        <div class="tab-item" :class="{active: idx === 1}">贷款</div>
      </div>
    </div>

    <div v-if="idx === 0">
      <router-link tag="div" :to="`/product_card_apply?referee=${$route.query.referee}&id=${o.id}`" v-for="o in card_list" :key="o.id" style="display:flex;padding:10px;align-items:center;">
        <div>
          <img :src="o.icon" style="width:60px;height:60px;" />
        </div>
        <div style="flex:1;margin-left:13px;">
          <div style="color:#333333;font-size:0.43rem;">{{o.name}}
            <span v-if="o.property.tips" style="background:#fde0d8;color:#ED471C;padding:1px 5px;border-radius:5px;">{{o.property.tips}}</span>
          </div>
          <div style="color:#999999;">{{o.description ? o.description.replace(/\n/, ' ') : ''}}</div>
          <div style="color:#999999;"><span style="color:#ED471C;">{{o.got_count}}</span> 人已申请</div>
        </div>
        <div>
          <div style="color:#ED471C;text-align:right;">立即申请</div>
        </div>
      </router-link>
    </div>

    <div v-if="idx === 1">
      <div style="display:flex;overflow-x:scroll;padding:10px;">
        <div @click="setLoanType(o.id)" v-for="o in loan_type_list" :key="o.id" style="padding:0 12px">
          <img :src="o.icon" style="width:48px;height:48px;" />
          <div style="text-align:center;font-size:0.3rem;">{{o.name}}</div>
        </div>
      </div>
      <div style="display:flex;">
        <div @click="setLoanType2(o.id)" v-for="o in loan_type2_list" :key="o.id" style="padding:0 12px">
          <div style="text-align:center;font-size:0.3rem;padding:5px;" :style="{color: loan_type2_ids.indexOf(o.id) !== -1 ? '#FEC51D' : '#818181',}">{{o.name}}</div>
        </div>
      </div>

      <router-link tag="div" :to="`/product_loan_apply?referee=${$route.query.referee}&id=${o.id}`" v-for="o in loanList" :key="o.id" style="position:relative;display:flex;align-items:center;border-top:1px solid #eee;padding: 5px;">
        <div>
          <img :src="o.icon" style="width:48px;height:48px;" />
        </div>
        <div style="flex:1;margin-left:5px;">
          <div style="display:flex;align-items:center;">
            <div>{{o.name}} <span v-if="o.tip_text" style="background:#fde0d8;color:#ED471C;padding:1px 5px;border-radius:5px;">{{o.got_count}}人已申请</span></div>
          </div>
          <div style="display:flex;align-items:center;font-size:0.3rem;margin-top:1px;">
            <div>额度:{{o.quota}}</div>
            <div style="margin-left:2px;flex:1;">月息:{{o.interest}}</div>
          </div>
          <div style="display:flex;font-size:0.3rem;" v-if="o.type2List && o.type2List.length">
            <div v-for="p in o.type2List" :key="p.id" :style="{borderColor:p.color, color:p.color}" style="border-radius:5px;border-width:0.5px;padding:2px 5px;margin-right: 5px;border-style:solid;">
              {{p.name}}
            </div>
          </div>
        </div>

        <div style="position:absolute;text-align:right;right:5px;font-size:0.4rem;">
          <div>
            <router-link style="margin-left:5px;color:#fe532d;border-radius:3px;" tag="div" :to="`product_loan_apply?id=${o.id}`">立即申请</router-link>
          </div>
        </div>

      </router-link>
    </div>


  </div>
</template>

<script>
import _ from 'lodash';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      idx: 0,
      referee: null,
      card_list: [],
      loan_list: [],
      user: {},
      loan_type_list: [],
      loan_type_id: null,
      loan_type2_ids: [],
      loan_type2_list: [],
    };
  },
  computed: {
    ...mapState({
      headImage: state => state.merchant.extendImage.default_head_image,
      merchant: state => state.merchant,
    }),

    loanList() {
      return _.map(this.loan_list, (o) => {
        const type_ids = _.map(o.type_ids.split(','), p => parseInt(p.substr(1, p.length - 2), 10));
        const type2List = _.intersectionWith(this.loan_type2_list, type_ids, ({ id }, p) => id === p);
        return {
          ...o,
          type2List,
        };
      });
    },
  },
  methods: {

    async setLoanType(id) {
      if (id === this.loan_type_id) return;

      this.loan_type_id = id;
      this.loan_type2_ids = [];
      const list = (await this.$http.get('/api/m/product_loan', {
        params: {
          is_enabled: 1,
          is_recommend: 1,
          order: 'sort',
          type_ids__like: `[${id}]`,
        },
      })).body;

      const type2List = (await this.$http.get('/api/product_loan_type', { params: { parent_id: id } })).body;
      this.loan_list = list;
      this.loan_type2_list = type2List;
    },

    async setLoanType2(id) {
      const loan_type2_ids = _.xor(this.loan_type2_ids, [id]);

      const list = (await this.$http.get('/api/m/product_loan', {
        params: {
          is_enabled: 1,
          is_recommend: 1,
          order: 'sort',
          ...(loan_type2_ids.length ? { type_ids__like: _.map(loan_type2_ids, o => `[${o}]`).join(',') } : {}),
        },
      })).body;
      this.loan_list = list;
      this.loan_type2_ids = loan_type2_ids;
    },
  },
  async mounted() {
    document.title = '我的店铺';
    const { referee } = this.$route.query;

    const user = (await this.$http.get('/api/user', { params: { id: referee } })).body[0];
    this.user = user;
    document.title = `${user.nickname}的店铺`;


    const [card_list] = (await this.$http.post('/api/v2/object', [
      JSON.stringify({
        object: 'product_card_with_merchant',
        method: 'filter',
        query: {
          merchant_id: this.merchant.id,
          is_enabled: 1,
          is_recommend: 1,
          order: 'sort',
          prop: 'property',
        },
      }),
    ])).body;

    this.card_list = _.map(card_list, o => ({
      ...o,
      property: _(o.property).mapKeys('property_code').mapValues('value').value(),
    }));


    this.loan_list = (await this.$http.get('/api/m/product_loan', { params: {
      is_enabled: 1,
      is_recommend: 1,
      order: 'sort',
    } })).body;

    const loan_type_list = (await this.$http.get('/api/product_loan_type', { params: { catagory_id: 2 } })).data;
    const type_id = (_.find(loan_type_list, o => o.name.indexOf('白户') !== -1) || { id: null }).id;

    this.loan_type_list = loan_type_list;
    this.setLoanType(type_id);
  },
};
</script>

<style scoped lang="less">
.tab-item {
  font-size: 0.43rem;
  color: #2B2C31;
  text-align:center;
}

.tab-item.active {
  color: #4959B8;
}
</style>
