<template>
  <div class='bookinfo'>
    <div class="thumb">
    <img class='back' :src='info.image' mode='aspectFill' alt="图片">
    <img class='img' :src='info.image' mode='aspectFit' alt="图片">
    <div class="info">
      <div class="title text-primary">
        {{info.title}}
      </div>
      <div class="author text-primary">
        {{info.author}}
      </div>
    </div>
    </div>
    <!-- 分割线 -->
    <div class="detail">
      <img :src="userinfo.image" class='avatar' mode='aspectFit' alt="头像">
      {{userinfo.nickName}}
      <div class="right text-primary">
        {{info.rate}}分
        <Rate :value="info.rate" ></Rate>
      </div>
    </div>
    <div class="detail">
        {{info.publisher}}
      <div class="right">
        {{info.price}}
      </div>
    </div>
    <div class="tags" >
      <div class="badge" :key='tag' v-for="tag in info.tags">{{tag}}</div>
    </div>
    <div class="summary">
      <p :key='i' v-for="(sum,i) in info.summary">{{sum}}</p>
    </div>
  </div>
</template>

<script>
import Rate from '@/components/Rate'
export default {
  components: {
    Rate
  },
  props: ['info'],
  mounted () {
  },
  computed: {
    userinfo () {
      return this.info.user_info || {}
    }
  }
}
</script>

<style lang='scss' scoped>

.bookinfo {
  // 徽章的效果
  .badge {
    display: inline-block;
    margin: 5px;
    border-radius: 10px;
    border: 1px#EA5A49 solid;
    color: #EA5A49;
    padding: 5px;
  }
  .summary {
    padding: 0 15px;
    margin-top: 10px;
    p {
      text-indent: 2em;
      font-size: 14px;
    }
  }
  font-size: 14px;
  .right {
      float: right;
    }
    .detail {
      padding: 5px 10px;
      .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        vertical-align:  middle;
      }
    }
  .thumb {
    width: 750rpx;
    height: 500rpx;
    overflow: hidden;
    position: relative;
    .back {
      filter: blur(15rpx);
      width: 100%;
    }
    .img {
      position: absolute;
      width: 100%;
      height: 300rpx;
      left: 0;
      top: 30rpx;
    }
    .info {
      color: white;
      position: absolute;
      width: 100%;
      left: 0;
      top: 330rpx;
      text-align: center;
      .title {
        font-size: 20px;
      }
      .author {
        font-size: 14px;
      }
    }
  }
}

</style>
