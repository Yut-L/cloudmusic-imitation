import requestData from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toplist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToplist()
  },

  async getToplist() {
    let toplistData = await requestData('/toplist/detail')
    this.setData({
      toplist: toplistData.list
    })
  },

  // 点击传送榜单id和跳转页面
  toDetail(event) {
    let id = event.currentTarget.dataset.top.id,
      name = event.currentTarget.dataset.top.name,
      data = { id, name }
    wx.navigateTo({
      url: '/pages/toplistDetail/toplistDetail?data=' + JSON.stringify(data)
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