<template>
  <div>

    <div style="border-bottom:1px solid #ddd;padding-bottom:5px;margin:10px;">
      <div style="border-left: 8px solid #ddd;padding-left:4px;">
        热门推荐
      </div>
    </div>

    <swiper ref="swiper" :options="swiperOption" v-if="remenList.length">
      <swiper-slide v-for="o in remenList" :key="o.id">
        <router-link :to="`product_card_apply?id=${o.id}`" tag="div">
          <img :src="o.property.card_hot || o.icon">
        </router-link>
      </swiper-slide>
    </swiper>

    <div style="border-bottom:1px solid #ddd;padding-bottom:5px;margin:10px;">
      <div style="border-left: 8px solid #ddd;padding-left:4px;">
        今日推荐
      </div>
    </div>
    <div>
      <router-link :to="`product_card_apply?id=${o.id}`" tag="div" style="display:inline-block;width:33%;text-align:center;" v-for="o in jinriList" :key="o.id">
        <div style="padding:5px;">
          <div>
            <img :src="o.property.card_image || o.icon" style="height:40px;" />
          </div>
          <div style="flex:1;display:flex;flex-direction:column;font-size:0.35rem;margin-left:5px;">
            <div>{{o.property.card_name || o.name}}</div>
            <div style="margin-top:2px;font-size:0.3rem;color:#888;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">{{o.property.card_desc || o.description}}</div>
          </div>
        </div>
      </router-link>
    </div>

    <div style="border-bottom:1px solid #ddd;padding-bottom:5px;margin:10px;">
      <div style="border-left: 8px solid #ddd;padding-left:4px;">
        热门银行
      </div>
    </div>

    <div style="margin-top:10px;">
      <div style="display:flex;align-items:center;border-bottom:1px solid #eee;padding: 5px;" v-for="o in hotList_is_recommend" :key="o.id">
        <div>
          <img :src="o.icon" style="width:48px;height:48px;" />
        </div>
        <div style="flex:1; margin-left:5px;">
          <div>{{o.name}} <span v-if="o.tip_text" style="background:red;color:white;padding:1px 5px;border-radius:5px;">{{o.tip_text}}</span></div>
          <div style="display:flex;font-size:0.3rem;margin-top:1px;color:#888;">
            <div style="width:2rem;">{{o.description.split('\n')[0]}}</div>
            <div style="flex:1;margin-left:5px;">{{o.description.split('\n')[1]}}</div>
          </div>
          <div style="font-size:0.3rem;color:#888;">
            {{o.got_count}}人已申请
          </div>
        </div>
        <div style="display:flex;align-items:center;font-size:0.4rem;">
          <div>
            <div v-if="o.is_recommend" style="margin-left:5px;text-align:right;">佣金最高 <span style="color:red;">{{o.max_level_money}}元</span></div>
            <router-link v-if="o.is_recommend" style="color:red;padding:5px;display:inline-block;border-radius:3px;" tag="div" :to="`product_card_qr?id=${o.id}`">推荐办卡</router-link>
            <router-link style="padding:5px;display:inline-block;border-radius:3px;" tag="div" :to="`product_card_apply?id=${o.id}`">立即申请</router-link>
          </div>
        </div>
      </div>
    </div>

    <div>
      <router-link tag="div" :to="`product_card_apply?id=${o.id}`" style="display:inline-block;border-bottom:1px solid #eee;width:50%;" v-for="o in hotList_not_recommend" :key="o.id">
        <div style="display:flex;align-items:center;padding:5px;">
          <div>
            <img :src="o.icon" style="width:48px;height:48px;" />
          </div>
          <div style="flex:1; margin-left:2px;">
            <div>{{o.name}}</div>
            <div style="font-size:0.3rem;margin-top:1px;color:#888;">
              <div>{{o.description}}</div>
              <div>{{o.got_count}}人已申请</div>
            </div>
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

      recommendList: [],
      hotList: [],

      remenList: [],
      jinriList: [],
      hotList_is_recommend: [],
      hotList_not_recommend: [],
    };
  },
  computed: {
    ...mapState({
      merchant: state => state.merchant,
    }),
  },

  async mounted() {
    document.title = '办信用卡';


    const remenList = _((await this.$http.get('/api/v2/product_card_with_merchant', { params: {
      is_enabled: 1,
      type_code__like: '[app_remen]',
      order: 'sort',
      merchant_id: this.merchant.id,
      prop: 'property',
    } })).body).map(o => ({
      ...o,
      property: _(o.property).mapKeys('property_code').mapValues('value').value(),
    })).value();

    const jinriList = _((await this.$http.get('/api/v2/product_card_with_merchant', { params: {
      is_enabled: 1,
      type_code__like: '[app_jinri]',
      order: 'sort',
      merchant_id: this.merchant.id,
      prop: 'property',
      limit: 3,
    } })).body).map(o => ({
      ...o,
      property: _(o.property).mapKeys('property_code').mapValues('value').value(),
    })).value();

    const hotList = (await this.$http.get('/api/m/product_card', { params: {
      is_enabled: 1,
      type_code__like: '[hot]',
      order: 'sort',
    } })).body;

    const hotList_is_recommend = _.filter(hotList, o => o.is_recommend);
    const hotList_not_recommend = _.filter(hotList, o => !o.is_recommend);

    this.remenList = remenList;
    this.jinriList = jinriList;
    this.hotList_is_recommend = hotList_is_recommend;
    this.hotList_not_recommend = hotList_not_recommend;
  },
};
</script>

<style scoped lang="less">
.swiper-slide {
  img {
    width: 100%;
  }
}
</style>
