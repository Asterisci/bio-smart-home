// pages/welcome/welcome.js
var util = require("./../../utils/util.js")
var app = getApp()

Page({
  data: {
    text: ''
  },
  onReady: function() {
    var that = this
    that.setData({
      text: 'opening bluetooth adapter...'
    })
    wx.openBluetoothAdapter({
      success: function(res) {
        /* 获取本机的蓝牙状态 */
        setTimeout(() => {
          that.getBluetoothAdapterState()
        }, 1000)
      },
      fail: function(err) {
        console.log(err)
        // 初始化失败
      }
    })
  },
  getBluetoothAdapterState() {
    var that = this
    that.setData({
      text: 'checking bluetooth adapter...'
    })
    wx.getBluetoothAdapterState({
      success: function(res) {
        that.startBluetoothDevicesDiscovery()
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    var that = this
    that.setData({
      text: 'searching device...'
    })
    setTimeout(() => {
      wx.startBluetoothDevicesDiscovery({
        success: function(res) {
          /* 获取蓝牙设备列表 */
          that.getBluetoothDevices()
        },
        fail(res) {}
      })
    }, 1000)
  },
  getBluetoothDevices() {
    var that = this
    that.setData({
      text: 'connecting device...'
    })
    setTimeout(() => {
      wx.getBluetoothDevices({
        services: [],
        allowDuplicatesKey: false,
        interval: 0,
        success: function(res) {
          if (res.devices.length > 0) {
            console.log(res)
            // "20:19:08:16:30:15"
            for (let i = 0; i < res.devices.length; i++) {
              if (app.globalData.deviceId === res.devices[i].deviceId) {
                setTimeout(() => {
                  that.connectTO();
                }, 2000);
              };
            }
          }
        },
        fail(res) {
          console.log(res, '获取蓝牙设备列表失败=====')
        }
      })
    }, 5000)
  },
  connectTO() {
    var that = this
    console.log(app.globalData.deviceId)
    wx.createBLEConnection({
      deviceId: app.globalData.deviceId,
      success: function(res) {
        that.getBLEDeviceServices();
        wx.stopBluetoothDevicesDiscovery({
          success: function(res) {
            console.log(res, '停止搜索')
          },
          fail(res) {}
        })
      },
      fail: function(res) {}
    })
  },
  getBLEDeviceServices() {
    var that = this
    that.setData({
      text: 'getting BLE device...'
    })
    setTimeout(() => {
      wx.getBLEDeviceServices({
        deviceId: app.globalData.deviceId,
        success: function(res) {
          app.globalData.services = res.services
          /* 获取连接设备的所有特征值 */
          that.getBLEDeviceCharacteristics()
        },
        fail: (res) => {}
      })
    }, 2000)
  },
  getBLEDeviceCharacteristics() {
    var that = this
    that.setData({
      text: 'getting characteristics of BLE device...'
    })
    setTimeout(() => {
      wx.getBLEDeviceCharacteristics({
        deviceId: app.globalData.deviceId,
        serviceId: app.globalData.services[2].uuid,
        success: function(res) {
          console.log(res)
          for (var i = 0; i < res.characteristics.length; i++) {
            if ((res.characteristics[i].properties.notify || res.characteristics[i].properties.indicate) &&
              (res.characteristics[i].properties.read && res.characteristics[i].properties.write)) {
              console.log(res.characteristics[i].uuid, '蓝牙特征值 ==========')
              /* 获取蓝牙特征值 */
              app.globalData.notifyCharacteristicsId = res.characteristics[i].uuid
              // 启用低功耗蓝牙设备特征值变化时的 notify 功能
              that.notifyBLECharacteristicValueChange()
            }
          }
        },
        fail: function(res) {}
      })
    }, 1000)
  },
  notifyBLECharacteristicValueChange() { // 启用低功耗蓝牙设备特征值变化时的 notify 功能
    var that = this
    that.setData({
      text: 'starting notice of BLE device...'
    })
    console.log('6.启用低功耗蓝牙设备特征值变化时的 notify 功能')
    console.log(app.globalData)
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: app.globalData.deviceId,
      serviceId: app.globalData.services[2].uuid,
      characteristicId: app.globalData.notifyCharacteristicsId,
      complete(res) {
        /*用来监听手机蓝牙设备的数据变化*/
        wx.onBLECharacteristicValueChange(function(res) {
          if (util.receiveData(res.value) == 0){
            wx.showToast({
              title: 'Please wait for bacteria to respond. \n At least 30 minutes is required',
              icon: 'none',
              duration: 5000
            })
          }
          if (util.receiveData(res.value) == 99) {
            wx.showToast({
              title: 'Please change the Package',
              icon: 'none',
              duration: 5000
            })
          }
          console.log("接收数据")
          console.log(util.buf2string(res.value))
          console.log(util.receiveData(res.value))
        })
        wx.showToast({
          title: 'Success Paired',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index'
          })
        }, 2000)
      },
      fail(res) {
        console.log(res, '启用低功耗蓝牙设备监听失败')
        that.measuringTip(res)
      }
    })
  }
})