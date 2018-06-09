// 配置项

// const host = 'http://localhost:5757'  // 本地环境
const host = 'https://lzsabkcd.qcloud.la' // 开发环境

const config = {
  host,
  loginUrl: `${host}/weapp/login`,
  userUrl: `${host}/weapp/user`
}
export default config
