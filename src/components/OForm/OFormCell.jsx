import React from 'react'
import { Col, Form } from 'antd'
import './FormCellStyle.scss'

function OFormCell(props) {
  const { label, iptCell, name, rules, singleRow } = props

  return (
    <>
      <Col span={4} className="labelCell">
        <div>{label}</div>
      </Col>
      <Col span={singleRow ? 20 : 8}>
        <div className="p-1">
          <Form.Item
            className="mb-0"
            name={name}
            rules={rules ? rules : undefined}
          >
            {iptCell}
          </Form.Item>
        </div>
      </Col>
    </>
  )
}

export default OFormCell
