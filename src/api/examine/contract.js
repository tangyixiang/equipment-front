import request from '@/utils/request'

export function listContract(query) {
  return request({
    url: '/contract/list',
    method: 'get',
    params: query,
  })
}

export function addContract(data) {
  return request({
    url: '/contract/add',
    method: 'post',
    data: data,
  })
}

export function updateContract(data) {
  return request({
    url: '/contract/update',
    method: 'post',
    data: data,
  })
}

export function delContract(dictId) {
  return request({
    url: '/contract/del/' + dictId,
    method: 'delete',
  })
}
