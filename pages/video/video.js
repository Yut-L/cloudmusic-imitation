import requestData from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    vid: '',
    videoUpdateTime: [],
    isRefresh: true,
    scrollHeight: 0,
    lowerNum: 0,
    startTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData()

    // 计算屏幕高度，才能触发bindscrolltolower
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight
    })
  },

  // 获取视频标签列表的回调
  async getVideoGroupListData() {
    let videoGroupListData = await requestData("/video/group/list");
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })

    this.getVideoList(this.data.navId)
  },

  // 获取视频标签下的视频
  async getVideoList(navId, offsetNum = 0) {
    let videoListData = await requestData("/video/group", { id: navId, offset: offsetNum }),
      index = 0,
      videoData = videoListData.datas.map(item => { item.id = index++; return item });
    this.setData({
      videoList: videoData,
    })
    wx.hideLoading()
  },

  // 点击标签触发的回调
  navChange(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId * 1,
      videoList: [],
      lowerNum: 0
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId)
  },

  // 点击视频切换播放的回调
  clickVideo(event) {
    let id = event.currentTarget.id;
    if (!this.data.vid) {
      this.setData({
        vid: id
      })
      return;
    }
    if (this.data.vid === id) {
      return;
    }
    let { videoUpdateTime } = this.data,
      videoItem = videoUpdateTime.find(item => item.id === id)
    if (videoItem) {
      this.setData({
        startTime: videoItem.currentTime
      })
    }
    if (this.data.vid !== id) {
      let video2 = wx.createVideoContext(this.data.vid);
      video2.stop()
      this.setData({
        vid: id
      })
    }
  },

  // 下拉更新视频列表数据的回调
  videoRefresh() {
    this.getVideoList(this.data.navId)
    this.setData({
      isRefresh: false
    })
  },

  // 下滑至底部触发的回调
  videoScrollLower() {
    let page = this.data.lowerNum + 1;
    this.getVideoLowerList(this.data.navId, page)
    this.setData({
      lowerNum: page
    })
  },

  // 增加视频列表长度的回调
  async getVideoLowerList(navId, offsetNum) {
    let videoListLowerData = await requestData("/video/group", { id: navId, offset: offsetNum }),
      index = 0,
      { videoList } = this.data,
      videoData = videoListLowerData.datas.map(item => { item.id = index++; return item });
    videoList.push(...videoData);
    this.setData({
      videoList
    })
  },

  // 记录当前视频播放时间
  handleTimeUpdate(event) {
    let videoObj = { id: event.currentTarget.id, currentTime: event.detail.currentTime },
      { videoUpdateTime } = this.data,
      videoItem = videoUpdateTime.find(item => item.id === videoObj.id);
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime;
    } else {
      videoUpdateTime.push(videoObj)
    }
    this.setData({
      videoUpdateTime
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