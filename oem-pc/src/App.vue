<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  computed: {
    ...mapState({
      token: state => state.token,
    }),
  },
  async mounted() {
    if (this.token) {
      const info = (await this.$http.get('/api/token_info')).body;
      await this.$store.commit('setTokenInfo', info);
    }
  },
};
</script>

<style>
@import url(//at.alicdn.com/t/font_601006_2mh0clamp071fw29.css);
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

html, body {
  height: 100%;
  min-width: 640px;
}

.el-form-item--small .el-form-item__content {
  line-height: 33px;
}
.avatar-uploader {
  display: inline-block;
  width: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 96px;
  height: 96px;
  line-height: 96px;
  text-align: center;
}
.avatar {
  min-width: 96px;
  height: 96px;
  display: block;
}
.avatar-uploader input[type=file] {
  display: none !important;
}

.iconfont {
  font-size: 12px;
}
.el-button .iconfont + span {
  margin-left: 5px;
}

.el-input-number .el-input__inner {
  text-align: left;
}
</style>
