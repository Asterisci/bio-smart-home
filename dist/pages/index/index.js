// pages/index/index.js
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
  onReady: function() {

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
      status : this.data.statusType[statusNum]
    })
  }
})