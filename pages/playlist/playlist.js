import requestData from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotGrouplist: [],
    tag: '',
    hotlist: [],
    scrollHeight: 0,
    lowerNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotGrouplist()

    // 计算屏幕高度，才能触发bindscrolltolower
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight
    })
  },

  // 获取热门歌单分类标签的回调
  async getHotGrouplist() {
    let hotlistGroupData = await requestData('/playlist/hot')
    this.setData({
      hotGrouplist: hotlistGroupData.tags,
      tag: hotlistGroupData.tags[0].name
    })
    this.getHotlist(this.data.tag)
  },

  // 根据标签获取歌单列表
  async getHotlist(tag) {
    let hotlistData = await requestData('/top/playlist', { cat: tag, limit: 30 })
    this.setData({
      hotlist: hotlistData.playlists
    })
    wx.hideLoading()
  },

  // 点击标签触发的回调
  navChange(event) {
    let tag = event.currentTarget.dataset.name;
    this.setData({
      tag,
      hotlist: [],
      lowerNum: 0
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getHotlist(this.data.tag)
  },

  // 下滑至底部触发的回调
  listScrollLower() {
    let page = this.data.lowerNum + 50;
    this.getLowerList(this.data.tag, page)
    this.setData({
      lowerNum: page
    })
  },

  // 增加歌单列表长度的回调
  async getLowerList(tag, offsetNum) {
    let hotlistLowerData = await requestData('/top/playlist', { cat: tag, limit: 30, offset: offsetNum }),
      { hotlist } = this.data,
      hotlistData = hotlistLowerData.playlists
    hotlist.push(...hotlistData);
    this.setData({
      hotlist
    })
  },

  // 点击歌单触发跳转的回调
  toplaylistDetail(event) {
    let { song } = event.currentTarget.dataset,
      songData = {
        name: song.name,
        url: song.coverImgUrl,
        dpt: song.description,
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