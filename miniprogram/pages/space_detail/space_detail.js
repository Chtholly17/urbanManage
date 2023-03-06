/* 待办详情组件 */ 
 
Page({ 
  // 保存展示待办的 _id 和详细信息 
  data: { 
    _id: '', 
    Area :0, 
    Location: '', 
    Community :'', 
    Reason :'', 
    imgs:[] 
  }, 
 
  onLoad(options) { 
    // 保存上一页传来的 _id 字段，用于后续查询待办记录 
    if (options.id !== undefined) { 
      this.setData({ 
        _id: options.id 
      }) 
    } 
  }, 
 
  // 根据 _id 值查询并显示待办数据 
  async onShow() { 
    if (this.data._id.length > 0) { 
      const db = await getApp().database() 
      // 根据 _id 值查询数据库中对应的待办事项 
      db.collection('space').where({ 
        _id: this.data._id 
      }).get({ 
        success: res=> { 
          this.setData({ 
            Area: res.data[0].Area, 
            Location :res.data[0].Location, 
            Community :res.data[0].Community, 
            Reason: res.data[0].Reason, 
            imgs: res.data[0].imgs 
          }) 
        }, 
        fail: err=>{ 
          console.log("查找失败") 
        }  
      }) 
    } 
  }, 
 
  // 跳转响应函数 
  returnToList() { 
    wx.navigateBack({ 
      delta :1 
    }) 
  }, 
   
  // jump to modify page 
  modifySpace() { 
    wx.navigateTo({ 
      url: '../edit/index?id=' + this.data._id, 
    }) 
  } 
})