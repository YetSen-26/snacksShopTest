// app.js
const app = getApp();
App({
  onLaunch() {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.globalData.token = res.data
        console.log(this.globalData.token)
      }
    })
  },
  // is_login() {
  //   return Boolean(this.globalData.token)
  // },
  post(url,data,header){
    //统一的post请求方法，返回promise
    let localData=this.globalData
    let m_header=header||{};
    // m_header['Authorization']='Bearer '+localData.token
    m_header['Content-Type']='application/x-www-form-urlencoded'
    console.log('url:',url)
    console.log('data',data)
    if(url=='/api2/auth/login/wechat-code'){
      m_header ={'Content-Type':'application/x-www-form-urlencoded'}
    }
    console.log('header',m_header)
    return new Promise((resolve,reject)=>{
      wx.request({
        url: localData.base_URL+url,
        method:'POST',
        header:m_header,  
        data:data,
        success:e=>resolve(e),
        fail:err=>reject(err)
      })
     })
  },

  globalData: {
    //存储必要的用户信息
    userInfo: null,
    base_URL: 'https://hanmashanghu.qiaomai365.com/api/v1',
    token: ''
  }
})