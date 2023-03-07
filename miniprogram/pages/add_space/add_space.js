// pages/add_space/add_space.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 9,
    imgs: [],
    Location: "",
    Reason: "",
    Area: 0,
    Community: "",
    City: "",
    longitude: 0,
    latitude: 0,
    detailImg :""
  },

  async onLoad() {
    const db = await getApp().database()
    //查询当前用户的Community
    let openid = getApp().globalData.openid
    //console.log(openid)
    //console.log(this.data.Reason)
    db.collection('user').where({
      _openid: openid
    }).get({
      success: res=> {
        //console.log(that.data.Reason)
        //console.log(res.data[0].Community)
        this.setData({
          Community: res.data[0].Community,
          City: res.data[0].City
        })
        const key = "3P4BZ-5PICV-QCWPH-U6X4R-RKDJK-HQFM5"
        wx.request({
          url: 'https://apis.map.qq.com/ws/place/v1/search?key=' + key  + '&keyword=' + res.data[0].Community+'&boundary=region('  + res.data[0].City + ',0)&page_size=1',
          success: (res) => {
            console.log(res.data.data[0].location.lat)
            console.log(res.data.data[0].location.lng)
            this.setData({
              latitude: res.data.data[0].location.lat,
              longitude: res.data.data[0].location.lng,
            })
          },
          fail: (err) => {
            console.log('search failed')
          }
        })

      }
    })

  },

  bindUpload: function (e) {

    if(this.data.imgs.length>=9){
      this.data.count = 0
    }
    else{
      this.data.count = 9 - this.data.imgs.length
    }

    var that = this
    wx.chooseMedia({   
      count: that.data.count, // 默认9
      camera: 'back',
      mediaType: ['image'],
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFiles = res.tempFiles
        console.log(tempFiles)
        for (var i = 0; i < tempFiles.length; i=i+1) { 
          console.log(tempFiles[i].tempFilePath)
          let timestamp = (new Date()).valueOf()
          wx.cloud.uploadFile({ 
            cloudPath: timestamp +i + '.png',
            filePath: tempFiles[i].tempFilePath,
            success: function (res) { 
              console.log(res)
              wx.showToast({ 
                title: "上传成功",
                icon: "none",
                duration: 1500
              })
              that.data.imgs.push(res.fileID)
              that.setData({ 
                imgs: that.data.imgs
              })
            },
            fail: function (err) { 
              wx.showToast({ 
                title: "上传失败",
                icon: "none",
                duration: 2000
              })
            },
            complete: function (result) { 
              console.log(result.errMsg)
            }
          })
        }
      }
    })
  },
  // 删除图片
  deleteImg: function (e) { 
    var that = this
    wx.showModal({ 
      title: "提示",
      content: "是否删除",
      success: function (res) { 
        if (res.confirm) { 
          for (var i = 0; i < that.data.imgs.length; i++) { 
            if (i == e.currentTarget.dataset.index) that.data.imgs.splice(i,  1)
          }
          that.setData({ 
            imgs: that.data.imgs
          })
        } else if (res.cancel) { 
          console.log("用户点击取消")
        }
      }
    })
  },

  onLocationInput(e) {
    this.setData({
      Location: e.detail.value
    })
  },

  onReasonInput(e) {
    this.setData({
      Reason: e.detail.value
    })
  },

  onAreaInput(e){
    let value = e.detail.value.replace(/\D/g, '')
    this.setData({
      Area: value
    })
  },

  resetTodo(){
    //删除上传的图片
    let that = this
    wx.cloud.deleteFile({
      fileList: that.data.imgs,
      success: res => {
        // handle success
        console.log(res.fileList)
      },
      fail: err => {
        console.log(res.errMsg)
      }
    })
    //清空输入数据
    this.setData({
      Area: 0,
      Reason: "",
      Location: "",
      Community: "",
      imgs: []
    })
  },
  
  async saveSpace() {
    const db = await getApp().database()
    //对输入内容进行校验
    if(this.data.imgs.length<3){
      wx.showToast({
        title: '请至少上传三张图片',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.Location===""){
      wx.showToast({
        title: '请输入具体位置',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.Reason===""){
      wx.showToast({
        title: '请输入改造原因',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.Area===0){
      wx.showToast({
        title: '请输入正确的区域面积',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if(this.data.detailImg===''){
      wx.showToast({
        title: '请在地图中确定空间具体位置',
        icon: 'none',
        duration: 2000
      })
      return
    }

    db.collection('space').add({
      data: {
        imgs: this.data.imgs,
        Location: this.data.Location,
        Reason: this.data.Reason,
        Area: this.data.Area,
        Community: this.data.Community,
        City: this.data.City,
        detailImg: this.data.detailImg
      }
    })

    wx.navigateBack({
      delta: 0,
    })
  },

  onSaveImage: function() {
    var that = this
    wx.createSelectorQuery().in(this).select("#myMap").fields({
      node: true,
      size: true,
    }).exec((res) =>{
      console.log(res)
      const width = res[0].width
      const height = res[0].height
      const mapCtx = wx.createMapContext('myMap')
      mapCtx.getCenterLocation({
        success: function(res){
          const lat = res.latitude
          const lon = res.longitude
          mapCtx.getScale({
            success:function(res){
              const scale = res.scale
              console.log('scale',scale)
              console.log('h',height)
              console.log('w',width)
              const key = "3P4BZ-5PICV-QCWPH-U6X4R-RKDJK-HQFM5"
              const _url = 'https://apis.map.qq.com/ws/staticmap/v2/?center=' + lat 
                          + ',' + lon + '&zoom=18' +
                          '&size=' + width + '*' + height
                          + '&maptype=satellite'
                          + '&key=' + key
              that.setData({
                detailImg: _url
              })
            }
          })
        },
        fail: function(err){
          console.log(err)
        }
      }) 
    })
    
  }

  // onUnload:function(){
  //   this.resetTodo()
  // }


})