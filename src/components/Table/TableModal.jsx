import React, { useEffect } from 'react'
import { ProForm } from '@ant-design/pro-form'
import { Form, Modal } from 'antd'

function TableModal(props) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(props.values)
  }, [props])

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
    <>
      <Modal
        forceRender
        width={props.content.width}
        title={props.content.title}
        open={props.visible}
        destroyOnClose
        onOk={handleOk}
        onCancel={handleCancel}
        footer={props.readOnly ? null : undefined}
      >
        <ProForm
          form={form}
          name={'ModalForm'}
          onFinish={handleFinish}
          layout="horizontal"
          submitter={false}
          readonly={props.readOnly}
          formRef={props.content.formRef}
        >
          {props.content.children}
        </ProForm>
      </Modal>
    </>
  )
}

export default TableModal
