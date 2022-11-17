import React, { useEffect, useState } from 'react'
import ProForm, {
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col, Tree } from 'antd'

const RoleForm = (props) => {
  const [form] = Form.useForm()

  const { menuTree, menuCheckedKeys } = props
  const [menuIds, setMenuIds] = useState()
  const { statusOptions } = props

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      roleId: props.values.roleId,
      roleName: props.values.roleName,
      roleKey: props.values.roleKey,
      roleSort: props.values.roleSort,
      dataScope: props.values.dataScope,
      menuCheckStrictly: props.values.menuCheckStrictly,
      deptCheckStrictly: props.values.deptCheckStrictly,
      status: props.values.status,
      delFlag: props.values.delFlag,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
      remark: props.values.remark,
      menuIds: props.values.menuIds,
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
    props.onSubmit({ ...values, menuIds })
  }

  return (
    <Modal
      forceRender
      width={640}
      title={'编辑角色信息'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="roleId"
              label={'角色ID'}
              width="xl"
              placeholder="请输入角色ID"
              disabled
              hidden={!props.values.roleId}
              rules={[
                {
                  required: false,
                  message: '请输入角色ID！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="roleName"
              label={'角色名称'}
              width="xl"
              placeholder="请输入角色名称"
              rules={[
                {
                  required: true,
                  message: '请输入角色名称！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="roleKey"
              label={'角色权限字符串'}
              width="xl"
              placeholder="请输入角色权限字符串"
              rules={[
                {
                  required: true,
                  message: '请输入角色权限字符串！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="roleSort"
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
              label={'角色状态'}
              labelCol={{ span: 24 }}
              width="xl"
              placeholder="请输入角色状态"
              rules={[
                {
                  required: true,
                  message: '请输入角色状态！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProForm.Item
              // width="xl"
              name="menuIds"
              label={'菜单权限'}
            >
              <Tree
                checkable={true}
                multiple={true}
                checkStrictly={true}
                defaultExpandAll={false}
                treeData={menuTree}
                defaultCheckedKeys={menuCheckedKeys}
                onCheck={(keys) => {
                  setMenuIds(keys.checked)
                }}
              />
            </ProForm.Item>
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

export default RoleForm
