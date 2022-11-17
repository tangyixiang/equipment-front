import request from '@/utils/request'

export function listAccount(query) {
  return request({
    url: '/bank/account/list',
    method: 'get',
    params: query,
  })
}

export function addAccount(data) {
  return request({
    url: '/bank/account/add',
    method: 'post',
    data: data,
  })
}
export function updateAccount(data) {
  return request({
    url: '/bank/account/update',
    method: 'post',
    data: data,
  })
}

export function delAccount(dictId) {
  return request({
    url: '/bank/account/del/' + dictId,
    method: 'delete',
  })
}

