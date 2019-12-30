# ArkinightsData

## 安装

1. yarn / npm i
2. 解压theme.zip。考虑到国内安装Sass困难，但是整个theme文件夹放上来又不是很好，所以提供了压缩包。

### 运行

yarn start / npm start
打开 <http://localhost:8080>
webpack 已经配置好局域网内的访问，可以用手机访问<http://局域网地址:8080>

### Todo

1. 适配新地图模块
   1. 分离出地图组件

#### 2019/11/24
- [ ] 配合新域名kokodayo，做一个新的顶栏
- [ ] 基建页面
- [ ] 种族/阵营筛选
- [ ] 评论功能
- [ ] 从服务器获取更新信息的api
- [ ] 整合拆包数据处理的脚本进来
- [ ] dps图
- [ ] 地图重构
- [x] spine小人
- [x] 皮肤页面

### 包养二维码

   <img src="./assets/zfb.reszie.png" width = "300" alt="图片名称" />
   <img src="./assets/wx.reszie.png" width = "300" alt="图片名称" />

### 其它

 因为找到工作了，所以一般周末才会有功能更新。例如危机合约，周二更新，但是周三到周五下班之后我也在肝危机合约，所以，危机合约的地图数据等到周日才更新。。。（我太菜了）


### 数据来源

1. 拆包数据<https://github.com/Perfare/ArknightsGameData>
2. 掉落统计<https://penguin-stats.io/>

### 缓存

- 其实以国内的网速，是不需要缓存的。但是缓存可以给我服务器省钱。
 
1. 语音选择用 Cache-Time 进行7天的缓存。
   1. 因为语音挺大的，替用户着想。
   2. 要想用 serverWorker 缓存那只能 preCache，提前显示的缓存。比较麻烦。因为运行时拿到的数据是不完整的。
2. 其它数据都是采用 workbox 运行时缓存的。网页文件为预缓存。
