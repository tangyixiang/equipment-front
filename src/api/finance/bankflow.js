import request from '@/utils/request'

export function listBankFlow(query) {
  return request({
    url: '/bank/flow/list',
    method: 'get',
    params: query,
  })
}

export function uploadValidate(account, startDate, endDate, file) {
  let params = new FormData()
  params.append('file', file)
  let path =
    '/bank/flow/uploadValidate?' +
    'account=' +
    account +
    '&startDate=' +
    startDate +
    '&endDate=' +
    endDate
  return request.post(path, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function uploadFlow(account, startDate, endDate, fileList) {
  let params = new FormData()
  fileList.forEach((file) => {
    params.append('file', file)
  })
  let path =
    '/bank/flow/upload?' +
    'account=' +
    account +
    '&startDate=' +
    startDate +
    '&endDate=' +
    endDate
  return request.post(path, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
