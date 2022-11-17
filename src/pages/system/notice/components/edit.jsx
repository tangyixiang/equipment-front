import React, { useEffect } from 'react'
import {
  ProFormDigit,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormRadio,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'

const NoticeForm = (props) => {
  const [form] = Form.useForm()

  const { noticeTypeOptions, statusOptions } = props

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      noticeId: props.values.noticeId,
      noticeTitle: props.values.noticeTitle,
      noticeType: props.values.noticeType,
      noticeContent: props.values.noticeContent,
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
      width={640}
      title={'编辑通知公告'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="noticeId"
              label={'公告ID'}
              width="xl"
              placeholder="请输入公告ID"
              disabled
              hidden={!props.values.noticeId}
              rules={[
                {
                  required: false,
                  message: '请输入公告ID！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="noticeTitle"
              label={'公告标题'}
              width="xl"
              placeholder="请输入公告标题"
              rules={[
                {
                  required: true,
                  message: '请输入公告标题！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              valueEnum={noticeTypeOptions}
              name="noticeType"
              label={'公告类型'}
              width="xl"
              placeholder="请输入公告类型"
              rules={[
                {
                  required: true,
                  message: '请输入公告类型！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea
              name="noticeContent"
              label={'公告内容'}
              width="xl"
              placeholder="请输入公告内容"
              rules={[
                {
                  required: false,
                  message: '请输入公告内容！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormRadio.Group
              valueEnum={statusOptions}
              name="status"
              label={'公告状态'}
              width="xl"
              labelCol={{ span: 24 }}
              placeholder="请输入公告状态"
              rules={[
                {
                  required: false,
                  message: '请输入公告状态！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
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

export default NoticeForm
