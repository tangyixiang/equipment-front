import request from '@/utils/request'

export function listTaskLog(query) {
  return request({
    url: '/task/log/list',
    method: 'get',
    params: query,
  })
}

export function runTask(data) {
  return request({
    url: '/task/run',
    method: 'post',
    data: data,
  })
}
