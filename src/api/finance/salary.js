import request from '@/utils/request'

export function listSalary(query) {
  return request({
    url: '/employee/salary/list',
    method: 'get',
    params: query,
  })
}

export function uploadSalary(period, fileList) {
  let params = new FormData()
  fileList.forEach((file) => {
    params.append('file', file)
  })
  let path = '/employee/salary/upload?' + 'period=' + period
  return request.post(path, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function salaryReport(param) {
  return request({
    url: '/report/employee/salary',
    method: 'post',
    data: param,
  })
}
