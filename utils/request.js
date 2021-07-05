let defaultUrl = 'http://localhost:3000';

export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: defaultUrl + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC') !== -1) : ''
      },
      success: (res) => {
        if (data.isLogin) {
          wx.setStorage({ key: 'cookies', data: res.cookies })
        }
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

