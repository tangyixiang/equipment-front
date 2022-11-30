import request from '@/utils/request'

export function listSubject(query) {
  return request({
    url: '/accounting/subject/list',
    method: 'get',
    params: query,
  })
}

export function addSubject(data) {
  return request({
    url: '/accounting/subject/add',
    method: 'post',
    data: data,
  })
}

export function updateSubject(data) {
  return request({
    url: '/accounting/subject/update',
    method: 'post',
    data: data,
  })
}

export function delSubject(dictId) {
  return request({
    url: '/accounting/subject/del/' + dictId,
    method: 'delete',
  })
}
