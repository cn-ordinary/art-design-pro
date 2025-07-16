import request from '@/utils/http'
import type { QueryAccountDetails } from '@/types'

export class UserService {
  // 获取用户信息
  static getUserInfo() {
    return request.get<QueryAccountDetails>({
      url: '/api/user/info'
    })
  }

  // 获取用户列表
  static getUserList(params: Api.Common.PaginatingSearchParams) {
    return request.get<Api.User.UserListData>({
      url: '/api/user/list',
      params
    })
  }
}
