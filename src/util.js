// 工具函数库
import config from './config'

// http get获取数据
export function get (url, data) {
  return request(url, 'GET', data)
}
// post
export function post (url, data) {
  return request(url, 'POST', data)
}

function request (url, method, data, header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      header,
      url: config.host + url,
      success: function (res) {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          console.log(res)
          showModal('失败', res.data.data.msg)
          reject(res.data)
        }
      }
    })
  })
}

export function showSuccess (text) {
  wx.showToast({
    title: text,
    icon: 'success'
    // duration: 2000
  })
}
export function showError (text) {
  wx.showToast({
    title: text,
    icon: 'none'
    // duration: 2000
  })
}
export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}
