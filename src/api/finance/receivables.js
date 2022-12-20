import request from '@/utils/request'

export function listReceivable(query) {
  const { pageNum, pageSize } = query
  const pageParam = { pageNum, pageSize }
  return request({
    url: '/company/receivable/list',
    method: 'post',
    params: pageParam,
    data: query,
  })
}

export function delInitData(data) {
  return request({
    url: '/company/receivable/delInitData',
    method: 'post',
    data: data,
  })
}

export function matchBankFlow(dzIds, bankIds) {
  const data = {
    receivablesIds: dzIds,
    bankFlowIds: bankIds,
  }
  return request({
    url: '/company/receivable/match',
    method: 'post',
    data: data,
  })
}

export function cancelReceivable(dzIds) {
  const data = {
    receivablesIds: dzIds,
  }
  return request({
    url: '/company/receivable/cancel',
    method: 'post',
    data: data,
  })
}
