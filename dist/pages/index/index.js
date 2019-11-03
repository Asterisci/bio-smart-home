// pages/index/index.js
var util = require("./../../utils/util.js")

Page({
  data: {
    status: 'auto',
    statusType: ['auto', 'full speed', 'silence'],
    statusNum: 0,
    linalool: '123',
    cinene: '456',
    powerType: 'success',
    powerWord: 'on'
  },
  switchStatus() {
    if (this.data.statusNum != 2) {
      this.setData(this.data.statusNum++)
    } else {
      this.setData({
        statusNum: 0
      })
    }
    this.setData({
      status : this.data.statusType[this.data.statusNum]
    })
    if(this.data.statusNum == 0){
      util.sendData("22")
    }
    if (this.data.statusNum == 1) {
      util.sendData("21")
    }
    if (this.data.statusNum == 2) {
      util.sendData("23")
    }
  }
})