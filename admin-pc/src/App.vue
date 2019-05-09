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
      try {
        const info = (await this.$http.get('/api/token_info')).body;
        this.$store.commit('setTokenInfo', info);
      } catch (e) {
        await this.$store.commit('clearToken');
        this.$router.push('/login');
      }
    }
  },
};
</script>

<style>
@import url(//at.alicdn.com/t/font_601006_c7ds0ue8bvabrzfr.css);
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

.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;

  span {
    color: #ee2a7b;
  }
}

.ql-editor {
  max-height: 500px;
}

.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
}

.el-input--small .el-input__inner {
  height: 31px;
}

.el-input-number .el-input__inner {
  text-align: left;
}
</style>
