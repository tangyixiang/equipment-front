import React, { useEffect, useState, useRef } from 'react'
import ProForm, {
  ProFormDigit,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'
import Extension from './Extension'
import { transFormEditTableSelectData, transFormEditTableOptions } from '@/utils/dictUtils'

const UserForm = (props) => {
  const [form] = Form.useForm()
  const formRef = useRef();

  const [userId, setUserId] = useState('')
  const [inspectionOpt, setInspectionOpt] = useState({})
  const [dimensionKeyOpt, setDimensionKeyOpt] = useState({})

  const { sexOptions, statusOptions } = props
  const { roles, posts, depts, extensionData } = props

  useEffect(() => {
    form.resetFields()
    setUserId(props.values.userId)
    form.setFieldsValue({
      userId: props.values.userId,
      deptId: props.values.deptId,
      postIds: props.postIds,
      roleIds: props.roleIds,
      userName: props.values.userName,
      nickName: props.values.nickName,
      userType: props.values.userType,
      email: props.values.email,
      phonenumber: props.values.phonenumber,
      sex: props.values.sex,
      avatar: props.values.avatar,
      password: props.values.password,
      status: props.values.status,
      delFlag: props.values.delFlag,
      loginIp: props.values.loginIp,
      loginDate: props.values.loginDate,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
      remark: props.values.remark,
      hireType: extensionData.hireType,
      certificate: extensionData.certificate,
      dimensions: extensionData.dimensions
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
    // console.log('最后提交数据', values);
    props.onSubmit(values)
    return true
  }

  return (
    <Modal
      forceRender
      width={'70%'}
      title={'编辑用户信息'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm form={form} onFinish={handleFinish} layout='horizontal' submitter={false} formRef={formRef}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="userId"
              label={'用户ID'}
              labelCol={{ span: 2 }}

              placeholder="请输入用户ID"
              disabled
              hidden={!props.values.userId}
              rules={[
                {
                  required: false,
                  message: '请输入用户ID！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="nickName"
              label={'用户昵称'}
              labelCol={{ span: 4 }}
              placeholder="请输入用户昵称"
              rules={[
                {
                  required: true,
                  message: '请输入用户昵称！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormTreeSelect
              name="deptId"
              label={'部门'}
              labelCol={{ span: 4 }}
              request={async () => {
                return depts
              }}
              placeholder="请输入用户昵称"
              rules={[
                {
                  required: true,
                  message: '请输入用户昵称！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="phonenumber"
              label={'手机号码'}
              labelCol={{ span: 4 }}

              placeholder="请输入手机号码"
              rules={[
                {
                  required: false,
                  message: '请输入手机号码！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormText
              name="email"
              label={'用户邮箱'}
              labelCol={{ span: 4 }}

              placeholder="请输入用户邮箱"
              rules={[
                {
                  required: false,
                  message: '请输入用户邮箱！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="userName"
              label={'用户账号'}
              labelCol={{ span: 4 }}

              hidden={userId}
              placeholder="请输入用户账号"
              rules={[
                {
                  required: true,
                  message: '请输入用户账号！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormText
              name="password"
              label={'密码'}
              labelCol={{ span: 4 }}

              hidden={userId}
              placeholder="请输入密码"
              rules={[
                {
                  required: false,
                  message: '请输入密码！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormSelect
              valueEnum={sexOptions}
              name="sex"
              label={'用户性别'}
              labelCol={{ span: 4 }}

              placeholder="请输入用户性别"
              rules={[
                {
                  required: false,
                  message: '请输入用户性别！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormSelect
              valueEnum={statusOptions}
              name="status"
              label={'帐号状态'}
              labelCol={{ span: 4 }}

              placeholder="请输入帐号状态"
              rules={[
                {
                  required: false,
                  message: '请输入帐号状态！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormSelect
              name="postIds"
              mode="multiple"

              label={'岗位'}
              labelCol={{ span: 4 }}
              options={posts}
              placeholder="请选择岗位"
              rules={[{ required: true, message: '请选择岗位!' }]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormSelect
              name="roleIds"
              mode="multiple"

              label={'角色'}
              labelCol={{ span: 4 }}
              options={roles}
              placeholder="请选择角色"
              rules={[{ required: true, message: '请选择角色!' }]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              name="hireType"

              label={'人员性质'}
              labelCol={{ span: 2 }}
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
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea
              name="remark"
              label={'备注'}
              labelCol={{ span: 2 }}

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
        <Extension
          inspectionOpt={inspectionOpt}
          dimensionKeyOpt={dimensionKeyOpt}
          formRef={formRef}
        />
      </ProForm>
    </Modal>
  )
}

export default UserForm
