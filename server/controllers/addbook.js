const https = require('https')
const {mysql} = require('../qcloud')
// 新增图书
//  1 获取豆瓣信息
// https://api.douban.com/v2/book/isbn/:isbn
//  2 入库

module.exports = async (ctx) => {
    const {isbn,openid} = ctx.request.body
    console.log('添加图书',isbn,openid)
    if (isbn && openid) {
      const findRes = await mysql('books').select().where('isbn',isbn)
      if(findRes.length) {
        ctx.state = {
          code: -1,
          data: {
            msg: '图书已存在'
          }
        }
        return
      }

      let url = 'https://api.douban.com/v2/book/isbn/' + isbn
      const bookinfo = await getJSON(url)
      const rate =bookinfo.rating.average
      const {title, image, alt ,publisher, summary, price} = bookinfo
      // console.log(bookinfo)
      const tags = bookinfo.tags.map( res=> {
        return `${res.title} ${res.count}`
      }).join(',')
      const author = bookinfo.author.join(',')

    try {
      await mysql('books').insert({
        isbn,openid,rate,title, image, alt ,publisher, summary, price,tags,author
      })
      ctx.state.data = {
        title,
        msg: 'success'
      }
    } catch (error) {
      ctx.state = {
        code: -1,
        data: {
          msg: '新增失败' + error.sqlMessage
        }
      }
    }
      // tag: 科幻 1000， 小说500
      console.log({rate,title, image, alt ,publisher, summary, price,tags,author})
    }
}

function getJSON(url){
  return new Promise((reslove,reject)=>{
    https.get(url,res=>{
      let urlData = ''
      res.on('data', data=>{
        urlData += data
      })
      res.on('end', data=>{
        const bookinfo = JSON.parse(urlData)
        if(bookinfo.title){
          reslove(bookinfo)
        }
        reject(bookinfo)
      })
    })
  })
}
