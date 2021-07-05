import requsetData from '../../utils/request';
import PubSub from 'pubsub-js';
import moment from 'moment';
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songData: '',
    artists: '',
    musicSrcLink: '',  //音乐播放地址
    currentTime: '00:00',
    dtTime: '00:00',
    changingTime: '',
    trueTime: '' //进度条显示长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "正在播放"
    })

    // 控制播放/暂停
    this.music = wx.getBackgroundAudioManager()
    this.music.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = this.data.songData.id
    })
    this.music.onPause(() => {
      this.changePlayState(false)
    })
    this.music.onStop(() => {
      this.changePlayState(false)
    })
    this.music.onEnded(() => {
      PubSub.publish('switchType', 'next')
      this.setData({
        currentTime: '00:00',
        isPlay: true
      })
    })

    // 接受路由跳转时传递的数据
    const eventChannel = this.getOpenerEventChannel();
    let asd = this
    eventChannel.on('songg', function (data) {
      let dtTime = moment(data.data.dt).format('mm:ss')
      asd.setData({
        songData: data.data,
        dtTime
      })
    })

    // 更新歌手信息
    this.extractArtists(this.data.songData.ar)

    // 监听播放进度
    this.music.onTimeUpdate(() => {

      let currentTime = moment(this.music.currentTime * 1000).format('mm:ss')

      if (appInstance.globalData.musicId === this.data.songData.id) {
        this.setData({
          currentTime,
          trueTime: this.music.currentTime * 1000
        })
      } else {
        this.setData({
          trueTime: 0
        })
      }
    })

    // 重进页面后判断歌曲播放状态
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.songData.id) {
      let currentTime = moment(this.music.currentTime * 1000).format('mm:ss')
      this.setData({
        isPlay: true,
        currentTime,
        trueTime: this.music.currentTime
      })
    }

    // 订阅切换歌曲信息
    PubSub.subscribe('transfer', (methodName, transferData) => {
      this.playControl(this.data.isPlay, transferData.id)
      let dtTime = moment(transferData.dt).format('mm:ss')
      this.setData({
        songData: transferData,
        dtTime,
      })
      this.extractArtists(this.data.songData.ar)
    })
  },

  // 点击播放按钮
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    this.playControl(isPlay, this.data.songData.id, this.data.musicSrcLink)
  },

  // 根据songData.data.id请求播放地址的回调
  async playControl(isPlay, musicId, musicSrcLink) {
    if (isPlay) {
      if (!musicSrcLink) {
        let musicSrc = await requsetData('/song/url', { id: musicId }),
          musicSrcLink = musicSrc.data[0].url;
        this.setData({
          musicSrcLink
        })
      }
      this.music.src = this.data.musicSrcLink;
      this.music.title = this.data.songData.name;
    } else {
      this.music.pause()
    }
  },

  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay;
  },

  // 上一首/下一首切换
  handleSwitch(event) {
    let type = event.currentTarget.id;
    PubSub.publish('switchType', type)
    this.setData({
      isPlay: true
    })
  },

  // 进度条触发回调
  timeChanging(event) {
    let currentTime = moment(event.detail.value).format('mm:ss');
    this.setData({
      currentTime,
    })
    if (currentTime === this.data.dtTime) {
      event.detail.value = 0;
    }
  },

  timeChange(event) {
    let currentTime = moment(event.detail.value).format('mm:ss');
    this.music.seek(event.detail.value / 1000)
  },

  // 提取歌手信息的回调
  extractArtists(n) {
    let artists = [];
    for (let arts of n) {
      artists.push(arts.name)
    }
    let fArtists = artists.join('/')
    this.setData({
      artists: fArtists
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
    this.setData({
      results: []
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 取消订阅
    PubSub.unsubscribe('transfer')
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