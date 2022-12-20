import React, { useEffect } from 'react'
import { ProFormText } from '@ant-design/pro-form'
import { Form, message, Modal } from 'antd'
import { updateUserPwd } from '@/api/system/user'

const ResetPwd = (props) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      oldPassword: '',
      newPassword: '',
    })
  })

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    props.onCancel(false)
  }
  const handleFinish = (values) => {
    console.log(values)
    const { oldPassword, newPassword } = values
    updateUserPwd(oldPassword, newPassword).then((res) => {
      message.success('修改成功')
      handleCancel()
    })
  }

  const checkPassword = (rule, value) => {
    const oldPassword = form.getFieldValue('oldPassword')
    if (!value) return Promise.reject()
    if (value === oldPassword) {
      // 校验条件自定义
      return Promise.reject(new Error('新密码不可以和旧密码相同'))
    }
    return Promise.resolve()
  }

  return (
    <Modal
      forceRender
      width={640}
      title={'修改密码'}
      open={props.open}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          login_password: '',
          confirm_password: '',
        }}
      >
        <ProFormText.Password
          width="xl"
          key="oldPassword"
          name="oldPassword"
          label="旧密码"
          rules={[
            {
              required: true,
              message: '旧密码不可为空。',
            },
          ]}
        />
        <ProFormText.Password
          width="xl"
          key="newPassword"
          name="newPassword"
          label="新密码"
          rules={[
            {
              required: true,
              message: '新密码不可为空',
            },
            { validator: checkPassword },
          ]}
        />
      </Form>
    </Modal>
  )
}

export default ResetPwd
