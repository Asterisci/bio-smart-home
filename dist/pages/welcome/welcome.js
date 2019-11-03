// pages/welcome/welcome.js
Page({
  data: {
    deviceId: "90:9A:77:19:0E:6B",
    services: '',
    balanceData: '',
    hexstr: ''
  },

  onLoad: function(options) {

  },

  onReady: function() {
    var that = this;
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
    // setTimeout(() => {
      // wx.switchTab({
      //   url: '../index/index'
      // })
      // this.sendData("123");
    // }, 2000)
  },
  getBluetoothAdapterState() {
    var that = this;
    that.toastTitle = '检查蓝牙状态'
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
    var that = this;
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
    var that = this;
    // wx.getConnectedBluetoothDevices({
    //   services: ["5B833C11-6BC7-4802-8E9A-723CECA4BD8F"],
    //   success: function(res) {
    //     console.log(res)
    //   }
    // })
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
              if (that.data.deviceId === res.devices[i].deviceId) {
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
    var that = this;
    console.log(that.data.deviceId)
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function(res) {
        console.log(2)
        /* 4.获取连接设备的service服务 */
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
    setTimeout(() => {
      wx.getBLEDeviceServices({
        deviceId: that.data.deviceId,
        success: function(res) {
          that.setData({
            services: res.services
          })

          /* 获取连接设备的所有特征值 */
          that.getBLEDeviceCharacteristics()
        },
        fail: (res) => {}
      })
    }, 2000)
  },
  getBLEDeviceCharacteristics() {
    var that = this
    setTimeout(() => {
      wx.getBLEDeviceCharacteristics({
        deviceId: that.data.deviceId,
        serviceId: that.data.services[2].uuid,
        success: function(res) {
          console.log(res)
          for (var i = 0; i < res.characteristics.length; i++) {
            if ((res.characteristics[i].properties.notify || res.characteristics[i].properties.indicate) &&
              (res.characteristics[i].properties.read && res.characteristics[i].properties.write)) {
              console.log(res.characteristics[i].uuid, '蓝牙特征值 ==========')
              /* 获取蓝牙特征值 */
              that.setData({
                notifyCharacteristicsId: res.characteristics[i].uuid
              })
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
    var that = this;
    console.log('6.启用低功耗蓝牙设备特征值变化时的 notify 功能')
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: that.data.deviceId,
      serviceId: that.data.services[2].uuid,
      characteristicId: that.data.notifyCharacteristicsId,
      complete(res) {
        that.sendData("12")
        setTimeout(() => {
          that.sendData("12")
        },500)
        /*用来监听手机蓝牙设备的数据变化*/
          wx.onBLECharacteristicValueChange(function (res) {
            /**/
            console.log("接收数据: ",that.buf2string(res.value), that.receiveData(res.value))
          })
      },
      fail(res) {
        console.log(res, '启用低功耗蓝牙设备监听失败')
        that.measuringTip(res)
      }
    })
  },

  /*转换成需要的格式*/
  buf2string(buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    return arr.map((char, i) => {
      return String.fromCharCode(char);
    }).join('');
  },
  receiveData(buf) {
    return this.hexCharCodeToStr(this.ab2hex(buf))
  },
  /*转成二进制*/
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('')
  },
  /*转成可展会的文字*/
  hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join('');
  },
  sendData(str) {
    let that = this;
    let dataBuffer = new ArrayBuffer(str.length)
    let dataView = new DataView(dataBuffer)
    for (var i = 0; i < str.length; i++) {
      dataView.setUint8(i, str.charAt(i).charCodeAt())
    }
    let dataHex = that.ab2hex(dataBuffer);
    this.writeDatas = that.hexCharCodeToStr(dataHex);
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.services[2].uuid,
      characteristicId: that.data.notifyCharacteristicsId,
      value: dataBuffer,
      success: function(res) {
        console.log('发送的数据：' + that.writeDatas)
        console.log('message发送成功')
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  }
})