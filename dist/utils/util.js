  /*转换成需要的格式*/
  var app = getApp()

  function buf2string(buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    return arr.map((char, i) => {
      return String.fromCharCode(char);
    }).join('');
  }

  function receiveData(buf) {
    return this.hexCharCodeToStr(this.ab2hex(buf))
  }
  /*转成二进制*/
  function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('')
  }
  /*转成可展会的文字*/
  function hexCharCodeToStr(hexCharCodeStr) {
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
  }

  function sendData(str) {
    let that = this;
    let dataBuffer = new ArrayBuffer(str.length)
    let dataView = new DataView(dataBuffer)
    for (var i = 0; i < str.length; i++) {
      dataView.setUint8(i, str.charAt(i).charCodeAt())
    }
    let dataHex = that.ab2hex(dataBuffer);
    this.writeDatas = that.hexCharCodeToStr(dataHex);
    console.log("发送数据")
    wx.writeBLECharacteristicValue({
      deviceId: app.globalData.deviceId,
      serviceId: app.globalData.services[2].uuid,
      characteristicId: app.globalData.notifyCharacteristicsId,
      value: dataBuffer,
      success: function(res) {
        console.log('发送的数据：' + that.writeDatas)
        console.log('message发送成功')
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  }

  module.exports = {
    receiveData: receiveData,
    sendData: sendData,
    buf2string: buf2string,
    ab2hex: ab2hex,
    hexCharCodeToStr: hexCharCodeToStr
  }