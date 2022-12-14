import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

import React from 'react'

function NoFoundPage() {
  let navigate = useNavigate()
  return (
    <Result
      status="404"
      title="无法找到该页面"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  )
}

export default NoFoundPage
