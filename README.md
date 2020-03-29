# Kokodayo 资料站

## 包养二维码
   <img src="./assets/zfb.reszie.png" width = "300" alt="图片名称" />
   <img src="./assets/wx.reszie.png" width = "300" alt="图片名称" />

## 安装

1. yarn 
2. 解压theme.zip。考虑到国内安装Sass困难，但是整个theme文件夹放上来又不是很好，所以提供了压缩包。
   - 可能很快就不需要弄这个了。
3. 记得在```utils/listVer.js```里改改列表索引。


### Todo

#### 2020/3/30
- [ ] 种族/阵营筛选
- [ ] 评论功能
- [ ] 从服务器获取更新信息的api
- [ ] dps图
- [ ] 剧情回放
- [ ] 地图改用webgl重新实现

### 分离出来的组件
   1. [地图](https://github.com/odex21/SomeMapTest)，包含1个简单的canvas渲染模块和寻路算法。
   2. [spine小人](https://github.com/odex21/ArkSpineTest)，测试小人文件的简易框架（？）

### 更新频率
   最近有点忙，还要学习数据库。预计不会有大改动了。估计大改要等 vue3 出来再考虑一下。
   到时候应该主要是用重新用webgl 实现地图。已经用 vue3 的新写法来 弄一下剧情回放之类的功能。
   另外，等我数据库学完出山，应该就能开始弄评论系统了。
   element 4个月没更新了。迫不得已自己实现了部分组件。


### 数据来源

1. [拆包数据] github 或者 朋友拆
2. [掉落统计](https://penguin-stats.io/) 企鹅物流

### 缓存

- 其实以国内的网速，是不需要缓存的。但是缓存可以给我服务器省钱。
 
1. 语音选择用 Cache-Time 进行7天的缓存。
   1. 因为语音挺大的，替用户着想。
   2. 要想用 serverWorker 缓存那只能 preCache，提前显示的缓存。比较麻烦。因为运行时拿到的数据是不完整的。
2. 其它数据都是采用 workbox 运行时缓存的。网页文件为预缓存。
