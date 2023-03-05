// index.js
let startX = 0 // 获取手指初始坐标
let startY = 0
let x = 0 // 获得盒子原来的位置
let y = 0
let cSys = {} // 当前系统配置
let btnsRect = [] // 拖拽元素宽高
let defaultH = 100 // 缺省高度
let defaultW = 100 // 缺省宽度
let active = 0
let currentTab = 0

Component({
  lifetimes: {
    switchNav: function (e) {
      var page = this;
      var id = e.target.id;
      if (this.data.currentTab == id) {
        return false;
      } else {
        page.setData({
          currentTab: id
        });
      }
      page.setData({
        active: id
      });
    },
    ready: function () {
      const query = wx.createSelectorQuery().in(this)
      query.select('#btn').boundingClientRect(res => {
        cSys = wx.getSystemInfoSync()
        btnsRect = [res.width, res.height]
        const top = Math.floor(cSys.windowHeight - btnsRect[1] - defaultH)
        const left = Math.floor(cSys.windowWidth - btnsRect[0] - defaultW)
        this.setData({
          top,
          left
        })
      }).exec();
    },
  },
  data: {
    top: 0,
    left: 0,
  },
  methods: {
    onTouchStart (e) {
      // 获取手指初始坐标
      startX = e.changedTouches[0].pageX;
      startY = e.changedTouches[0].pageY;
      x = e.currentTarget.offsetLeft;
      y = e.currentTarget.offsetTop;
    },
    onTouchmove (e) {
      // 计算手指的移动距离：手指移动之后的坐标减去手指初始的坐标
      const moveX = e.changedTouches[0].pageX - startX;
      const moveY = e.changedTouches[0].pageY - startY;
      // 移动盒子 盒子原来的位置 + 手指移动的距离
      const top = Math.floor(Math.min(Math.max(0, y + moveY), cSys.windowHeight - btnsRect[1]))
      const left = Math.floor(Math.min(Math.max(0, x + moveX), cSys.windowWidth - btnsRect[0]))
      this.setData({
        top,
        left
      })
    },
    onSubmit () {
      console.warn('提交');
    }
  },
})
