/**
 * 登录类型枚举
 */
export enum LoginDeviceTypeEnum {
  PC = 1,
  DESKTOP = 2,
  ANDROID = 3,
  IOS = 4,
  MACOS = 5,
  APP = 6
}

/**
 * 登录方式枚举
 */
export enum LoginTypeEnum {
  // 账号密码登录
  PASSWORD_LOGIN = 1,

  // 手机号登录
  MOBILE_NUMBER_LOGIN = 2,

  WE_CHAT_LOGIN = 3,

  QQ_LOGIN = 4
}
