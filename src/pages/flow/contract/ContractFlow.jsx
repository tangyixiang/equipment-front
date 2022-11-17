import { Form, Row, Button, Input, Card, Select, Space } from 'antd'
import React from 'react'
import { ProFormText, ProFormSelect } from '@ant-design/pro-form'
import OFormCell from '@/components/OForm/OFormCell'
// import './home.scss'

function ContractFlow() {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log('Success:', values)
  }

  return (
    <>
      <Card
        title="合同信息"
        extra={
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button type="primary">返回</Button>
          </Space>
        }
      >
        <Form form={form} onFinish={onFinish}>
          <Row className="border-[0.5px] border-solid border-gray-200 mt-[-0.5px]">
            <OFormCell
              name="htmc"
              label="合同名称"
              iptCell={<Input autoComplete="off" />}
              rules={[
                {
                  required: true,
                  message: '请输入合同号!',
                },
              ]}
            />
            <OFormCell
              name="htbh"
              label="合同编号"
              iptCell={<Input autoComplete="off" />}
            />
          </Row>
          <Row className="border-[0.5px] border-solid border-gray-200 mt-[-0.5px]">
            <OFormCell
              name="htje"
              label="合同金额(元)"
              iptCell={<Input autoComplete="off" />}
            />
            <OFormCell
              name="htlx"
              label="合同类型"
              iptCell={
                <Select allowClear>
                  <Select.Option value="1">新的合同</Select.Option>
                  <Select.Option value="2">重建合同</Select.Option>
                </Select>
              }
            />
          </Row>
        </Form>
      </Card>
    </>
  )
}

export default ContractFlow
