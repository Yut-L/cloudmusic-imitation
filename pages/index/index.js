import requestData from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    newestList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图数据
    let bannerListData = await requestData("/banner", { type: 2 })

    // 获取推荐歌单数据
    let recommendListData = await requestData("/personalized", { limit: 12 })

    // 获取推荐新蝶数据
    let newestListData = await requestData("/album/newest")

    this.setData({
      bannerList: bannerListData.banners,
      recommendList: recommendListData.result,
      newestList: newestListData.albums
    })
  },

  // 跳转至每日推荐页面
  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },

  // 跳转至歌单页面
  toPlaylist() {
    wx.navigateTo({
      url: '/pages/playlist/playlist',
    })
  },

  // 跳转至排行榜页面
  toToplistDeatail() {
    wx.navigateTo({
      url: '/pages/toplist/toplist',
    })
  },

  // 跳转至MV页面
  toMv() {
    wx.navigateTo({
      url: '/pages/mv/mv',
    })
  },

  // 点击推荐歌单触发跳转的回调
  toplaylistDetail(event) {
    let { song } = event.currentTarget.dataset,
      songData = {
        name: song.name,
        url: song.picUrl,
        dpt: song.copywriter,
        id: song.id
      };
    wx.navigateTo({
      url: '/pages/playlistDetail/playlistDetail',
      success(res) {
        // 利用eventChannel 传输参数  约定方法名
        res.eventChannel.emit('songg', {
          data: songData
        })
      }
    })
  },

  // 点击推荐新碟触发跳转的回调
  toplaylistDetail2(event) {
    let { song } = event.currentTarget.dataset,
      songData = {
        name: song.name,
        url: song.picUrl,
        dpt: '作者:' + song.artist.name,
        id: song.id,
        type: 1
      };
    wx.navigateTo({
      url: '/pages/playlistDetail/playlistDetail',
      success(res) {
        // 利用eventChannel 传输参数  约定方法名
        res.eventChannel.emit('songg', {
          data: songData
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