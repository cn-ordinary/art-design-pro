/**
 * 用户状态枚举
 */
export enum AccountStatusEnum {
  // 正常
  NORMAL = 0,

  // 禁用
  FORBIDDEN = 1,

  // 冻结
  FROZEN = 2
}

/**
 * 用户所属租户类型
 */
export enum AccountTypeEnum {
  // 管理员
  TENANT_ADMIN = 0,

  // 普通用户
  ORDINARY_USER = 1
}

/**
 * 用户所属租户类型
 */
export enum BOOLEAN_ENUM {
  // 管理员
  TRUE = 1,

  // 普通用户
  FALSE = 0
}

/**
 * 用户性别类型
 */
export enum GENDER_ENUM {
  // 未知
  UNKNOWN = 0,

  // 男
  MAN = 1,

  // 女
  WOMAN = 2
}
