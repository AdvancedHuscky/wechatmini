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
//使用有含义的变量名来增加可读性
//能够使用函数名和变量名表达的信息，不应该用注释来表达。注释往往是用来传递一些设计的想法或解释不常见的实现方法
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

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
    locationAuthType: UNPROMPTED,
    locationTipsText: UNPROMPTED_TIPS
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
  onShow(){
    wx.getSetting({
      success: res=>{
        let auth = res.authSetting['scope.userLocation']
        if(auth && this.data.locationAuthType !== AUTHORIZED){//权限从无到有
          this.setData({
            locationAuthType:AUTHORIZED,
            locationTipsText:AUTHORIZED_TIPS
          })
        }
      }
    })
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
    if(this.data.locationAuthType === UNAUTHORIZED)
    wx.openSetting()
    else
    this.getLocation()
  },
  getLocation(){
    wx.getLocation({
      success:res=>{
        this.setData({
          locationAuthType: AUTHORIZED,
          locationTipsText: AUTHORIZED_TIPS
        })
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
      },
      fail:()=>{
        this.setData({
          locationAuthType: UNAUTHORIZED,
          locationTipsText: UNAUTHORIZED_TIPS
        })
      }
    })
    this.getNow();
  }
})
