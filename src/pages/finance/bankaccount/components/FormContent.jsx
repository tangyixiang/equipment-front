import React from 'react'
import { ProFormText } from '@ant-design/pro-form'

function FormContent() {
  return (
    <>
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
    </>
  )
}

export default FormContent
