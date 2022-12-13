import React from 'react'
import { ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { Row, Col } from 'antd'

function FromContent(props) {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProFormSelect
            name="categoryId"
            label={'分录类别'}
            labelCol={{ span: 4 }}
            valueEnum={props.kmOptions}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProFormSelect
            name="mappingId"
            label={'科目映射关系'}
            labelCol={{ span: 4 }}
            valueEnum={props.mappingOptions}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProFormSelect
            name="itemId"
            label={'项目名称'}
            labelCol={{ span: 4 }}
            valueEnum={props.itemOptions}
            showSearch
            optionFilterProp="children"
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProFormText
            name="value"
            label={'会计科目值'}
            labelCol={{ span: 4 }}
          />
        </Col>
      </Row>
    </>
  )
}

export default FromContent
