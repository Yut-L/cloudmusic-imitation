import requestData from '../../utils/request'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderData: '',
    hotList: [],
    searchContent: '',
    searchList: '',
    flag: null,  //防抖
    inputValue: '',
    historyList: [],
    results: [],
    index: 0,
    artists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();

    // 订阅歌曲切换消息
    PubSub.subscribe('switchType', (methodName, type) => {
      let { results, index } = this.data;
      if (type === 'pre') {
        (index === 0) && (index = results.length)
        index -= 1
      } else {
        (index === results.length - 1) && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let transferData = results[index];
      PubSub.publish('transfer', (methodName, transferData))
    })
  },

  // 请求搜索结果
  async search() {
    let record = this.data.inputValue
    if (record) {
      await this.getSearchResults(record)
      let { historyList } = this.data;
      historyList.push(record)
      this.setData({
        historyList
      })
    }
  },

  // 清空搜索框
  clear() {
    this.setData({
      inputValue: ''
    })
  },

  //清空搜索结果
  clearResults() {
    this.setData({
      results: []
    })
  },

  async getInitData() {
    let data1 = await requestData('/search/default'),
      data2 = await requestData('/search/hot/detail'),
      placeholderData = data1.data.showKeyword,
      hotList = data2.data
    this.setData({
      placeholderData,
      hotList
    })
  },

  // 请求搜索关联词
  async getSearchData(value) {
    let data = await requestData('/search', { keywords: value, limit: 8 })
    this.setData({
      searchList: data.result.songs
    })
  },

  // 请求搜索内容
  async getSearchResults(value) {
    if (this.data.inputValue) {
      let results = await requestData('/cloudsearch', { keywords: value })
      this.setData({
        results: results.result.songs
      })

      // 更新歌手信息
      this.extractArtists(this.data.results)
    }
  },

  // 搜索框输入内容后触发的回调
  handleInput(event) {
    this.setData({
      inputValue: event.detail.value.trim(),
    })

    let that = this;
    clearTimeout(that.data.flag)
    that.data.flag = setTimeout(() => {
      that.data.inputValue && that.getSearchData(that.data.inputValue)
    }, 500);
  },

  // 热搜替换
  replace(event) {
    this.setData({
      inputValue: event.currentTarget.dataset.name
    })
  },

  // 关联词替换
  replace2(event) {
    this.setData({
      inputValue: event.currentTarget.dataset.content
    })
  },

  // 点击单曲跳转至songDetail页面
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

  // 提取歌手信息的回调
  extractArtists(n) {
    let artistsList = [], artists = []
    n.forEach(item => {
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