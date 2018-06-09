<template>
  <div class='rate'>
    <span>☆☆☆☆☆</span>
    <div class='hollow' :style="style">
      ★★★★★
    </div>
  </div>
</template>

<script>
// vue-tiny-rate
export default {
  props: {
    value: { type: [Number, String], default: '0' }
  },
  computed: {
    style () {
      console.log(`width:${this.value * 10}%`)
      return `width:${this.value * 10}%`
    }
  }
}
</script>
<style lang='scss' scoped>
.rate {
  position: relative;
  display: inline-block;
  .hollow {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    right: 0;
    width: 0;
    overflow: hidden;
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
  }
}
</style>


