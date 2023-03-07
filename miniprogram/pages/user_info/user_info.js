Page({
  data:{
    Gender: "unknown",
    Age: "unknown",
    Duartion: "unknown",
    Community: "unknown",
    City: "unknown"
  },

    /**
   * 生命周期函数--监听页面加载
   */
  async onShow(options) {
    var GenOptions = ["男","女","保密"]
    var AgeOptions = ["14岁以下","14~20岁","20~30岁","30~40岁","40~50岁","50~60岁","60岁以上"]
    var DuarOptions = ["1年以内","1~3年","3~5年","5~10年","10年以上"]
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
            Community: res.data[0].Community,
            City: res.data[0].City
          })
        }
      },
      fail: err=>{
        console.log("查找失败")
      }
    })

    console.log('uplaod success')
  },

  resetInfo(){
    wx.navigateTo({
      url: '../information/index'
    })
  },

  return2User(){
    console.log('fuck')
    wx.navigateBack({
      delta: 0,
    })
  }
})
