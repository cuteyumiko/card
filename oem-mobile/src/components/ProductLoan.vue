<template>
  <div>

    <swiper ref="swiper" :options="swiperOption" v-if="noticeList.length">
      <swiper-slide v-for="o in noticeList" v-if="o.type_code === 'image-swiper'" :key="o.id">
        <img :src="o.icon">
      </swiper-slide>
    </swiper>

    <div style="margin:10px 0;">
      <div @click="onItemClick(o.id)" style="display:inline-block;width:25%;height:1.8rem;text-align:center;" v-for="o in typeList" :key="o.id">
        <img :src="o.icon" style="width:64px;height:64px;" />
        <div style="text-align:center;">{{o.name}}</div>
      </div>
    </div>

    <vux-x-input v-model="search.name__like" style="border-top:1px solid #eee;" placeholder="请输入关键字">
      <i slot="label" class="iconfont icon-search" style="margin-right:10px;" />
    </vux-x-input>

    <div>
      <div style="display:flex;align-items:center;border-top:1px solid #eee;padding: 5px;" v-for="o in list" :key="o.id">
        <div>
          <img :src="o.icon" style="width:48px;height:48px;" />
        </div>
        <div style="flex:1;margin-left:5px;">
          <div style="display:flex;align-items:center;">
            <div style="width:2rem;">{{o.name}}</div>
            <div style="flex:1;font-size:0.3rem;" v-if="o.is_recommend">推广佣金最高 <span style="color:red;">{{o.max_level_money}} {{o.money_unit}}</span> <span v-if="o.tip_text" style="background:red;color:white;padding:1px 5px;border-radius:5px;">{{o.tip_text}}</span></div>
          </div>
          <div style="display:flex;align-items:center;font-size:0.3rem;margin-top:1px;">
            <div>额度:{{o.quota}}</div>
            <div style="margin-left:2px;flex:1;">月息:{{o.interest}}</div>
            <div style="display:flex;align-items:center;color:#fff;font-size:0.4rem;">
              <router-link v-if="o.is_recommend" style="color:#fe532d;display:inline-block;border-radius:3px;" tag="div" :to="`product_loan_qr?id=${o.id}`">推荐贷款</router-link>
              <router-link style="margin-left:5px;color:#3886cf;display:inline-block;border-radius:3px;" tag="div" :to="`product_loan_apply?id=${o.id}`">立即申请</router-link>
            </div>
          </div>
          <div style="display:flex;font-size:0.3rem;">
            <div style="flex:1;">{{o.description}}</div>
            <div>{{o.got_count}}人已申请</div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment';
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
      list: [],
      typeList: [],
    };
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
        const { current, size, ...params } = this.search;
        if (!params.type_ids__like) params.type_code__like = '[default]';
        const { body } = (await this.$http.get('/api/m/product_loan?order=sort', { params }));
        this.list = _.map(body, o => ({ ...o, create_time: moment.unix(o.create_time).format('YYYY-MM-DD HH:mm:ss') }));
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }

      this.loading = false;
    }, 200, { leading: false }),
    onItemClick(type_ids__like) {
      this.search = {
        ...this.search,
        type_ids__like: `[${type_ids__like}]`,
      };
    },
  },
  async mounted() {
    document.title = '申请贷款';
    this.noticeList = (await this.$http.get('/api/m/merchant_notice')).body;
    const typeList = (await this.$http.get('/api/product_loan_type', { params: { catagory_id: 1 } })).body;
    this.typeList = _.filter(typeList, o => ['home', 'default'].indexOf(o.code) === -1);
    this.reload();
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
