import request from '@/utils/request'

export function listPeriod(query) {
  return request({
    url: '/period/list',
    method: 'get',
    params: query,
  })
}

export function listOpen(query) {
  return request({
    url: '/period/listOpen',
    method: 'get',
    params: query,
  })
}

export function addPeriod(data) {
  return request({
    url: '/period/add',
    method: 'post',
    data: data,
  })
}

export function updatePeriod(data) {
  return request({
    url: '/period/update',
    method: 'post',
    data: data,
  })
}

export function delPeriod(dictId) {
  return request({
    url: '/period/del/' + dictId,
    method: 'delete',
  })
}

export function changePeriodStatus(data) {
  return request({
    url: '/period/status/change',
    method: 'post',
    data: data,
  })
}
