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
Page({
  data: {
    nowTemp: '',
    nowWheater: '',
    nowWeatherBackground:'',
    nowForecast:[],
    todayTemp:'',
    todayDate:''

  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '北京市'
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
    this.getNow()
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
      url: '/pages/list/list',
    })
  }
})
