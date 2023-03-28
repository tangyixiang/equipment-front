import React from 'react'
import { ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { Row, Col } from 'antd'

function FromContent(props) {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProFormText
            name="period"
            label={'会计期间'}
            labelCol={{ span: 6 }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProFormText
            name="value"
            label={'凭证号起始值'}
            labelCol={{ span: 6 }}
          />
        </Col>
      </Row>
    </>
  )
}

export default FromContent
