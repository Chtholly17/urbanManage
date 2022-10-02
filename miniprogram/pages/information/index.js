/* 新增待办页面 */

Page({
  data:{
    Gen: 0,
    Age: 0,
    Duar: 0,
    Community: "",
    GenOptions: ["男","女","保密"],
    AgeOptions: ["18~30岁","30~45岁","45~60岁","60以上"],
    DuarOptions: ["3年以下","3~7年","7~10年","10年以上"]
  },
  //选择性别
  onChooseGender(e){
    this.setData({
      Gen: e.detail.value
    })
  },
  //选择年龄段
  onChooseAge(e){
    this.setData({
      Age: e.detail.value
    })
  },
  //选择居住时间
  onChooseDuartion(e){
    this.setData({
      Duar: e.detail.value
    })
  },
  //输入小区名称
  onCommunityInput(e){
    this.setData({
      Community: e.detail.value
    })
  },
  //保存用户信息
  async saveInfo(){
    if(this.data.Community=""){
      wx.showToast({
        title: '小区名称未填写',
        icon: 'error',
        duration: 2000
      })
    }
    if(this.data.Community.length>50){
      wx.showToast({
        title: '小区名称过长',
        icon: 'error',
        duration: 2000
      })
    }
    
    const db = await getApp().database()
  }
})