Page({
  clickMe: function(){
    this.setData({msg: "Hello World"})
  }
})

var appInstance = getApp()
console.log(appInstance.globalData)