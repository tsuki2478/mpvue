import Vue from 'vue'
import Book from './index'

const app = new Vue(Book)
app.$mount()

export default{
  config: {
    // 开启下拉刷新
    enablePullDownRefresh: true
  }
}
