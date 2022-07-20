// index.js

const {
  getBanner, getThemeInfo, getItems
} = require('../../api/api.js');

// 获取应用实例
const app = getApp()

Page({
  data: {
    id: 1,
    nae: "",
    decription: "",
    crate_time: "",
    upate_time: "",
    items: [{
      key_word: "6",
      type: 1,
      create_time: "1970-01-01 08:00:00",
      update_time: "1970-01-01 08:00:00",
      img: {
        name: "",
        url: "/images/banner-4a.png",
        create_time: "1970-01-01 08:00:00",
        update_time: "1970-01-01 08:00:00"
      }
    }],
    swiperCurrent: " ",
    theme_1:[
      {}
    ],
    theme_2:[{}],
    theme_3:[{}],
    products:[{}],
  },
  swiperChange: function (e) { //指示图标
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function () {
    const that = this;
    //获得轮播图列表
    getBanner().then(res => {
      // console.log(res.data.data.items)
      that.setData({
        items: res.data.data.items
      })
    })

    // 获得首页推荐图片1
    getThemeInfo(1).then(res => {
      // console.log(res.data.data)
      that.setData({
        theme_1: res.data.data
      })
    })

    getThemeInfo(2).then(res => {
      // console.log(res.data.data)
      that.setData({
        theme_2: res.data.data
      })
    })

    getThemeInfo(3).then(res => {
      // console.log(res.data.data)
      that.setData({
        theme_3: res.data.data
      })
    })

    // 获得首页商品
    getItems().then(res => {
      console.log(res.data.data)
      that.setData({
        products: res.data.data
      })
    })
  },
})