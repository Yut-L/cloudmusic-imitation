import requestData from "../../utils/request"
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverData: {},
    songlist: [],
    artists: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 通过 内置getOpenerEventChannel()  方法 获取路由跳转传递的数据
    const eventChannel = this.getOpenerEventChannel();
    let asd = this
    eventChannel.on('songg', function (data) {
      asd.setData({
        coverData: data,
      })
    })

    if (this.data.coverData.data.type) {
      this.getAlbumDetail(this.data.coverData.data.id)
    } else {
      this.getplaylistDetail(this.data.coverData.data.id)
    }

    // 订阅歌曲切换消息
    PubSub.subscribe('switchType', (methodName, type) => {
      let { songlist, index } = this.data;
      if (type === 'pre') {
        (index === 0) && (index = songlist.length)
        index -= 1
      } else {
        (index === songlist.length - 1) && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let transferData = songlist[index];
      PubSub.publish('transfer', (methodName, transferData))
    })
  },

  // 获取歌单数据
  async getplaylistDetail(indexId) {
    let songlistData = await requestData("/playlist/detail", { id: indexId }),
      songlist = songlistData.playlist.tracks
    this.setData({
      songlist
    })

    // 提取歌手信息
    let artistsList = [], artists = []
    this.data.songlist.forEach(item => {
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

  // 获取专辑数据
  async getAlbumDetail(indexId) {
    let songlistData = await requestData("/album", { id: indexId }),
      songlist = songlistData.songs
    this.setData({
      songlist
    })

    // 提取歌手信息
    let artistsList = [], artists = []
    this.data.songlist.forEach(item => {
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