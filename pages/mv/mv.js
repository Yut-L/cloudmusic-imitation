import requestData from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navlist: ['内地', '港台', '欧美', '日本', '韩国'],
    navId: 0,
    mvlist: [],
    scrollHeight: 0,
    mId: 0,
    lowerNum: 0,
    listMid: '',
    url: '',  //mv播放地址,
    startTime: 0,  //记录mv开始播放时间
    mvUpdateTime: [],  //记录播放过的mv的id和时间
    isRefresh: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMvData(this.data.navlist[0])

    // 计算屏幕高度，才能触发bindscrolltolower
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight
    })
  },

  async getMvData(name) {
    let mvlist = await requestData('/mv/all', { area: name, limit: 15 })
    this.setData({
      mvlist: mvlist.data
    })
    wx.hideLoading()
  },

  // 下拉更新mv列表数据的回调
  mvRefresh() {
    this.getMvData(this.data.navlist[this.data.navId])
    this.setData({
      isRefresh: false
    })
  },

  // 点击标签触发的回调
  navChange(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId,
      lowerNum: 0
    })
    this.getMvData(event.currentTarget.dataset.name)
    wx.showLoading({
      title: '正在加载',
    })
  },

  // 下滑至底部触发的回调
  listScrollLower() {
    let page = this.data.lowerNum + 15;
    this.getLowerList(this.data.navlist[this.data.navId], page)
    this.setData({
      lowerNum: page
    })
  },

  // 增加歌单列表长度的回调
  async getLowerList(name, offsetNum) {
    let mvlistLowerData = await requestData('/mv/all', { area: name, limit: 15, offset: offsetNum }),
      { mvlist } = this.data,
      mvlistData = mvlistLowerData.data
    mvlist.push(...mvlistData);
    this.setData({
      mvlist
    })
  },

  // 请求mv播放地址
  async getMvUrl(listMid) {
    let url = await requestData('/mv/url', { id: listMid })
    this.setData({
      url: url.data.url
    })
  },

  // 点击图片触发的回调
  clickMv(event) {
    let id = event.currentTarget.id;
    this.getMvUrl(id)

    // 判断mv的播放时间
    if (!this.data.listMid) {
      this.setData({
        listMid: id
      })
      return;
    }
    if (this.data.listMid === id) {
      return;
    }
    let { mvUpdateTime } = this.data,
      mvItem = mvUpdateTime.find(item => item.id === id)
    if (mvItem) {
      this.setData({
        startTime: mvItem.currentTime
      })
    }
    if (this.data.listMid !== id) {
      let video2 = wx.createVideoContext(this.data.listMid);
      video2.stop()
      this.setData({
        listMid: id
      })
    }
  },

  // 记录当前mv播放时间
  handleTimeUpdate(event) {
    let mvObj = { id: event.currentTarget.id, currentTime: event.detail.currentTime },
      { mvUpdateTime } = this.data,
      mvItem = mvUpdateTime.find(item => item.id === mvObj.id);
    if (mvItem) {
      mvItem.currentTime = event.detail.currentTime;
    } else {
      mvUpdateTime.push(mvObj)
    }
    this.setData({
      mvUpdateTime
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