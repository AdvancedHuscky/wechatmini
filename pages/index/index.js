const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow':'雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

Page({
  data: {
    nowTemp: '',
    nowWheater: '',
    nowWeatherBackground:'',
    nowForecast:[],
    todayTemp:'',
    todayDate:'',
    city:'广州市',
    getLocationTips:'点击获取当前位置'
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      success: res => {
        let result = res.data.result;
        this.setHours(result);
        this.setToday(result);
        this.showWeatherToday(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh();
    });
  },
  onLoad(){
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    });
    this.getNow();
  },
  setHours(result){
    let forecast = result.forecast;
    let nowHours = new Date().getHours();
    let nowForecast = [];
    for (let i = 0; i < 8; i++) {
      nowForecast.push({
        time: (i * 3 + nowHours) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    this.setData({
      nowForecast
    })
  },
  showWeatherToday(result){
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: `/images/${weather}-bg.png`,
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setToday(result){
    let date = new Date();
    this.setData({
      todayTemp:`${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather(){
    wx.navigateTo({
      url: '/pages/list/list?city='+this.data.city,
    })
  },
  onTapLocation(){
    wx.getLocation({
      success:res=>{
        this.qqmapsdk.reverseGeocoder({
          location:{
            latitude:res.latitude,
            longitude:res.longitude
          },
          success:res=>{
            let city = res.result.address_component.city;
            this.setData({
              city,
              getLocationTips:''
            })
          }
        })
      }
    })
    this.getNow();
  }
})
