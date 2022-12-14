import axios from 'axios'
import { message } from 'antd'
import errorCode from './errorCode'
import { blobValidate, tansParams } from './common'
import { saveAs } from 'file-saver'
import { getAccessToken, getTokenExpireTime, clearSessionToken } from './access'
import history from './history'

let tokenExpireMessage = true

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.REACT_APP_BASE_URL,
  // 超时
  timeout: 60 * 1000,
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // console.log(isToken)
    if (!isToken && getTokenExpireTime() <= Date.parse(new Date())) {
      tokenExpire()
    }
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getAccessToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res.data
    }
    if (code === 401) {
      tokenExpire()
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 403) {
      clearSessionToken()
      message.error(msg)
      return Promise.reject(new Error(msg))
    } else if (code === 500) {
      message.error(msg)
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      message.error(msg)
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  (error) => {
    console.log('err' + error)
    let msg = error.message
    if (msg == 'Network Error') {
      msg = '后端接口连接异常'
    } else if (msg.includes('timeout')) {
      msg = '系统接口请求超时'
    } else if (msg.includes('Request failed with status code')) {
      msg = '系统接口' + msg.substr(msg.length - 3) + '异常'
    }
    message.error(msg, 5)
    return Promise.reject(error)
  }
)

// 通用下载方法
// export function download(url, params, filename) {
//   return service
//     .post(url, params, {
//       transformRequest: [
//         (params) => {
//           return tansParams(params)
//         },
//       ],
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       responseType: 'blob',
//     })
//     .then(async (data) => {
//       const isLogin = await blobValidate(data)
//       if (isLogin) {
//         const blob = new Blob([data])
//         saveAs(blob, filename)
//       } else {
//         const resText = await data.text()
//         const rspObj = JSON.parse(resText)
//         const errMsg =
//           errorCode[rspObj.code] || rspObj.msg || errorCode['default']
//         message.error(errMsg)
//       }
//     })
//     .catch((r) => {
//       console.error(r)
//       message.error('下载文件出现错误，请联系管理员！')
//     })
// }

// 通用下载方法
export function download(url, params, filename) {
  return service
    .post(url, params, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob',
    })
    .then(async (data) => {
      const isLogin = await blobValidate(data)
      if (isLogin) {
        const blob = new Blob([data])
        saveAs(blob, filename)
      } else {
        const resText = await data.text()
        const rspObj = JSON.parse(resText)
        const errMsg =
          errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        message.error(errMsg)
      }
    })
    .catch((r) => {
      console.error(r)
      message.error('下载文件出现错误，请联系管理员！')
    })
}

function tokenExpire() {
  if (tokenExpireMessage) {
    tokenExpireMessage = false
    // message.error('登录状态已过期，请重新登录', 2)
    clearSessionToken()
    history.replace(process.env.REACT_APP_ACCESS_PATH + '/login')
  }
}

export default service
