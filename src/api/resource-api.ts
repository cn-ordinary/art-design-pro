import request from '@/utils/http'
import { ServiceApiEnum } from '@/enums/service-api'
import { menuDataToRouter } from '@/router/utils/menuToRouter'
import { AppRouteRecord } from '@/types/router'

export class ResourceService {
  // 获取登录用户菜单
  static async getResourceList() {
    const menuData = await request.post<AppRouteRecord[]>({
      url: `${ServiceApiEnum.SYSTEM}/account/fetch-account-menu`
    })

    // 处理菜单数据
    const menuList = menuData.map((route) => menuDataToRouter(route))
    return menuList
  }
}
