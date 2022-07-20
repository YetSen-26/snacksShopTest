// pages/orders/orders.js
const {
  getOrderDetail,
  payment
} = require('../../api/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    id: {},
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    let hasAddress = wx.getStorageSync('hasAddress'),
      address = wx.getStorageSync('address')
    that.setData({
      hasAddress,
      address
    })
    let order_id = options.order_id;
    this.data.id = order_id
    console.log(this.data.id);
    getOrderDetail(order_id).then(res => {
      const that = this;
      that.setData({
        orders: res.data.data.snap_items,
        total: res.data.data.total_price
      })
    })
  },

  toPay() {
    console.log(this.data.id)
    // payment(this.data.id).then(res => {
    //   console.log(res.data)
    // })
    wx.request({
      url: 'https://hanmashanghu.qiaomai365.com/api/v1/pay/pre_order',
      method: 'POST',
      header: {
        //修改
        'content-type': 'application/json',
        'token': app.globalData.token.token
      },
      data: {
        id: this.data.id
      },
      success: res => {
        const that = this;
        that.setData({
          data: res.data
        })
      }
      
    })
    wx.requestPayment({
      timeStamp: this.data.data.timeStamp,
      nonceStr: this.data.data.nonceStr,
      package: this.data.data.package,
      signType: this.data.data.signType,
      paySign: this.data.data.paySign,
      success (res) {console.log(res) },
      fail (res) {wx.navigateTo({
        url: '../fail/fail',
      })}
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