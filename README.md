# bio-smart-home
A wechat control app for 2019-iGem-XJTU-CHINA team's Device

### 蓝牙对接设备

HC-08

### 数据交换接口

#### 发送数据

- char[] "11" 示意芳樟醇开
- char[] "12" 示意柠檬烯开
- char[] "21" 示意风扇全速
- char[] "22" 示意风扇半速
- char[] "23" 示意风扇静音
- char[] "31" 示意更换料包
- char[]="40"为电源关
- char[]="41"为电源开
- char[]="55"为更换料包
- char[]="d201910091403"为时间

#### 接受数据

- char[] "00" 示意无法切换
- char[] "99" 示意更换料包

### 二维码

![](./QR/gh_8af38ff9b189_258.jpg)
