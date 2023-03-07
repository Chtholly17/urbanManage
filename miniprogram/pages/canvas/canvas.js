// pages/drag/drag.js
var attr = {
  "书架-塑料": {
    carbon: 8.464,
    cost: 79,
    sat: 1.6
  },
  "书架-木制": {
    carbon: 0,
    cost: 293.05,
    sat: 4.3
  },
  "书架-金属": {
    carbon: 36.2375,
    cost: 299,
    sat: 4.5
  },
  "地毯-塑料": {
    carbon: 2.62,
    cost: 188,
    sat: 1.6
  },
  "地毯-布料": {
    carbon: 43.8,
    cost: 300,
    sat: 4.3
  },
  "猫狗窝-布艺": {
    carbon: 10.95,
    cost: 150,
    sat: 3.5
  },
  "猫狗窝-木制": {
    carbon: 0,
    cost: 330,
    sat: 3.6
  },
  "鸟巢-塑料": {
    carbon: 0.262,
    cost: 20,
    sat: 1.5
  },
  "鸟巢-木制": {
    carbon: 0,
    cost: 26.3,
    sat: 4.6
  },
  "鸟巢-金属": {
    carbon: 2.23,
    cost: 55,
    sat: 2.3
  },
  "食盆-塑料": {
    carbon: 0.7074,
    cost: 19.3,
    sat: 2.5
  },
  "食盆-金属": {
    carbon: 0.5575,
    cost: 26,
    sat: 4.4
  },
  img:undefined
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    drag: { //控制拖拽部分的盒子大小，在这里输入初始数据
      outWidth: 750, //可移动区域的宽度，单位rpx，750rpx是屏幕宽度
      height: 120, //盒子的高度，单位rpx
      countOneLine: 5, //一行盒子的个数，这个决定盒子宽度 (outWidth / countOneLine)
    },
    count: 1,
    total_carbon: 0,
    total_cost: 0,
    total_sat: 0,
    score:0, 
    max_carbon:0,
    max_cost:0,
    max_sat:0,
    list: [ //列表，在这里输入想展示的数据，最后将会修改这里的顺序
      // {
      //   id: 0, // id
      //   name: '书架-塑料', //名称
      //   img: "../../images/items/书架-塑料.jpg"
      // }
    ],
    positionList: [], //把list转化后，具有定位数据的列表（展示在页面上）
    //下面的是一些动态的索引
    showLine: -1, //显示哪个索引的蓝色线
    leftX:0,
    rightX:0,
    topY:0,
    bottomY:0,
    nowDragIndex: -1, //当前拖动的索引
  },
 
  //拖拽时触发
  drag(e) {
    if (e.detail.source == '') return //如果这个值为空，说明不是手动拖拽的，不要进行下面的操作
    console.log("test");
 
 
    let myindex = e.currentTarget.dataset.myindex //当前拖动的图标的index
    if (this.data.nowDragIndex !== myindex) { //设置当前拖动的图标
      console.log('当前拖动的图标序号为', myindex);
      this.setData({
        nowDragIndex: myindex
      })
    }
 
    // e.detail单位是px，需要转为rpx
    let x = this.pxToRpx(e.detail.x) //转为rpx的x
    let y = this.pxToRpx(e.detail.y) //转为rpx的y
    let box = {}
    let drag = this.data.drag //拖拽部分的变量 宽 高 个数等
    box.leftX = x //正在拖动的盒子的左侧x值
    box.rightX = x + drag.outWidth / drag.countOneLine //正在拖动的盒子的右侧x值
    box.topY = y //正在拖动的盒子的顶部y值
    box.bottomY = y + drag.height //正在拖动的盒子的底部y值
    this.data.positionList[this.data.nowDragIndex].left = box.leftX
    this.data.positionList[this.data.nowDragIndex].boxTop = box.topY
    this.setData({
      leftX: box.leftX,
      rightX: box.rightX,
      topY: box.topY,
      bottomY: box.bottomY,
      showLine:-1,
      positionList:this.data.positionList
    })
  },
  onClick(e){
    let positionList = this.data.positionList
    let list = this.data.list
    let newItemName = this.data.newItemName
    if (!newItemName || attr[newItemName] == undefined) return // 输入不能为空    
    let img_path = "../../images/items/" + newItemName + ".jpg"
    let count = this.data.count + 1
    let item = {
      id: count,
      name: newItemName,
      img: img_path
    }
    list.push(item)
    positionList.push({
      ...item,
      left: 0,
      boxTop: 0,
    })
    let total_carbon = parseFloat(this.data.total_carbon) + attr[newItemName].carbon
    let total_cost = parseFloat(this.data.total_cost) + attr[newItemName].cost
    let total_sat = parseFloat(this.data.total_sat) + attr[newItemName].sat
    total_carbon = parseFloat(total_carbon).toFixed(2)
    total_cost = parseFloat(total_cost).toFixed(2)
    total_sat = parseFloat(total_sat).toFixed(2)
    this.setData({
      count,
      list, 
      positionList,
      nowDragIndex: -1,
      showLine:-1,
      max_carbon: Math.max(this.data.max_carbon, attr[newItemName].carbon),
      max_cost: Math.max(this.data.max_cost, attr[newItemName].cost),
      max_sat: Math.max(this.data.max_sat, attr[newItemName].sat),
      total_carbon: total_carbon,
      total_cost: total_cost,
      total_sat: total_sat,
      score: 0
    })
    let score = this.data.total_sat/this.data.max_sat/this.data.count*73.06 + (this.data.max_carbon - this.data.total_carbon / this.data.count)/this.data.max_carbon*18.84+(this.data.max_cost - this.data.total_cost / this.data.count)/this.data.max_cost*8.1
    this.setData({
      score: score.toFixed(2)
    })
    // Sat/count/5*73.06+(1200-CO2/count)/1200*18.84+(3000-price/count)/3000*8.1
  },
  onInput(e) {
    this.setData({
      newItemName: e.detail.value
    })
  },
  //计算list里每个数据的坐标,放到positionList里
  countPosition() {
    let positionList = [] //装着列表的坐标数据
    let list = this.data.list
    for (let i = 0; i < list.length; i++) {
      let element = list[i]
      positionList.push({
        ...element,
        index: i,
        left: (i % this.data.drag.countOneLine) * (this.data.drag.outWidth / this.data.drag.countOneLine),
        boxTop: parseInt(i / this.data.drag.countOneLine) * this.data.drag.height,
        boxBottom: (parseInt(i / this.data.drag.countOneLine) + 1) * this.data.drag.height,
      })
    }
    this.setData({
      positionList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
 
    //#region 定义 px转rpx 函数
    wx.getSystemInfo({
      success: (result) => {
        this.windowWidth = result.windowWidth
      },
    })
    this.pxToRpx = function (v_px) {
      let onePxToRpx = 750 / this.windowWidth
      return v_px * onePxToRpx
    }
    //#endregion
 
    //#region 计算列表的坐标, 装着列表的数据,包含坐标
    this.countPosition()
    //#endregion
    var img = decodeURIComponent(options.str)
    console.log(img)
    this.setData({
      img:img
    })
    
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
 
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
 
  },
 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
 
  },
 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
 
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
 
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
 
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
 
  }
})
