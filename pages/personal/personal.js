import requestData from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');

    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      this.getUserRecentPlayList(this.data.userInfo.userId);
    }
  },

  // 跳转至登录页面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 获取最近播放歌曲
  async getUserRecentPlayList(id) {
    let recentPlayListData = await requestData('/user/record', { uid: 2075939212, type: 0 })
    let index = 0;
    let recentPlayList = recentPlayListData.allData.slice(0, 10).map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList
    })
  },

  // 清除登录信息
  clear(){
    wx.clearStorage();
    this.setData({
      userInfo: null,
      recentPlayList: []
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