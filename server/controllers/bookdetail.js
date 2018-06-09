// 访问+1
const {mysql} = require('../qcloud')

module.exports =  async (ctx) => {
  // 获取请求传过来的值
  const {id} = ctx.request.query
  const detail = await mysql('books')
                          .select('books.*','cSessionInfo.user_info')
                          .join('cSessionInfo','books.openid','cSessionInfo.open_id')
                          .where('id',id)
                          .first()
  const info = JSON.parse(detail.user_info)
  ctx.state.data = Object.assign({}, detail ,{
    tags: detail.tags.split(','),
    summary: detail.summary.split('\n'),
    user_info: {
      nickName : info.nickName,
      image: info.avatarUrl
    }
  })

  await mysql('books')
        .where('id',id)
        // 累加 1
        .increment('count',1)
}
