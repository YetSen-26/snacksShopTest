const {
  getDetail
} = require('../../api/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    item: [],
    isClick: true
  },
  addCount() {
    let num = this.data.num;
    num++;
    console.log("stock : ",this.data.item.stock);
    if (num < this.data.item.stock) {
      this.setData({
        num: num
      })
    }
  },
  unaddCount() {
    let num = this.data.num;
    num--;
    if (num > 0) {
      this.setData({
        num: num
      })
    }
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  // 节流函数
  throttle() {
    if (this.data.isClick) {
      this.setData({
        isClick: false
      });
      setTimeout(() => {
        this.setData({
          isClick: true
        })
      }, 600);
    } else {
      return;
    }
  },
  addCart(e) {
    var goods = this.data.item;
    goods.isSelect = false;
    var count = this.data.num;
    var title = this.data.item.name;
    if (title.length > 10) {
      goods.title = title.substring(0, 10) + '...';
    }
    var arr = wx.getStorageSync('cart') || [];
    console.log("cart_arr,{} : ", arr);
    if (arr.length > 0) {
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等  
        if (arr[j].id == this.data.item.id) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）  
          arr[j].count = arr[j].count + count;
          // 最后，把购物车数据，存放入缓存 
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          return;
        }
      }
      arr.push(goods);
      arr[arr.length - 1].count = count;
    }else{
      arr.push(goods);
      arr[0].count = count;
    }
    try {
      wx.setStorageSync('cart', arr);      
    } catch (e) {      
        console.log(e)
    }
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    // 节流/////////////////
    this.throttle()
    // 动效////////////////////////////////////
    self.setData({
      show: true
    })
    setTimeout(function () {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function () {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          totalNum: num + total
        })
      }, 200)
    }, 300)
    ///////////////////////////////////

    // 加购
    this.addCart();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    let product_id = options.product_id;
    getDetail(product_id).then(res => {
      console.log(res.data.data)
      that.setData({
        item: res.data.data
      })
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