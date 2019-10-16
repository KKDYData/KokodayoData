# ArkinightsData

## 安装

1. yarn / npm i
2. 解压theme.zip。考虑到国内安装Sass困难，但是整个theme文件夹放上来又不是很好，所以提供了压缩包。

### 运行

yarn start / npm start
打开 <http://localhost:8080>
webpack 已经配置好局域网内的访问，可以用手机访问<http://局域网地址:8080>

### 更新

1. 晚些时候把处理拆包的脚本也整理过来
2. 有问题尽管提，我也尽力（管鸽）做
3. 想要包养服务器的话，可以往支付宝打钱
   * 上次赫拉格池子当天UV6k，PV400k，9月份流量在150G，估计今年消费大概在800-1500，因为有120的优惠服务器(阿里云最低配 1M带宽，因为数据和图片基本放在OSS，而且有CDN，PWA做的还行，1M暂时还够用）和1元域名。
   * 之后会把服务器流水也在这边放出来
   <img src="./assets/支付宝.png" width = "300" alt="图片名称" />

### 其它

 1. 因为我还不怎么会写Markdown，所以文档更新可能有点慢。
 2. 这其实是第一个用VUE写的个人项目，（虽然有个E7的前身），所以也非常欢迎指出问题。

### 数据来源

1. 拆包数据<https://github.com/Perfare/ArknightsGameData>
2. 掉落统计<https://penguin-stats.io/>

### 缓存

1. 语音选择用 Cache-Time 进行7天的缓存。
   1. 因为语音挺大的，替用户着想。
   2. 要想用 serverWorker 缓存那只能 preCache，提前显示的缓存。比较麻烦。因为运行时拿到的数据是不完整的。
2. 其它数据都是采用 workbox 运行时缓存的。网页文件为预缓存。
