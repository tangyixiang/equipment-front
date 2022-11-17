import React, { useEffect, useState } from 'react'
import {
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'
import IconSelector from '@/components/IconSelector'
import { createIcon } from '@/utils/IconUtils'

const MenuForm = (props) => {
  const [form] = Form.useForm()

  const [menuTypeId, setMenuTypeId] = useState('')
  const [menuIconName, setMenuIconName] = useState()

  const [previewModalVisible, setPreviewModalVisible] = useState(false)

  const { menuTree, visibleOptions, statusOptions } = props
  useEffect(() => {
    form.resetFields()
    setMenuTypeId(props.values.menuType ? props.values.menuType : 'C')
    setMenuIconName(props.values.icon)
    form.setFieldsValue({
      menuId: props.values.menuId,
      menuName: props.values.menuName,
      parentId: props.values.parentId,
      orderNum: props.values.orderNum,
      path: props.values.path,
      component: props.values.component,
      isFrame: props.values.isFrame,
      isCache: props.values.isCache,
      menuType: props.values.menuType,
      visible: props.values.visible,
      status: props.values.status,
      perms: props.values.perms,
      query: props.values.query,
      icon: props.values.icon,
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
  const handleFinish = async (values) => {
    props.onSubmit(values)
  }

  return (
    <Modal
      forceRender
      width={680}
      title={'编辑菜单'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Modal
        width={1200}
        open={previewModalVisible}
        onCancel={() => {
          setPreviewModalVisible(false)
        }}
        footer={null}
      >
        <IconSelector
          onSelect={(name) => {
            form.setFieldsValue({ icon: name })
            setMenuIconName(name)
            setPreviewModalVisible(false)
          }}
        />
      </Modal>

      <Form form={form} onFinish={handleFinish}>
        <Row gutter={[16, 16]}>
          <Col span={16} order={1}>
            <ProFormDigit
              name="menuId"
              label={'菜单ID'}
              width="xl"
              placeholder="请输入菜单ID"
              disabled
              hidden={true}
              rules={[
                {
                  required: false,
                  message: '请输入菜单ID！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24} order={1}>
            <ProFormTreeSelect
              name="parentId"
              label={'父菜单:'}
              request={async () => {
                return menuTree
              }}
              width="xl"
              placeholder="请选择父菜单"
              rules={[
                {
                  required: true,
                  message: '请选择父菜单！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormRadio.Group
              valueEnum={{
                M: '目录',
                C: '菜单',
                F: '按钮',
              }}
              name="menuType"
              label={'菜单类型'}
              fieldProps={{
                onChange: (e) => {
                  setMenuTypeId(e.target.value)
                },
              }}
              initialValue="C"
              width="xl"
              labelCol={{ span: 24 }}
              placeholder="请输入菜单类型"
              rules={[
                {
                  required: false,
                  message: '请输入菜单类型！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormSelect
              name="icon"
              labelCol={{ span: 24 }}
              allowClear={true}
              hidden={menuTypeId === 'F'}
              addonBefore={createIcon(menuIconName)}
              fieldProps={{
                onClick: () => {
                  setPreviewModalVisible(true)
                },
              }}
              label={'菜单图标:'}
              rules={[
                {
                  required: false,
                  message: '请选择菜单图标！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="menuName"
              label={'菜单名称'}
              width="xl"
              placeholder="请输入菜单名称"
              rules={[
                {
                  required: true,
                  message: '请输入菜单名称！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormDigit
              name="orderNum"
              label={'显示顺序'}
              initialValue="0"
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
          <Col span={12} order={1}>
            <ProFormRadio.Group
              name="isFrame"
              valueEnum={{
                0: '是',
                1: '否',
              }}
              initialValue="1"
              label={'是否为外链'}
              width="xl"
              labelCol={{ span: 24 }}
              hidden={menuTypeId === 'F'}
              placeholder="请输入是否为外链"
              rules={[
                {
                  required: false,
                  message: '请输入是否为外链！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormText
              name="path"
              label={'路由地址'}
              width="xl"
              labelCol={{ span: 24 }}
              placeholder="请输入路由地址"
              hidden={menuTypeId === 'F'}
              rules={[
                {
                  required: menuTypeId !== 'F',
                  message: '请输入路由地址！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="perms"
              label={'权限标识'}
              width="xl"
              placeholder="请输入权限标识"
              hidden={menuTypeId === 'M'}
              rules={[
                {
                  required: false,
                  message: '请输入权限标识！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormText
              name="component"
              label={'组件路径'}
              width="xl"
              placeholder="请输入组件路径"
              hidden={menuTypeId !== 'C'}
              rules={[
                {
                  required: false,
                  message: '请输入组件路径！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="query"
              label={'路由参数'}
              width="xl"
              placeholder="请输入权路由参数"
              hidden={menuTypeId !== 'C'}
              rules={[
                {
                  required: false,
                  message: '请输入路由参数！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormRadio.Group
              name="isCache"
              valueEnum={{
                0: '缓存',
                1: '不缓存',
              }}
              initialValue="0"
              label={'是否缓存'}
              width="xl"
              labelCol={{ span: 24 }}
              hidden={menuTypeId !== 'C'}
              placeholder="请输入是否缓存"
              rules={[
                {
                  required: false,
                  message: '请输入是否缓存！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormRadio.Group
              valueEnum={visibleOptions}
              name="visible"
              label={'可见状态'}
              initialValue="0"
              width="xl"
              labelCol={{ span: 24 }}
              hidden={menuTypeId === 'F'}
              placeholder="请输入可见状态"
              rules={[
                {
                  required: false,
                  message: '请输入可见状态！',
                },
              ]}
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormRadio.Group
              valueEnum={statusOptions}
              name="status"
              label={'菜单状态'}
              initialValue="0"
              width="xl"
              labelCol={{ span: 24 }}
              hidden={menuTypeId === 'F'}
              placeholder="请输入菜单状态"
              rules={[
                {
                  required: false,
                  message: '请输入菜单状态！',
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default MenuForm
