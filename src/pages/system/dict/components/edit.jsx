import React, { useEffect } from 'react'
import {
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { Form, Modal } from 'antd'

const DictTypeForm = (props) => {
  const [form] = Form.useForm()

  const { statusOptions } = props

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      dictId: props.values.dictId,
      dictName: props.values.dictName,
      dictType: props.values.dictType,
      status: props.values.status,
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
      title={'编辑DictType'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <ProFormText
          name="dictId"
          label={'字典主键'}
          width="xl"
          placeholder="请输入字典主键"
          disabled
          // hidden={!props.values.dictId}
          rules={[
            {
              required: false,
              message: '请输入字典主键！',
            },
          ]}
        />
        <ProFormText
          name="dictName"
          label={'字典名称'}
          width="xl"
          placeholder="请输入字典名称"
          rules={[
            {
              required: false,
              message: '请输入字典名称！',
            },
          ]}
        />
        <ProFormText
          name="dictType"
          label={'字典类型'}
          width="xl"
          placeholder="请输入字典类型"
          rules={[
            {
              required: false,
              message: '请输入字典类型！',
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={'状态'}
          width="xl"
          labelCol={{ span: 24 }}
          placeholder="请输入状态"
          rules={[
            {
              required: false,
              message: '请输入状态！',
            },
          ]}
        />
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
      </Form>
    </Modal>
  )
}

export default DictTypeForm
