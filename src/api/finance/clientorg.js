import request from '@/utils/request'

export function listClient(query) {
  return request({
    url: '/company/client/list',
    method: 'get',
    params: query,
  })
}

export function updateClient(data) {
  return request({
    url: '/company/client/update',
    method: 'post',
    data: data,
  })
}

export function delClient(dictId) {
  return request({
    url: '/company/client/del/' + dictId,
    method: 'delete',
  })
}


export function listClientFinanceItem(query) {
  return request({
    url: '/company/client/financeItem',
    method: 'get',
    params: query,
  })
}