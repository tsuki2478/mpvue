<template>
<div>
  <TopSwiper :tops='tops'></TopSwiper>
  <Card v-for="books in books" :key="books.id" :book='books'></Card>
  <p class="text-footer" v-if="!more">
    没有更多数据
  </p>
</div>
</template>

<script>
import {get} from '@/util'
import Card from '@/components/Card'
import TopSwiper from '@/components/TopSwiper'
export default {
  components: {
    Card,
    TopSwiper
  },
  data () {
    return {
      books: [],
      page: 0,
      more: true,
      tops: []
    }
  },
  methods: {
    async getList (init) {
      if (init) {
        this.page = 0
        this.more = true
      }
      wx.showNavigationBarLoading()
      const books = await get('/weapp/bookList', {page: this.page})
      console.log('数据加载', books)
      if (books.list.length < 10 && this.page > 0) {
        this.more = false
      }
      if (init) {
        this.books = books.list
        wx.stopPullDownRefresh()
      } else {
        // 下拉刷新， 不能直接覆盖books,而是累加
        this.books = this.books.concat(books.list)
      }
      wx.hideNavigationBarLoading()
    },
    async getTop () {
      const tops = await get('/weapp/top')
      this.tops = tops.list
    }
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getList(true)
    this.getTop()
  },
  // 进入页面加载
  mounted () {
    this.getList(true)
    this.getTop()
  },
  // 上啦加载
  onReachBottom () {
    if (!this.more) {
      return
    }
    this.page = this.page + 1
    this.getList()
  }
}
</script>

<style lang='scss'>


</style>
