import React, { useEffect, useState, useRef } from 'react'
import { nanoid } from 'nanoid'
import { updateClient } from '@/api/finance/clientorg'
import ProForm, { ProFormText, ProFormTreeSelect } from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'
import { EditableProTable } from '@ant-design/pro-table'

const FinanceInfo = (props) => {
  const [form] = Form.useForm()
  const formRef = useRef()
  const [editableKeys, setEditableRowKeys] = useState([])

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      id: props.record?.id,
      name: props.record?.name,
      socialCreditCode: props.record?.socialCreditCode,
      address: props.record?.address,
      region: props.record?.region,
      contactName: props.record?.contactName,
      contactPhone: props.record?.contactPhone,
      itemInfo: props.financeItem,
    })
  }, [form, props])

  const itemColumns = [
    {
      title: '财务信息类别',
      dataIndex: 'itemKey',
      valueType: 'select',
      valueEnum: {
        1: { text: '客户别名' },
        2: { text: '银行账号' },
      },
    },
    {
      title: '信息描述',
      dataIndex: 'itemValue',
    },
    {
      title: '操作',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id)
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('itemInfo')
            formRef.current?.setFieldsValue({
              itemInfo: tableDataSource.filter(
                (item) => item.clientFinanceId !== record.clientFinanceId
              ),
            })
          }}
        >
          删除
        </a>,
      ],
    },
  ]

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    props.onCancel()
    form.resetFields()
  }
  const handleFinish = async (values) => {
    // console.log('最后提交数据', values);
    updateClient(values).then((res) => {
      if (res.code == 200) {
        props.onCancel()
      }
    })
    return true
  }

  return (
    <Modal
      forceRender
      width={'70%'}
      title={'客户信息'}
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
          <Col span={12} order={1}>
            <ProFormText
              name="id"
              label={'客户编号'}
              labelCol={{ span: 4 }}
              readonly
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormTreeSelect
              name="address"
              label={'单位地址'}
              labelCol={{ span: 4 }}
              readonly
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="name"
              label={'客户名称'}
              labelCol={{ span: 4 }}
              readonly
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormTreeSelect
              name="region"
              label={'所在地区'}
              labelCol={{ span: 4 }}
              readonly
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="socialCreditCode"
              label={'社会信用代码'}
              labelCol={{ span: 4 }}
              readonly
            />
          </Col>
          <Col span={12} order={2}>
            <ProFormText
              name="contactName"
              label={'联系人名称'}
              labelCol={{ span: 4 }}
              placeholder="请输入联系人名称"
              width="sm"
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="contactPhone"
              label={'联系人电话'}
              labelCol={{ span: 4 }}
              placeholder="请输入联系人电话"
              width="sm"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <EditableProTable
              rowKey="id"
              name="itemInfo"
              recordCreatorProps={{
                newRecordType: 'dataSource',
                position: 'top',
                // 每次新增的时候需要Key
                record: () => ({ id: nanoid() }),
              }}
              loading={false}
              columns={itemColumns}
              controlled
              editable={{
                type: 'multiple',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                  // console.log(data)
                },
                onChange: setEditableRowKeys,
              }}
            />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  )
}

export default FinanceInfo
