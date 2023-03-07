var content = null;
var touchs = [];
// pages/handprint.js
Page({

  /**
   * Page initial data
   */
  data: {
    imgList:[],
    signImage: ''
  },
  // 画布的触摸移动开始手势响应
  start: function (event) {
    // console.log("触摸开始" + event.changedTouches[0].x);
    // console.log("触摸开始" + event.changedTouches[0].y);
    //获取触摸开始的 x,y
    let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y }
    touchs.push(point);
  },
  // 画布的触摸移动手势响应
  move: function (e) {
    let point = { x: e.touches[0].x, y: e.touches[0].y }
    touchs.push(point);
    if (touchs.length >= 2) {
      this.draw(touchs);
    }
  },
  // 画布的触摸移动结束手势响应
  end: function (e) {
    console.log("触摸结束" + e);
    //清空轨迹数组
    for (let i = 0; i < touchs.length; i++) {
      touchs.pop();
    }
  },
  // 画布的触摸取消响应
  cancel: function (e) {
    console.log("触摸取消" + e);
  },
  // 画布的长按手势响应
  tap: function (e) {
    console.log("长按手势" + e);
  },
  error: function (e) {
    console.log("画布触摸错误" + e);
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    //获得Canvas的上下文
    content = wx.createCanvasContext('sign');
    //设置线的颜色
    content.setStrokeStyle("#000");
    //设置线的宽度
    content.setLineWidth(3);
    //设置线两端端点样式更加圆润
    content.setLineCap('round');
    //设置两条线连接处更加圆润
    content.setLineJoin('round');
    const that = this
      wx.getSystemInfo({
        success: function (res){
          console.log(res)
          that.setData({
            model:res.model,
            screen_width: res.windowWidth/375,
            screen_height: res.windowHeight
          })
        }
      })
  },
  //绘制
  draw: function (touchs) {
    let point1 = touchs[0];
    let point2 = touchs[1];
    touchs.shift();
    content.moveTo(point1.x, point1.y);
    content.lineTo(point2.x, point2.y);
    content.stroke();
    content.draw(true);
  },
  //清除操作
  clearClick: function () {
    //清除画布
    content.clearRect(0, 0,750, 700);
    content.draw(true);
  },
  //保存图片
  saveClick:function() {
    wx.canvasToTempFilePath({//把当前画布指定区域的内容导出生成指定大小的图片
      canvasId: 'canvas',
      success(res) {
        wx.authorize({//向用户发起授权请求
          scope: 'scope.writePhotosAlbum',//保存相册授权
          success: () => {
            wx.saveImageToPhotosAlbum({//保存图片到系统相册
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({
                  title: '图片保存成功'
                })
              }
            })
          }
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    wx.getSystemInfo({
      success: function(res) {
        myCanvasWidth = res.windowWidth - 56
        myCanvasHeight = res.windowHeight - 200
      },
    })
    this.setData({
      canvasWidth: myCanvasWidth,
      canvasHeight: myCanvasHeight
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})