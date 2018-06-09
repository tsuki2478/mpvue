<template>
  <div>
    <BookInfo :info='info'></BookInfo>
    <CommentList :comments="comments"></CommentList>
     <div class="comment" v-if="showAdd">
       <textarea v-model="comment"
       class="textarea"
       :maxlength="100"
       placeholder="请输入图书短评"
       ></textarea>
     <div class='location'>
       地理位置:
    <switch color="#ea5a49" :checked='location'  @change="getGeo"/>
    <span class="text-primary">{{location}}</span>
     </div>
      <div class="phone">
        手机型号:
      <switch color="#ea5a49" :checked='phone'  @change="getPhone"/>
      <span class="text-primary">{{phone}}</span>
      </div>
      <button class="btn" @click="addComment">
        评论
      </button>
     </div>
     <div v-else class='text-footer'>
       未登录或者已经登陆过了
     </div>
     <button class="btn" open-type='share'>
       转发给好友
     </button>
  </div>
</template>

<script>
import {get, post} from '@/util'
import BookInfo from '@/components/BookInfo'
import { showModal } from '../../util'
import CommentList from '@/components/CommentList'
export default {
  components: {
    BookInfo,
    CommentList
  },
  data () {
    return {
      userinfo: {},
      location: '',
      phone: '',
      bookid: '',
      info: {},
      comment: '',
      comments: []
    }
  },
  computed: {
    // 评论限制
    showAdd () {
      // 没登录
      if (!this.userinfo.openId) {
        return false
      }
      // 评论页面查到有自己的openid
      if (this.comments.filter(v => v.openid === this.userinfo.openId).length) {
        return false
      }
      return true
    }
  },
  methods: {
    async addComment () {
      // 添加评论功能
      if (!this.comment) {
        return
      }
      const data = {
        comment: this.comment,
        phone: this.phone,
        location: this.location,
        bookid: this.bookid,
        openid: this.userinfo.openId
      }
      try {
        await post('/weapp/addcomment', data)
        this.comment = ''
        this.getComments()
      } catch (error) {
        showModal('失败', error.msg)
      }
      console.log('data:', data)
      // 评论内容, 手机型号 地理位置  图书id 用户的openid
    },
    async getDetail () {
      const info = await get('/weapp/bookdetail', {id: this.bookid})
      wx.setNavigationBarTitle({
        title: info.title
      })
      this.info = info
      console.log('info', this.info)
    },
    async getComments () {
      const comments = await get('/weapp/commentlist', {bookid: this.bookid})
      this.comments = comments.list || []
      console.log('comments:', this.comments)
    },
    getGeo (e) {
      // 获取地理位置
      // T4tKDfGOmamfKMvHFX3QGAq9sMRFqUQU
      const ak = 'T4tKDfGOmamfKMvHFX3QGAq9sMRFqUQU'
      let url = 'http://api.map.baidu.com/geocoder/v2/'
      if (e.target.value) {
        wx.getLocation({
          success: re => {
            wx.request({
              url,
              data: {
                ak,
                output: 'json',
                location: `${re.latitude},${re.longitude}`
              }, // 请求的参数",
              success: res => {
                console.log(res)
                if (res.data.status === 0) {
                  this.location = res.data.result.addressComponent.city
                } else {
                  this.location = '未知地点'
                }
              }
            })
            console.log(re)
          }
        })
      } else {
        this.location = ''
      }
    },
    getPhone (e) {
      // 获取手机号码
      if (e.target.value) {
        const phoneInof = wx.getSystemInfoSync()
        this.phone = phoneInof.model
        console.log(phoneInof)
      }
    }
  },
  mounted () {
    // 获取传过来的值, this.$root.$mp.query.id
    this.bookid = this.$root.$mp.query.id
    this.getDetail()
    this.getComments()
    const userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.info.title,
      desc: '价格: ' + this.info.price,
      path: '/pages/detail/main?id=' + this.bookid
    }
  }
}
</script>


<style lang='scss' scoped>
.comment {
  .textarea {
    margin-top: 10px;
    width: 730rpx;
    height: 220rpx;
    background: #eee;
    padding: 10rpx;
  }
  .location {
    margin-top: 10px;
    padding: 5px 10px;
  }
  .phone {
    margin-top: 10px;
    padding: 5px 10px;
  }
}
</style>
