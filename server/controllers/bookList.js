// 图书列表
const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  // orderBy = desc； 意思是倒序
  const {page , openid} =ctx.request.query // 获取请求传值
  const size =10

  const mysqlBooks =  mysql('books')
      .select('books.*','cSessionInfo.user_info')
      .join('cSessionInfo','books.openid','cSessionInfo.open_id')

      .orderBy('books.id','desc')

      let books
      if (openid) {
        // 根据openid筛选
        books = await  mysqlBooks.where('books.openid', openid)
      } else {
        // 全部图书 分页
        books = await  mysqlBooks.limit(size)
                              .offset(Number(page)* size)
      }
  ctx.state.data = {
    list: books.map(v=>{
      const info =JSON.parse(v.user_info)
      return Object.assign({}, v, {
        user_info: {
          nickName: info.nickName
        }
      })
    })
  }
}
