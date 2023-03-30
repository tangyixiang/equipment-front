import request from '@/utils/request'

export function listBankFlow(query) {
  const { current, pageSize } = query
  const pageParam = { current, pageSize }
  return request({
    url: '/bank/flow/list',
    method: 'post',
    params: pageParam,
    data: query,
  })
}

export function listBanFlowUnReconciled(query) {
  const { current, pageSize } = query
  const pageParam = { current, pageSize }
  return request({
    url: '/bank/flow/listUnReconcile',
    method: 'post',
    params: pageParam,
    data: query,
  })
}

export function uploadValidate(account, startDate, endDate, period, file) {
  let params = new FormData()
  params.append('file', file)
  params.append('account', account)
  params.append('startDate', startDate)
  params.append('endDate', endDate)
  params.append('period', period)

  return request.post('/bank/flow/uploadValidate', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function uploadFlow(account, startDate, endDate, period, fileList) {
  let params = new FormData()
  fileList.forEach((file) => {
    params.append('file', file)
  })

  params.append('account', account)
  params.append('startDate', startDate)
  params.append('endDate', endDate)
  params.append('period', period)
  return request.post('/bank/flow/upload', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
