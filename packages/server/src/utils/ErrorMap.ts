export const ErrorMap = {
  [-1001]: {
    code: -1001,
    msg: '二维码过期或错误二维码',
  },
  [-1002]: {
    code: -1002,
    msg: '无效token',
  },
  [-400]: {
    code: -400,
    msg: '没登录',
  },
  NO_DATA: {
    code: -404,
    msg: '找不到数据',
  },
  ERROR_ID: {
    code: -405,
    msg: 'ID 错误',
  },
} as const
