//获取应用实例
const app = getApp();

Page({
    /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: null,
    menuitems: [
      { text: '个人信息', url: '../user_info/user_info', icon: '/images/tabbar/user.png', tips: '' },
      // { text: '我的上传', url: '../userinfo/userinfo', icon: '../../images/icon-index.png', tips: '' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (app.globalData.userInfo) {
      that.setUserInfo(app.globalData.userInfo);
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setUserInfo(res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.setUserInfo(res.userInfo);
        }
      })
    }
  },

  onShow: function (options) {
  },

  login_showToast: function(options){
    wx.showToast({
      title: "请先登陆",
      cancelColor: 'cancelColor',
      icon: "none"
    })
  },


getUserInfo: async function (e) {
    this.setUserInfo(e.detail.userInfo);
    console.log("in")
    console.log(this.data.user)
    var openid = app.globalData.openid;
    const db = await getApp().database();
      db.collection('user').where({
        _openid: openid
      }).get().then(res => {
        const{
          data
        } = res
        this.setData({
          user: data[0],
        })
        if (this.data.user == null) {
          wx.redirectTo({
            url: '../information/index',
          })
        }
      })
      
  },

  setUserInfo: function (userInfo) {
    if (userInfo != null) {
      app.globalData.userInfo = userInfo
      app.globalData.hasUserInfo = true
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  }
  // getUserInfo: function(e) {
  //   if (e.detail.userInfo) {
  //     app.globalData.userInfo = e.detail.userInfo;
  //     this.setData({
  //       userInfo:e.detail.userInfo,
  //       hasUserInfo: true
  //     })
  //     wx.setStorageSync("userinfo", e.detail.userInfo);
  //     //回到list/index

  //   }
  // }
})