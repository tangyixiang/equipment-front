import React, { useEffect } from 'react'
import {
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'

const ConfigForm = (props) => {
  const [form] = Form.useForm()

  const { configTypeOptions } = props

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      configId: props.values.configId,
      configName: props.values.configName,
      configKey: props.values.configKey,
      configValue: props.values.configValue,
      configType: props.values.configType,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
      remark: props.values.remark,
    })
  }, [form, props])

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    props.onCancel()
    form.resetFields()
  }
  const handleFinish = (values) => {
    props.onSubmit(values)
  }

  return (
    <Modal
      forceRender
      width={640}
      title={'编辑参数配置'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="configId"
              label={'参数主键'}
              width="xl"
              placeholder="请输入参数主键"
              disabled
              hidden={!props.values.configId}
              rules={[
                {
                  required: false,
                  message: '请输入参数主键！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="configName"
              label={'参数名称'}
              width="xl"
              placeholder="请输入参数名称"
              rules={[
                {
                  required: false,
                  message: '请输入参数名称！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="configKey"
              label={'参数键名'}
              width="xl"
              placeholder="请输入参数键名"
              rules={[
                {
                  required: false,
                  message: '请输入参数键名！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea
              name="configValue"
              label={'参数键值'}
              width="xl"
              placeholder="请输入参数键值"
              rules={[
                {
                  required: false,
                  message: '请输入参数键值！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormRadio.Group
              valueEnum={configTypeOptions}
              name="configType"
              label={'系统内置'}
              width="xl"
              labelCol={{ span: 24 }}
              placeholder="请输入系统内置"
              rules={[
                {
                  required: false,
                  message: '请输入系统内置！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea
              name="remark"
              label={'备注'}
              width="xl"
              placeholder="请输入备注"
              rules={[
                {
                  required: false,
                  message: '请输入备注！',
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ConfigForm
