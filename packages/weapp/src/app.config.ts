export default {
  pages: ['pages/index/index', 'pages/char/char', 'pages/dps/dps'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  usingComponents: {
    iconfont: 'components/Icon/weapp/weapp',
  },
  useExtendedLib: {
    weui: true,
  },
}
