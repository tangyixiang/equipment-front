import request from '@/utils/request'

export function listEmployee(query) {
  return request({
    url: '/company/employee/list',
    method: 'get',
    params: query,
  })
}

export function addEmployee(data) {
  return request({
    url: '/company/employee/add',
    method: 'post',
    data: data,
  })
}

export function updateEmployee(data) {
  return request({
    url: '/company/employee/update',
    method: 'post',
    data: data,
  })
}

export function delEmployee(dictId) {
  return request({
    url: '/company/employee/del/' + dictId,
    method: 'delete',
  })
}

export function addEmployeeExtension(data) {
  return request({
    url: '/employee/extension/add',
    method: 'post',
    data: data,
  })
}

export function updateEmployeeExtension(data) {
  return request({
    url: '/employee/extension/update',
    method: 'post',
    data: data,
  })
}

export function getEmployeeExtension(id) {
  return request({
    url: '/company/employee/' + id,
    method: 'get',
  })
}
