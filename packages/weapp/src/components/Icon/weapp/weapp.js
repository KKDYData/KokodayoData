Component({
  properties: {
    // zhuye | jiahao | jianhao | saoma | xiangqing | gouxuan | bianji | cangpeitubiao_shanchu | shangbian | ziyuan23 | chuizi | leaf-line | huidaodingbu | qidongtuguanli- | guanbi | qiehuan | ren | bofang | shijianlishijilujishizhongbiaoxianxing | shandian | renwutouxiangkuang_huaban1 | zoumadengtiaotiao_huaban1 | yemianqiehuan-youjiantou | yemianqiehuan-zuojiantou | 2jw-01 | 2zz-01 | 2fz-01 | 2tz-01 | 2jj-01 | 2xf-01 | 2yl-01 | 2ss-01 | 1zz-01 | 1yl-01 | 1xf-01 | 1tz-01 | 1ss-01 | 1jw-01 | 1jj-01 | 1fz-01 | qita | sport_09 | ditu | xingshu1-01
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * wx.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 18 / 750 * wx.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
