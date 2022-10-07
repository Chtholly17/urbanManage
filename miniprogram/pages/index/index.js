/* 待办列表首页 */
const app = getApp();

Page({
  // 存储请求结果
  data: {
    todos: [], // 用户的所有待办事项
    pending: [], // 未完成待办事项
    finished: [], // 已完成待办事项
    space:[],
    hasUserInfo: false,
    apart_name: null
  },

  onShow() {
    // 通过云函数调用获取用户 _openId
    getApp().getOpenId().then(async openid => {
      // 根据 _openId 数据，查询并展示待办列表
      const db = await getApp().database()
      db.collection("space").where({
        _openid: openid
      }).get().then(res => {
        const {
          data
        } = res
        // 存储查询到的数据
        this.setData({
          // data 为查询到的所有待办事项列表
          todos: data,
          // 通过 filter 函数，将待办事项分为未完成和已完成两部分
          pending: data.filter(todo => todo.freq === 0),
          finished: data.filter(todo => todo.freq === 1)
        })
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