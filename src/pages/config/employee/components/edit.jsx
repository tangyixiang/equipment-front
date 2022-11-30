import React, { useEffect, useState, useRef } from 'react'
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col, message } from 'antd'
import Extension from './Extension'
import {
  transFormEditTableSelectData,
  transFormEditTableOptions,
} from '@/utils/dictUtils'

const EmployeeForm = (props) => {
  const [form] = Form.useForm()
  const formRef = useRef()
  // 员工ID
  const [userId, setUserId] = useState('')
  const [inspectionOpt, setInspectionOpt] = useState({})
  const [dimensionKeyOpt, setDimensionKeyOpt] = useState({})

  const { posts, depts } = props

  useEffect(() => {
    form.resetFields()
    setUserId(props.values.id)
    form.setFieldsValue({
      id: props.values.id,
      userCode: props.values.userCode,
      deptId: props.values.deptId,
      postId: props.values.postId,
      nickName: props.values.nickName,
      status: props.values.status,
      hireType: props.values.extensionData?.hireType,
      certificate: props.values.extensionData?.certificate,
      dimensions: props.values.extensionData?.dimensions,
    })
  }, [form, props])

  useEffect(() => {
    transFormEditTableSelectData('inspection_dict', setInspectionOpt)
    transFormEditTableOptions('user_extension_dict_type', setDimensionKeyOpt)
  }, [])

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    props.onCancel()
    form.resetFields()
  }
  const handleFinish = async (values) => {
    // console.log('最后提交数据', values)
    props.onSubmit(values)
  }

  return (
    <Modal
      forceRender
      width={'70%'}
      title={'职员信息'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        onFinish={handleFinish}
        layout="horizontal"
        submitter={false}
        formRef={formRef}
      >
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="userCode"
              label={'职员编号'}
              labelCol={{ span: 2 }}
              placeholder="请输入职员编号"
              rules={[
                {
                  required: true,
                  message: '请输入职员编号！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="nickName"
              label={'职员名称'}
              labelCol={{ span: 4 }}
              placeholder="请输入职员名称"
              rules={[
                {
                  required: true,
                  message: '请输入职员名称！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormTreeSelect
              name="deptId"
              label={'职员部门'}
              labelCol={{ span: 4 }}
              request={async () => {
                return depts
              }}
              placeholder="请输入职员部门"
              rules={[
                {
                  required: true,
                  message: '请输入职员部门！',
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormSelect
              name="postId"
              // mode="multiple"
              label={'职员岗位'}
              labelCol={{ span: 4 }}
              options={posts}
              placeholder="请选择职员岗位"
              rules={[{ required: true, message: '请选择职员岗位!' }]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormSelect
              name="roleId"
              mode="multiple"
              label={'职员职务'}
              labelCol={{ span: 4 }}
              options={null}
              placeholder="请选择职员职务"
              rules={[{ required: false, message: '请选择职员职务!' }]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormSelect
              name="hireType"
              label={'人员性质'}
              labelCol={{ span: 4 }}
              options={[
                {
                  value: '1',
                  label: '在编',
                },
                {
                  value: '2',
                  label: '聘用',
                },
              ]}
              placeholder="请选择人员性质"
              rules={[{ required: true, message: '请选择人员性质!' }]}
            />
          </Col>
          <Col span={12} order={1}>
            <ProFormSelect
              name="status"
              label={'职员状态'}
              labelCol={{ span: 4 }}
              options={[
                {
                  value: '0',
                  label: '启用',
                },
                {
                  value: '1',
                  label: '禁用',
                },
              ]}
              placeholder="请选择职员状态"
              rules={[{ required: true, message: '请选择职员状态!' }]}
            />
          </Col>
        </Row>
        <Extension
          inspectionOpt={inspectionOpt}
          dimensionKeyOpt={dimensionKeyOpt}
          formRef={formRef}
        />
      </ProForm>
    </Modal>
  )
}

export default EmployeeForm
