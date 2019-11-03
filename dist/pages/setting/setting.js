// pages/setting.js
var util = require("./../../utils/util.js")

Page({
  data: {
    list: [
      {
        id: 'manual',
        name: 'mauual module',
        open: true
      }
    ],
    power: 1,
    aromaType:['linalool','cinene'],
    aroma: 0,
    linalool: 10,
    cinene: 10,
    fan: 10
  },
  kindToggle: function(e) {
    var id = e.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  changePower(e) {
    if (e.value == 0) {
      util.sendData("40")
    }else{
      util.sendData("41")
    }
    console.log(e.detail)
  },
  changeAroma(e) {
    this.setData({
      aroma : e.detail.value
    })
    if (e.value == 0) {
      util.sendData("11")
    } else {
      util.sendData("12")
    }
    console.log(e.detail)
  }
})