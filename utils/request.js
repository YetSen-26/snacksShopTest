const app = getApp()
const method = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'];
const content_type = ['application/json', 'application/x-www-form-urlencoded']
function prompt(e = {}, op, reject, resolve) {
  let title = e.message || '错误 ！';
  if (!title) return;
  let icon = 'success';
  if (e.code !== 0) {
    icon = 'none';
    reject(title, e.data)
  } else if (resolve) resolve(e.data);
  if (op.prompt !== false) wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

export default (url = '', data={}, op = {}, type = 0, content = 0) => {
  if (op.loading !== false) wx.showNavigationBarLoading();
  try{
    return new Promise((resolve, reject) => {
      wx.request({
        data,
        url: 'https://hanmashanghu.qiaomai365.com/api/v1' + url,
        method: method[type],
        header: {
          //修改
          // 'content-type': content_type[content],
          'token': app.globalData.token.token,
          // 'Authorization' : 'Bearer '+ app.globalData.token
        },
        success: (v) => prompt(v.data, op, reject, resolve(v)),
        // success:v=>resolve(v),
        fail: (e) => prompt(e, op, reject),
        complete() {
          if (op.loading !== false) wx.hideNavigationBarLoading()
        }
      })
    }).catch(()=>{})
  }catch(err){
    console.log(err);
  }
}