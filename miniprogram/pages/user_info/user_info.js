Page({
  data:{
    Gender: "unknown",
    Age: "unknown",
    Duartion: "unknown",
    Community: "unknown",
  },

    /**
   * 生命周期函数--监听页面加载
   */
  async onShow(options) {
    var GenOptions = ["男","女","保密"]
    var AgeOptions = ["18~30岁","30~45岁","45~60岁","60以上"]
    var DuarOptions = ["3年以下","3~7年","7~10年","10年以上"]
    const db = await getApp().database()
    //在数据库中更新用户信息
    //获取openid
    var openid = getApp().globalData.openid
    db.collection('user').where({
      _openid: openid
    }).get({
      success: res=> {
        console.log(res.data)
        if(res.data.length==0){
          wx.navigateTo({
            url: '../information/index'
          })
        }
        else{
          this.setData({
            Gender: GenOptions[res.data[0].Gender],
            Age: AgeOptions[res.data[0].Age],
            Duartion: DuarOptions[res.data[0].Duartion],
            Community: res.data[0].Community
          })
        }
      },
      fail: err=>{
        console.log("查找失败")
      }
    })

    console.log('uplaod success')
  },

  async resetInfo(){
    wx.navigateTo({
      url: '../information/index'
    })
  },

  async return2User(){
    console.log('fuck')
    wx.navigateBack({
      delta: 0,
    })
  }
})
