// pages/cart/cart.js
const {
  setOrder,
  verify
} = require('../../api/api.js');
const {
  login
} = require('../mine/mine.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [], //数据 
    iscart: false,
    hidden: null,
    isAllSelect: false,
    totalMoney: 0,
    order_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    var arr = wx.getStorageSync('cart') || [];
    // console.log("缓存数据：", arr);
    if (arr.length > 0) {
      // 更新数据  
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false
      });
      // console.log("新缓存数据：", this.data.carts);
    } else {
      this.setData({
        iscart: false,
        hidden: true,
      });
      // console.info("缓存数据：啥也没有");
    }
  },

  //勾选事件处理函数  
  switchSelect: function (e) {
    // 获取item项的id，和数组的下标值  
    var Allprice = 0,
      i = 0;
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect; //价钱统计
    if (this.data.carts[index].isSelect) {
      this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count);
    } else {
      this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count);
    }
    //是否全选判断
    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = Allprice + (this.data.carts[index].price * this.data.carts[index].count);
      // console.log(this.data.carts[i].isSelect);
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    } else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },

  allSelect: function (e) {
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }
    } else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
    })
  },

  /* 减数 */
  delCount: function (e) {
    var index = e.target.dataset.index;
    // console.log("count--");
    var count = this.data.carts[index].count; // 商品总数量-1
    if (count > 1) {
      this.data.carts[index].count--;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    // console.log("carts:" + this.data.carts);
    this.priceCount();
  },
  /* 加数 */
  addCount: function (e) {
    var index = e.target.dataset.index;
    // console.log("count++");
    var count = this.data.carts[index].count; // 商品总数量+1  
    if (count < 10) {
      this.data.carts[index].count++;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    // console.log("carts:" + this.data.carts);
    this.priceCount();
  },
  priceCount: function (e) {
    this.data.totalMoney = 0;
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].isSelect == true) {
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }

    }
    this.setData({
      totalMoney: this.data.totalMoney,
    })
  },
  /* 删除item */
  delGoods: function (e) {
    this.data.carts.splice(e.target.id.substring(3), 1); // 更新data数据对象  
    if (this.data.carts.length > 0) {
      this.setData({
        carts: this.data.carts
      })
      wx.setStorageSync('cart', this.data.carts);
      this.priceCount();
    } else {
      this.setData({
        cart: this.data.carts,
        iscart: false,
        hidden: true,
      })
      wx.setStorageSync('cart', []);
    }
  },

  goBuy: function (e) {
    var newProducts = [];
    const that = this;
    this.data.carts.forEach(item => {
      if (item.isSelect == true) {

        newProducts.push({
          product_id: item.id,
          count: item.count,
        })
        // 删除选中进入订单的商品
      }
      newProducts.forEach(item_selected => {
        var index = this.data.carts.indexOf(item_selected);
        this.data.carts.splice(index, 1);
      })
    })
    console.log(newProducts);
    if (this.data.carts.length > 0) {
      this.setData({
        carts: this.data.carts
      })
      wx.setStorageSync('cart', this.data.carts);
      this.priceCount();
    } else {
      this.setData({
        cart: this.data.carts,
        iscart: false,
        hidden: true,
      })
      wx.setStorageSync('cart', []);
    }


    // console.log("app.globalData.token：   ", app.globalData.token);
    let token = app.globalData.token.token;
    // console.log("token：   ", token);

    verify(token).then(res => {
      if (res.data.isValid == true) {
        console.log("2", newProducts)
      } else {
        // console.log(res.data.isValid)
        const that = this;
        let gbdata = app.globalData;
        wx.login({
          success: function (res) {
            let code = res.code;
            // console.log(res.code)
            getApp().post('/token/user', {
              code: code
            }).then((e) => {
              try {
                wx.setStorageSync('token', e.data);
                // console.log(wx.getStorageSync('token'))
              } catch (e) {
                // console.log('setTokenErr', e)
              }
              gbdata.token = e.data;
              let isLogined = true;
              that.setData({
                isLogined
              })
              wx.setStorageSync('isLogined', isLogined);
              // console.log(wx.getStorageSync('isLogined'))
              wx.showToast({
                title: '登陆成功',
                icon: 'success'
              })
            })
          }
        })
      }
    })
    wx.request({
      url: 'https://hanmashanghu.qiaomai365.com/api/v1/order',
      method: 'POST',
      header: {
        //修改
        'content-type': 'application/json',
        'token': token
      },
      data: {
        products: newProducts
      },
      success: res => {
        var order_id = res.data.data.order_id;
        wx.setStorageSync('data', res.data.data)
        console.log(res.data.data)
        wx.setStorageSync('order_id', order_id)
        wx.navigateTo({
          url: '/pages/orders/orders?order_id=' + wx.getStorageSync('order_id')
        })
        console.log(wx.getStorageSync('order_id'))
      }
    })

    // console.log(res.data.isValid)

  },
})