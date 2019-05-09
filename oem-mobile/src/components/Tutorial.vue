<template>
  <div >
    <div style="padding: 0.2rem 0.2rem;">

      <template v-if="videoList.length">
        <div style="border-left:0.2rem solid #81a5d6;font-size:0.5rem;color:#fff;margin:0.2rem 0;">
          <div style="margin-left:0.2rem;padding:0.1rem 0.2rem;background:#81a5d6;display:inline-block;">新手必看</div>
        </div>

        <div v-for="o in videoList" :key="o.id">
          <video :src="o.video" controls="controls" style="width:100%;">您的浏览器不支持 video 标签。</video>
        </div>
      </template>


      <div style="border-left:0.2rem solid #81a5d6;font-size:0.5rem;color:#fff;margin:0.2rem 0;">
        <div style="margin-left:0.2rem;padding:0.1rem 0.2rem;background:#81a5d6;display:inline-block;">图文教程</div>
      </div>

      <vux-grid :cols="2" class="image-tutorial">
        <vux-grid-item tag :link="`/tutorial/${o.id}`"  v-for="o in imageList" :key="o.id">
          <div :style="{backgroundImage:`url('${o.icon}')`}" style="position:relative;background-size:cover;height:2.2rem;" >
            <div style="background:#8888;color:#fff;position:absolute;bottom:0;right:0;left:0;padding:0.1rem 0.2rem;font-size:0.4rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{o.name}}</div>
          </div>
        </vux-grid-item>
      </vux-grid>


      <div style="border-left:0.2rem solid #81a5d6;font-size:0.5rem;color:#fff;margin:0.2rem 0;">
        <div style="margin-left:0.2rem;padding:0.1rem 0.2rem;background:#81a5d6;display:inline-block;">常见问题</div>
      </div>

      <div style="font-size:0.4rem;line-height:0.6rem;border-bottom:1px solid #eee;" v-for="o in textList" :key="o.id">
        <div style="display:flex;background:#eee;align-items:center;">
          <div style="flex:1;padding:0.2rem 0.4rem;">{{o.name}}</div>
        </div>
        <div style="padding:0.2rem 0.4rem;">
          <div v-html="o.content"></div>
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
      list: [],
    };
  },
  computed: {
    textList() {
      return _.filter(this.list, { type_code: 'text' });
    },
    imageList() {
      const list = _.filter(this.list, { type_code: 'image' });
      return list;
    },
    videoList() {
      let list = _.filter(this.list, { type_code: 'video' });
      list = _.map(list, o => ({
        ...o,
        video: JSON.parse(o.attachment_list)[0],
      }));
      return list;
    },
  },
  async mounted() {
    document.title = '推广培训';
    this.list = (await this.$http.get('/api/m/merchant_article')).body;
  },
};
</script>

<style scoped>
.image-tutorial >>> .weui-grid {
  padding: 0;
}
</style>
