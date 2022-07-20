// pages/mine/mine.js
const app = getApp();
const {
  getAllOrders,
  verify
} = require('../../api/api.js');
Page({
  data: {
    isLogined: false,
    avatarUrl: "",
    nickName: "", //用户昵称
    hasAddress: false,
    address: {},
    orders: [],
    page: 1, // 设置加载的第几次，默认是第一次
    size: 8, // 每次加载的数据条数
    total: null, //返回数据的个数(可以传空)
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    scrollHeight:1000

  },
  onLoad() {
    let res = wx.getSystemInfoSync();

    let boxHeight = res.windowHeight;

    this.data.scrollHeight = boxHeight;

    this.setData({
      isLogined: wx.getStorageSync("isLogined") ? true : false
    });
    wx.getStorage({
      key: 'nickName',
      success(res) {
        this.setData({
          nickName: res.data
        })
      }
    })
    wx.getStorage({
      key: 'avatarUrl',
      success(res) {
        this.setData({
          avatarUrl: res.data
        })
      }
    })
    wx.getStorage({
      key: 'address',
      success(res) {
        this.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
    let nickName = wx.getStorageSync('nickName'),
      avatarUrl = wx.getStorageSync('avatarUrl'),
      address = wx.getStorageSync('address'),
      hasAddress = wx.getStorageSync('hasAddress');
    console.log(wx.getStorageSync('hasAddress'))
    this.setData({
      nickName,
      avatarUrl,
      address,
      hasAddress
    })
    let token = app.globalData.token.token;
    verify(token).then(res => {
      console.log(token)
      if (res.data.isValid == true) {

        getAllOrders(1, 8).then(res => {
          this.setData({
            orders: res.data.data.data.data
          })
          console.log(res.data.data.data.data)
        })
      } else {
        console.log(res.data.isValid)
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
        getAllOrders(1, 8).then(res => {
          this.setData({
            orders: res.data.data.orders
          })
          console.log(res.data.data.data)
        })
      }
    })
  },
  login: function () {
    const that = this;
    let gbdata = app.globalData;
    wx.login({
      success: function (res) {
        let code = res.code;
        console.log(res.code)
        getApp().post('/token/user', {
          code: code
        }).then((e) => {
          try {
            wx.setStorageSync('token', e.data);
            console.log(wx.getStorageSync('token'))
          } catch (e) {
            console.log('setTokenErr', e)
          }
          gbdata.token = e.data;
          let isLogined = true;
          that.setData({
            isLogined
          })
          wx.setStorageSync('isLogined', isLogined);
          console.log(wx.getStorageSync('isLogined'))
          wx.showToast({
            title: '登陆成功',
            icon: 'success'
          })
        })
      }
    })
    this.getUserProfile();
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
        wx.setStorage({ //数据缓存方法
          key: 'nickName', //关键字，本地缓存中指定的key
          data: res.userInfo.nickName, //缓存微信用户公开信息，
          success: function () { //缓存成功后，输出提示
            console.log('写入nickName缓存成功')
          },
          fail: function () { //缓存失败后的提示
            console.log('写入nickName发生错误')
          }
        })
        wx.setStorage({ //数据缓存方法
          key: 'avatarUrl', //关键字，本地缓存中指定的key
          data: res.userInfo.avatarUrl, //缓存微信用户公开信息，
          success: function () { //缓存成功后，输出提示
            console.log('写入avatarUrl缓存成功')
          },
          fail: function () { //缓存失败后的提示
            console.log('写入avatarUrl发生错误')
          }
        })
      }
    })

  },
  payOrders() {
    wx.navigateTo({
      url: '../fail/fail'
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1, //每次触发上拉事件，把page+1
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false
      });
      that.informationQuery();
    }
  },

  informationQuery() {
    const params = {
      page: this.data.page,
      size: this.data.size
    }
    console.log(params);
    getAllOrders({data: params}).then(res => {
      if (res.data.data.data.data.length > 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        searchList = this.data.orders.concat(res.data.data.data.data)
        this.setData({
          orders: searchList, //获取数据数组
          searchLoading: true //把"上拉加载"的变量设为false，显示  
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        this.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示 
          searchLoading: false //把"上拉加载"的变量设为false，隐藏  
        });
      }
    })
  },

})