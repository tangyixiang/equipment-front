import React, { useEffect } from 'react'
import {
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTreeSelect,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'

const DeptForm = (props) => {
  const [form] = Form.useForm()

  const { statusOptions, deptTree } = props

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      deptId: props.values.deptId,
      parentId: props.values.parentId,
      ancestors: props.values.ancestors,
      deptName: props.values.deptName,
      orderNum: props.values.orderNum,
      leader: props.values.leader,
      phone: props.values.phone,
      email: props.values.email,
      status: props.values.status,
      delFlag: props.values.delFlag,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
    })
  }, [form, props])

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    props.onCancel()
    form.resetFields()
  }
  const handleFinish = async (values) => {
    props.onSubmit(values)
  }

  return (
    <Modal
      forceRender
      width={640}
      title={'编辑部门信息'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="deptId"
              label={'部门id'}
              width="xl"
              placeholder="请输入部门id"
              disabled
              hidden={!props.values.deptId}
              rules={[
                {
                  required: false,
                  message: '请输入部门id！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTreeSelect
              name="parentId"
              label={'上级部门:'}
              request={async () => {
                return deptTree
              }}
              width="xl"
              placeholder="请选择上级部门"
              rules={[
                {
                  required: true,
                  message: '请选择上级部门!',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="ancestors"
              label={'祖级列表'}
              width="xl"
              placeholder="请输入祖级列表"
              hidden={true}
              rules={[
                {
                  required: false,
                  message: '请输入祖级列表！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="deptName"
              label={'部门名称'}
              width="xl"
              placeholder="请输入部门名称"
              rules={[
                {
                  required: false,
                  message: '请输入部门名称！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="orderNum"
              label={'显示顺序'}
              width="xl"
              placeholder="请输入显示顺序"
              rules={[
                {
                  required: false,
                  message: '请输入显示顺序！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="leader"
              label={'负责人'}
              width="xl"
              placeholder="请输入负责人"
              rules={[
                {
                  required: false,
                  message: '请输入负责人！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="phone"
              label={'联系电话'}
              width="xl"
              placeholder="请输入联系电话"
              rules={[
                {
                  required: false,
                  message: '请输入联系电话！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="email"
              label={'邮箱'}
              width="xl"
              placeholder="请输入邮箱"
              rules={[
                {
                  required: false,
                  message: '请输入邮箱！',
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
              label={'部门状态'}
              labelCol={{ span: 24 }}
              width="xl"
              placeholder="请输入部门状态"
              rules={[
                {
                  required: false,
                  message: '请输入部门状态！',
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default DeptForm
