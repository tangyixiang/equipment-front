import React from 'react'
import { Breadcrumb } from 'antd'

function ABreadcrumb(props) {
  const { data } = props

  return (
    <Breadcrumb>
      {data.map((item) => (
        <Breadcrumb.Item key={item.name}>{item.name}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}

export default ABreadcrumb
