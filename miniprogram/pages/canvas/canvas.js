// // index.js
// let startX = 0 // 获取手指初始坐标
// let startY = 0
// let x = 0 // 获得盒子原来的位置
// let y = 0
// let cSys = {} // 当前系统配置
// let btnsRect = [] // 拖拽元素宽高
// let defaultH = 100 // 缺省高度
// let defaultW = 100 // 缺省宽度
// let active = 0
// let currentTab = 0

// Component({
//   lifetimes: {
//     ready: function () {
//       const query = wx.createSelectorQuery().in(this)
//       query.select('#btn').boundingClientRect(res => {
//         cSys = wx.getSystemInfoSync()
//         btnsRect = [res.width, res.height]
//         const top = Math.floor(cSys.windowHeight - btnsRect[1] - defaultH)
//         const left = Math.floor(cSys.windowWidth - btnsRect[0] - defaultW)
//         this.setData({
//           top,
//           left
//         })
//       }).exec();
//     },
//   },
//   data: {
//     imgs:"../../images/add_space/add.png",
//     top: 0,
//     left: 0
//   },
//   methods: {
//     onTouchStart (e) {
//       // 获取手指初始坐标
//       startX = e.changedTouches[0].pageX;
//       startY = e.changedTouches[0].pageY;
//       x = e.currentTarget.offsetLeft;
//       y = e.currentTarget.offsetTop;
//     },
//     onTouchmove (e) {
//       // 计算手指的移动距离：手指移动之后的坐标减去手指初始的坐标
//       const moveX = e.changedTouches[0].pageX - startX;
//       const moveY = e.changedTouches[0].pageY - startY;
//       // 移动盒子 盒子原来的位置 + 手指移动的距离
//       const top = Math.floor(Math.min(Math.max(0, y + moveY), cSys.windowHeight - btnsRect[1]))
//       const left = Math.floor(Math.min(Math.max(0, x + moveX), cSys.windowWidth - btnsRect[0]))
//       this.setData({
//         top,
//         left
//       })
//     },
//     onSubmit () {
//       console.warn('提交');
//     }
//   },
// })

// pages/drag/drag.js
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
    list: [ //列表，在这里输入想展示的数据，最后将会修改这里的顺序
      {
        id: 0, // id
        name: '餐饮', //名称
      },
      {
        id: 1, // id
        name: '交通', //名称
      },
      {
        id: 2, // id
        name: '住房', //名称
      },
      {
        id: 3, // id
        name: '美容', //名称
      },
      {
        id: 4, // id
        name: '服饰', //名称
      },
      {
        id: 5, // id
        name: '运动', //名称
      },
      {
        id: 6, // id
        name: '旅行', //名称
      },
      {
        id: 7, // id
        name: '娱乐', //名称
      },
      {
        id: 8, // id
        name: '生活', //名称
      },
      {
        id: 9, // id
        name: '医疗', //名称
      },
      {
        id: 10, // id
        name: '通讯', //名称
      },
      {
        id: 11, // id
        name: '学习', //名称
      },
      {
        id: 12, // id
        name: '礼物', //名称
      },
      {
        id: 13, // id
        name: '亲属', //名称
      },
      {
        id: 14, // id
        name: '数码', //名称
      },
      {
        id: 15, // id
        name: '零食', //名称
      },
      {
        id: 16, // id
        name: '购物', //名称
      },
      {
        id: 17, // id
        name: '其它', //名称
      },
      {
        id: 18, // id
        name: '转换', //名称
      },
      {
        id: 19, // id
        name: '出门', //名称
      },
      {
        id: 20, // id
        name: '红包', //名称
      },
      {
        id: 21, // id
        name: '食堂', //名称
      },
      {
        id: 22, // id
        name: '外卖', //名称
      },
      {
        id: 23, // id
        name: 'AA', //名称
      },
      {
        id: 24, // id
        name: '超市', //名称
      },
      {
        id: 25, // id
        name: '水电', //名称
      },
      {
        id: 26, // id
        name: '早餐', //名称
      },
      {
        id: 27, // id
        name: '水果', //名称
      },
      {
        id: 28, // id
        name: '借款', //名称
      },
    ],
    positionList: [], //把list转化后，具有定位数据的列表（展示在页面上）
    //下面的是一些动态的索引
    showLine: -1, //显示哪个索引的蓝色线
    nowDragIndex: -1, //当前拖动的索引
  },
 
  //拖拽时触发
  drag(e) {
    if (e.detail.source == '') return //如果这个值为空，说明不是手动拖拽的，不要进行下面的操作
    // console.log(e.detail);
 
 
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
 
    //使用for循环判断现在正在哪个位置 - 性能问题，如何防抖？
    for (let i = 0; i < this.data.positionList.length; i++) {
      const element = this.data.positionList[i];
      //判断拖拽的盒子，在哪个蓝色模块的位置
      if (box.leftX < element.left && box.rightX > element.left && element.boxTop - 20 < box.topY && element.boxBottom + 20 > box.bottomY) {
        this.setData({
          showLine: i
        })
        break
      }
    }
 
  },
 
  //拖拽的结束，判断是否应该移动，还是回复原位
  dragEnd(e) {
    let newIndex = this.data.showLine //即将挪动到的位置
    let nowDragIndex = this.data.nowDragIndex //原本的位置
    if (newIndex >= 0 && nowDragIndex !== newIndex) { //给showline赋值了且不是自己，说明需要变化位置
      console.log('需要变化位置');
      let newList = this.data.list //改变的是list，而不是页面展示的positionList
      let item = newList.splice(nowDragIndex, 1) // 删除指定的元素，给item
      newList.splice(newIndex, 0, item[0]) // 把item添加到指定位置
 
      this.setData({
        list: newList, //data的list修改，方便接下来重新计算位置
      })
      //然后刷新页面，重新计算position
      this.countPosition()
 
    } else {
      console.log('拖了但没完全拖，回复原位');
      setTimeout(() => {//使用定时器，防止拖拽到边缘时，无法正常归位（等待边缘动画结束后再回复原位，这个好像是微信小程序这个组件的bug，搜到了三个月前的bug，到现在还没解决）
        this.setData({
          positionList: this.data.positionList, //回复原位
        })
      }, 300);
    }
    //重置索引
    this.setData({
      showLine: -1,
      nowDragIndex: -1,
    })
    console.log(this.data);
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
