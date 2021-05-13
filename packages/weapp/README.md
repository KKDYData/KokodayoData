# Development

## Windicss

1. rem rpx px
   - rem: 1rem = 16px
   - rpx: 2rpx = 1px (ipx 750px 设计稿, 375px 实际, 这里是实际px)
   - px:   1px = 1rpx (被Taro转换成rpx)
   1.  w-10 -> width: 2.5rem -> 40px -> 80rpx
   2.  w-10px  ->  width: 10rpx -> 5px
   3.  w-40px  ->  width: 40rpx -> 20px
   4.  w-375px ->  width: 375px -> 187.5px
   
   也就是 w-8px = w-1，也就是 w-8rpx。直接些的px会被转换为按二倍图750px宽对应的rpx，而rem则不会被转换，以手机的实际宽度为准。

2. 微信不支持通配符
3. 微信不支持反斜杠，所以不能写 w-1/2
4. 开发工具里跑的是chrome，具体哪些属性不兼容，还得看真机