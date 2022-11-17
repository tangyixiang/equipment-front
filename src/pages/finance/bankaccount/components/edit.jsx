import React, { useEffect } from 'react'
import {
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { Form, Modal } from 'antd'

const BankAccountInfo = (props) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      id: props.values.id,
      accountName: props.values.accountName,
      aliasName: props.values.aliasName,
      account: props.values.account,
      bankName: props.values.bankName,
      openDate: props.values.openDate,
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
      title={'结算账号'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <ProFormText
          name="accountName"
          label={'开户名'}
          labelCol={{ span: 4 }}
          width="xl"
          fieldProps={{
            autoComplete: 'off',
          }}
          placeholder="请输入开户名"
          rules={[
            {
              required: true,
              message: '请输入开户名！',
            },
          ]}
        />
        <ProFormText
          name="aliasName"
          label={'账号别名'}
          labelCol={{ span: 4 }}
          width="xl"
          fieldProps={{
            autoComplete: 'off',
          }}
          placeholder="请输入账号别名"
          rules={[
            {
              required: true,
              message: '请输入账号别名！',
            },
          ]}
        />
        <ProFormText
          name="account"
          label={'账号'}
          labelCol={{ span: 4 }}
          width="xl"
          fieldProps={{
            autoComplete: 'off',
          }}
          placeholder="请输入账号"
          rules={[
            {
              required: true,
              message: '请输入账号！',
            },
          ]}
        />
        <ProFormText
          name="bankName"
          label={'开户行'}
          labelCol={{ span: 4 }}
          width="xl"
          fieldProps={{
            autoComplete: 'off',
          }}
          placeholder="请输入开户行"
          rules={[
            {
              required: true,
              message: '请输入开户行！',
            },
          ]}
        />
        <ProFormText
          name="openDate"
          label={'开户日期'}
          labelCol={{ span: 4 }}
          width="xl"
          fieldProps={{
            autoComplete: 'off',
          }}
          placeholder="请输入开户日期"
          rules={[
            {
              required: true,
              message: '请输入开户日期！',
            },
          ]}
        />
      </Form>
    </Modal>
  )
}

export default BankAccountInfo
