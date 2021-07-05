import requestData from "../../utils/request"
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList: [],
    artists: [],
    index: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    this.getRecommendList();

    // 订阅歌曲切换消息
    PubSub.subscribe('switchType', (methodName, type) => {
      let { recommendList, index } = this.data;
      if (type === 'pre') {
        (index === 0) && (index = recommendList.length)
        index -= 1
      } else {
        (index === recommendList.length - 1) && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let transferData = recommendList[index];
      PubSub.publish('transfer', (methodName, transferData))
    })
  },

  // 获取每日推荐歌单
  async getRecommendList() {
    let recommendListData = await requestData("/recommend/songs"),
      recommendList = recommendListData.data.dailySongs.slice(0, 30)
    this.setData({
      recommendList
    })

    // 提取歌手信息
    let artistsList = [], artists = []
    this.data.recommendList.forEach(item => {
      let artistsItem = Object.values(item.ar);
      artistsList.push(artistsItem)
    })

    for (let n of artistsList) {
      let artsContainer = []
      for (let y of n) {
        artsContainer.push(y.name)
      }
      let arts5 = artsContainer.join('/');
      artists.push(arts5)
    }
    this.setData({
      artists
    })
  },

  // 路由传参至songDetail页面
  toSongDetail(event) {
    let { song, index } = event.currentTarget.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail',
      success(res) {
        res.eventChannel.emit('songg', {
          data: song
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    PubSub.unsubscribe('switchType')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})