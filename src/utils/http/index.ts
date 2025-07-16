import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiStatus } from './status'
import { HttpError, handleError, showError } from './error'
import { $t } from '@/locales'
import { LoginDeviceTypeEnum } from '@/enums/auth'

// 常量定义
const REQUEST_TIMEOUT = 15000 // 请求超时时间(毫秒)
const LOGOUT_DELAY = 1000 // 退出登录延迟时间(毫秒)
const MAX_RETRIES = 2 // 最大重试次数
const RETRY_DELAY = 1000 // 重试延迟时间(毫秒)

// 扩展 AxiosRequestConfig 类型
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean
}

const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT, // 请求超时时间(毫秒)
  baseURL: VITE_API_URL, // API地址
  withCredentials: VITE_WITH_CREDENTIALS === 'true', // 是否携带cookie，默认关闭
  transformRequest: [(data) => JSON.stringify(data)], // 请求数据转换为 JSON 字符串
  validateStatus: (status) => status >= 1 && status < 500, // 只接受 2xx 的状态码
  headers: {
    get: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    post: { 'Content-Type': 'application/json;charset=utf-8' }
  },
  transformResponse: [
    (data, headers) => {
      // 如果data已经是对象，直接返回
      if (typeof data === 'object' && data !== null) {
        return data
      }

      // 如果data是字符串，尝试解析为JSON
      if (typeof data === 'string') {
        try {
          return JSON.parse(data)
        } catch {
          // 如果解析失败，检查Content-Type
          const contentType = headers['content-type']
          if (contentType && contentType.includes('application/json')) {
            // Content-Type是JSON但解析失败，可能是格式问题
            console.warn('后端数据返回格式解析异常:', data)
          }
          return data
        }
      }
      return data
    }
  ]
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const { accessToken } = useUserStore()

    // 设置 token 和 请求头
    request.headers.set('DEVICE', LoginDeviceTypeEnum.PC.toString())
    if (accessToken) {
      request.headers.set('X-ICODE-AUTHENTICATION', accessToken)
      request.headers.set('Content-Type', 'application/json')
    }

    return request
  },
  (error) => {
    showError(new HttpError($t('httpMsg.requestConfigError'), ApiStatus.error))
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<Api.Http.BaseResponse>) => {
    // 确保response.data是对象
    let responseData = response.data

    // 如果response.data是字符串，尝试解析为JSON
    if (typeof responseData === 'string') {
      try {
        responseData = JSON.parse(responseData)
        response.data = responseData
      } catch {
        console.warn('Failed to parse response data as JSON:', responseData)
        throw new HttpError('Invalid JSON response', ApiStatus.error)
      }
    }

    // 确保responseData是对象且有code属性
    if (typeof responseData !== 'object' || responseData === null) {
      console.warn('Response data is not an object:', responseData)
      throw new HttpError('Invalid response format', ApiStatus.error)
    }

    const { code, message } = responseData

    // 确保code存在
    if (code === undefined || code === null) {
      console.warn('Response missing code property:', responseData)
      throw new HttpError('Response missing code property', ApiStatus.error)
    }

    // console.log('Response data:', responseData)
    // console.log('Response code:', code)

    switch (code) {
      case ApiStatus.success:
        return response
      case ApiStatus.unauthorized:
        logOut()
        throw new HttpError(message || $t('httpMsg.unauthorized'), ApiStatus.unauthorized)
      default:
        throw new HttpError(message || $t('httpMsg.requestFailed'), code)
    }
  },
  (error) => {
    return Promise.reject(handleError(error))
  }
)

// 请求重试函数
async function retryRequest<T>(
  config: ExtendedAxiosRequestConfig,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await request<T>(config)
  } catch (error) {
    if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return retryRequest<T>(config, retries - 1)
    }
    throw error
  }
}

// 判断是否需要重试
function shouldRetry(statusCode: number): boolean {
  return [
    ApiStatus.requestTimeout,
    ApiStatus.internalServerError,
    ApiStatus.badGateway,
    ApiStatus.serviceUnavailable,
    ApiStatus.gatewayTimeout
  ].includes(statusCode)
}

// 请求函数
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
  // 对 POST | PUT 请求特殊处理
  if (config.method?.toUpperCase() === 'POST' || config.method?.toUpperCase() === 'PUT') {
    if (config.params && !config.data) {
      config.data = config.params
      config.params = undefined
    }
  }

  try {
    const res = await axiosInstance.request<Api.Http.BaseResponse<T>>(config)
    return res.data.data as T
  } catch (error) {
    if (error instanceof HttpError) {
      console.log(error)
      // 根据配置决定是否显示错误消息
      const showErrorMessage = config.showErrorMessage !== false
      showError(error, showErrorMessage)
    }
    return Promise.reject(error)
  }
}

// API 方法集合
const api = {
  get<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: 'GET' })
  },
  post<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: 'POST' })
  },
  put<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: 'PUT' })
  },
  del<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: 'DELETE' })
  },
  request<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config })
  }
}

// 退出登录函数
const logOut = (): void => {
  setTimeout(() => {
    useUserStore().logOut()
  }, LOGOUT_DELAY)
}

export default api
