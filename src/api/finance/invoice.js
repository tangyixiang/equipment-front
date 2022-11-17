import request from '@/utils/request'

export function listOperating(query) {
  return request({
    url: '/invoice/operating/list',
    method: 'get',
    params: query,
  })
}

export function listFinance(query) {
  return request({
    url: '/invoice/finance/list',
    method: 'get',
    params: query,
  })
}

export function uploadInvoice(path, fileList) {
  let params = new FormData()
  fileList.forEach((file) => {
    params.append('file', file)
  })

  return request.post(path, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}