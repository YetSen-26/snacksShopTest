const app = getApp()
const {
  getClass,
  getClassDetail
} = require('../../api/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [{}],
    classs: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const that = this;
    // async function get() {
    //   let detail;
    //   await getClass().then(res => {
    //     console.log(res.data.data)
    //     detail=res.data.data
    //     that.setData({
    //       detail
    //     })
    //     console.log(222,detail)
    //   })
    //   console.log(112,this.detail)
    //   for (var i = 0; i < this.data.detail.legth; i++) {
    //     getClassDetail(that.data.detail[i].id).then(res => {
    //       console.log(res.data.data)
    //     })
    //   }
    // }
    // get();
    var classs = [];
    let detail;
    getClass().then(res => {
      detail = res.data.data
      // console.log(detail)
      for (var i = 0; i < detail.length; i++) {
        getClassDetail(detail[i].id).then(res => {
          classs.push(res.data.data)
          that.setData({
            detail,
            classs
          })
        })
        console.log(classs)
      }
    })

  },
  switchTab(e) {
    const self = this;
    this.setData({
      isScroll: true
    });
    setTimeout(function () {
      self.setData({
        toView: 's' + e.target.dataset.id,
        curIndex: e.target.dataset.index
      });
    }, 0);
    setTimeout(function () {
      self.setData({
        isScroll: false
      });
    }, 1);
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