/* 待办列表首页 */
const app = getApp();

Page({
  // 存储请求结果
  data: {
    todos: [], // 用户的所有待办事项
    pending: [], // 未完成待办事项
    finished: [], // 已完成待办事项
    space:  [],
    user: null,
    hasUserInfo: false,
    apart_name: null
  },

 async onShow() {
      const db = await getApp().database()
      db.collection('space').get().then(res => {
        const {
          data
        } = res
        // 存储查询到的数据
        this.setData({
          space: data,
        })
      })

      var openid = app.globalData.openid
      db.collection('user').where({
        _openid: openid
      }).get().then(res => {
        const{
          data
        } = res
        this.setData({
          user: data[0],
        })
      })

    if (typeof this.getTabBar === 'function' && 
      this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      if (app.globalData.hasUserInfo == false) {
        wx.showModal({
          title: '请先登录',
          icon: 'none',
          success: function(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../user/user',
                })
              }
              else {
                wx.exitMiniProgram({success: (res) => {}})
              }
          }
        })
      }
  },

  // 跳转响应函数
  toFileList(e) {
    const todoIndex = e.currentTarget.dataset.index
    const todo = this.data.pending[todoIndex]
    wx.navigateTo({
      url: '../file/index?id=' + todo._id,
    })
  },

  toDetailPage(e) {
    const todoIndex = e.currentTarget.dataset.index
    const todo = this.data.pending[todoIndex]
    wx.navigateTo({
      url: '../detail/index?id=' + todo._id,
    })
  },

  toAddPage() {
    wx.navigateTo({
      url: '../../pages/add/index',
    })
  }
})