import request from '@/utils/request'

export function listCar(query) {
  return request({
    url: '/office/car/list',
    method: 'get',
    params: query,
  })
}

export function addCar(data) {
  return request({
    url: '/office/car/add',
    method: 'post',
    data: data,
  })
}

export function updateCar(data) {
  return request({
    url: '/office/car/update',
    method: 'post',
    data: data,
  })
}

export function delCar(dictId) {
  return request({
    url: '/office/car/del/' + dictId,
    method: 'delete',
  })
}
