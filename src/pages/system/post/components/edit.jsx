import React, { useEffect } from 'react'
import {
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'

const PostForm = (props) => {
  const [form] = Form.useForm()

  const { statusOptions } = props

  useEffect(() => {
    form.resetFields()
    // form.setFieldsValue({
    //   postId: props.values.postId,
    //   postCode: props.values.postCode,
    //   postName: props.values.postName,
    //   postSort: props.values.postSort,
    //   status: props.values.status,
    //   createBy: props.values.createBy,
    //   createTime: props.values.createTime,
    //   updateBy: props.values.updateBy,
    //   updateTime: props.values.updateTime,
    //   remark: props.values.remark,
    // })
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
      title={'编辑岗位信息'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="postId"
              label={'岗位ID'}
              width="xl"
              placeholder="请输入岗位ID"
              disabled
              // hidden={!props.values.postId}
              rules={[
                {
                  required: false,
                  message: '请输入岗位ID！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="postCode"
              label={'岗位编码'}
              width="xl"
              placeholder="请输入岗位编码"
              rules={[
                {
                  required: true,
                  message: '请输入岗位编码！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="postName"
              label={'岗位名称'}
              width="xl"
              placeholder="请输入岗位名称"
              rules={[
                {
                  required: true,
                  message: '请输入岗位名称！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="postSort"
              label={'显示顺序'}
              width="xl"
              placeholder="请输入显示顺序"
              rules={[
                {
                  required: true,
                  message: '请输入显示顺序！',
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
              label={'状态'}
              width="xl"
              labelCol={{ span: 24 }}
              placeholder="请输入状态"
              rules={[
                {
                  required: true,
                  message: '请输入状态！',
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

export default PostForm
