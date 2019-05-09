<template>
  <div>

    <swiper ref="swiper" :options="swiperOption" v-if="noticeList.length">
      <swiper-slide v-for="o in noticeList" v-if="o.type_code === 'image-swiper'" :key="o.id">
        <img :src="o.icon">
      </swiper-slide>
    </swiper>

    <div style="border-bottom:1px solid #ddd;padding-bottom:5px;margin:10px;display:flex;align-items:center;">
      <div style="border-left: 8px solid #ddd;padding-left:4px;">
        优质产品
      </div>
      <vux-x-input v-model="name__like" style="border-top:1px solid #eee;" placeholder="请输入关键字">
        <i slot="label" class="iconfont icon-search" style="margin-right:10px;" />
      </vux-x-input>
    </div>
    <div style="display:flex;overflow-x:scroll;padding:10px;">
      <div @click="setType(o.id)" v-for="o in typeList" :key="o.id" style="padding:0 12px">
        <img :src="o.icon" style="width:48px;height:48px;" />
        <div style="text-align:center;font-size:0.3rem;">{{o.name}}</div>
      </div>
    </div>
    <div style="display:flex;">
      <div @click="setType2(o.id)" v-for="o in type2List" :key="o.id" style="padding:0 12px">
        <div style="text-align:center;font-size:0.3rem;padding:5px;" :style="{color: type2_ids.indexOf(o.id) !== -1 ? '#FEC51D' : '#818181',}">{{o.name}}</div>
      </div>
    </div>
    <div>
      <div style="position:relative;display:flex;align-items:center;border-top:1px solid #eee;padding: 5px;" v-for="o in list" :key="o.id">
        <div>
          <img :src="o.icon" style="width:48px;height:48px;" />
        </div>
        <div style="flex:1;margin-left:5px;">
          <div style="display:flex;align-items:center;">
            <div>{{o.name}} <span v-if="o.tip_text" style="background:#fde0d8;color:#ED471C;padding:1px 5px;border-radius:5px;">{{o.tip_text}}</span></div>
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
            <div style="font-size:0.3rem;text-align:right;" v-if="o.is_recommend">佣金 <span style="color:red;">{{o.max_level_money}} {{o.money_unit}}</span></div>
            <router-link v-if="o.is_recommend" style="color:#fe532d;border-radius:3px;" tag="div" :to="`product_loan_qr?id=${o.id}`">推荐贷款</router-link>
            <router-link style="margin-left:5px;color:#3886cf;border-radius:3px;" tag="div" :to="`product_loan_apply?id=${o.id}`">立即申请</router-link>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      swiperOption: {
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        loop: true,
      },
      noticeList: [],

      loading: false,
      search: { is_enabled: 1 },
      a_list: [],
      typeList: [],
      type2List: [],
      type_id: null,
      type2_ids: [],

      name__like: '',
    };
  },
  computed: {
    list() {
      return _.map(this.a_list, (o) => {
        const type_ids = _.map(o.type_ids.split(','), p => parseInt(p.substr(1, p.length - 2), 10));
        const type2List = _.intersectionWith(this.type2List, type_ids, ({ id }, p) => id === p);
        return {
          ...o,
          type2List,
        };
      });
    },
  },
  watch: {
    search: {
      async handler() {
        await this.reload();
      },
      deep: true,
    },


    // async type_id(type_id) {
    //   const type2List = type_id ? (await this.$http.get('/api/product_loan_type', { params: { parent_id: type_id }})).data : [];
    //   const type2_ids = [];
    //   this.type2List = type2List;
    //   this.type2_ids = type2_ids;
    // },
  },
  methods: {

    async setType(id) {
      if (id === this.type_id) return;

      this.type_id = id;
      this.type2_ids = [];
      const list = (await this.$http.get('/api/m/product_loan', {
        params: {
          is_enabled: 1,
          is_recommend: 1,
          order: 'sort',
          type_ids__like: `[${id}]`,
        },
      })).body;

      const type2List = (await this.$http.get('/api/product_loan_type', { params: { parent_id: id } })).body;
      this.a_list = list;
      this.type2List = type2List;
    },

    async setType2(id) {
      const type2_ids = _.xor(this.type2_ids, [id]);

      const list = (await this.$http.get('/api/m/product_loan', {
        params: {
          is_enabled: 1,
          is_recommend: 1,
          order: 'sort',
          ...(type2_ids.length ? { type_ids__like: _.map(type2_ids, o => `[${o}]`).join(',') } : {}),
        },
      })).body;
      this.a_list = list;
      this.type2_ids = type2_ids;
    },
  },
  async mounted() {
    document.title = '申请贷款';
    this.noticeList = (await this.$http.get('/api/m/merchant_notice')).body;

    const typeList = (await this.$http.get('/api/product_loan_type', { params: { catagory_id: 2 } })).data;
    this.typeList = typeList;
    const type_id = (_.find(typeList, o => o.name.indexOf('白户') !== -1) || { id: null }).id;

    this.setType(type_id);
  },
};
</script>

<style scoped lang="less">
.swiper-slide {
  img {
    width: 100%;
  }
}

.weui-grid {
  text-decoration: none;
  text-align:center;
  color: #000;
  padding: 10px 5px;
  i {
    font-size: 30px;
  }

  > div {
    margin-top:5px;
  }
}

.weui-cell:before {
  border-top: 0;
}
</style>
