<template>
<div class='main'>
 <div class='container'>
   <div class='userinfo'>
     <img :src='userInfo.avatarUrl' alt='头像'>
     <button v-show='!logged' class='login' open-type='getUserInfo' @getuserinfo='bindGetUserInfo' >{{userInfo.nickName}}</button>
     <p  v-show='logged'>{{userInfo.nickName}}</p>
   </div>
 </div>
 <YearProgress></YearProgress>
 <button v-show='userInfo.openId' class='btn' @click='sacnBook'>添加图书</button>
</div>
</template>

<script>
import { showSuccess, showError, post, showModal } from '../../util'
import qcloud from 'wafer2-client-sdk'
import config from '../../config'
import YearProgress from '@/components/YearProgress'
export default {
  components: {
    YearProgress
  },
  data () {
    return {
      userInfo: {
        avatarUrl: '../../../static/img/unlogin.png',
        nickName: '点击登录'
      },
      logged: false
    }
  },
  onShow () {
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.logged = true
      this.userInfo = userinfo
      console.log(this.userInfo)
      console.log(this.logged)
    }
  },
  methods: {
    async addBook (isbn) {
      console.log(isbn)
      console.log(this.userInfo.openId)
      const res = await post('/weapp/addbook', {
        isbn,
        openid: this.userInfo.openId
      })
      showModal('添加成功', `${res.title} 添加成功`)
      console.log(res)
    },
    sacnBook () {
      // onlyFromCamera: true,  可以禁止从相册选中!
      wx.scanCode({
        success: res => {
          console.log(res)
          if (res.result) {
            this.addBook(res.result)
          }
        }
      })
    },
    bindGetUserInfo: function (options) {
      var that = this
      let user = wx.getStorageSync('userinfo')
      if (!user) {
        qcloud.setLoginUrl(config.loginUrl)
        wx.login({
          success: function (loginResult) {
            var loginParams = {
              code: loginResult.code,
              encryptedData: options.mp.detail.encryptedData,
              iv: options.mp.detail.iv
            }
            console.log('options', options)
            qcloud.requestLogin({
              loginParams,
              success () {
                showSuccess('授权成功')
                qcloud.request({
                  url: config.userUrl,
                  login: true,
                  success (userRe) {
                    console.log(userRe)
                    that.userInfo = userRe.data.data
                    that.logged = true
                    wx.setStorageSync('userinfo', userRe.data.data) // 储存进storage
                  }
                })
              },
              fail (error) {
                showError('拒绝授权')
                console.log('拒绝', error)
              }
            })
          },
          fail: function (loginError) {
            showError('授权失败')
            console.log('授权失败', loginError)
          }
        })
      } else {
        let userinfo = wx.getStorageSync('userinfo')
        if (userinfo) {
          this.logged = true
          this.userInfo = userinfo
          showError('已经授权成功')
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.main {
  padding: 50rpx;
}
.login {
  background: #ea5a49;
  border-radius: 10px;
  line-height: 70rpx;
  height: 70rpx;
  width: 30%;
  margin-bottom: 30rpx;
}
.container {
  margin-bottom: 40rpx;
}
.userinfo {
  text-align: center;
  img {
    width: 150rpx;
    height: 150rpx;
    margin: 20rpx;
    border-radius: 50%;
  }
  p {
    margin-bottom: 30rpx;
  }
}
</style>
