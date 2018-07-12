Page({
  data: {
    nowTemp: '14°',
    nowWheater: '阴天'
  },
  onLoad(){
    console.log('page load success');
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data:{
        city:'北京市'
      },
      success: res => {
        console.log(res);
      }
    })
  }
})
