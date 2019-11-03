// pages/setting.js
Page({
  data: {
    list: [{
        id: 'auto',
        name: 'auto module',
        open: true
      },
      {
        id: 'manual',
        name: 'mauual module',
        open: false
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
  changeLinalool(e) {
    console.log(e.detail)
  },
  changeCinene(e) {
    console.log(e.detail)
  },
  changeFan(e) {
    console.log(e.detail)
  },
  changePower(e) {
    console.log(e.detail)
  },
  changeAroma(e) {
    this.setData({
      aroma : e.detail.value
    })
    console.log(e.detail)
  },
  onReady: function() {

  }
})