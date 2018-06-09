import Vue from 'vue'
import App from './index.vue'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    // 开启下拉刷新
    navigationBarTitleText: '评论列表',
    enablePullDownRefresh: true
  }
}
