import React, { useEffect, useState, useRef } from 'react'
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { Form, Modal, Row, Col, message } from 'antd'
import { addSubject, updateSubject } from '@/api/finance/subject'

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  try {
    const resp = await addSubject({ ...fields })
    if (resp.code === 200) {
      message.success('添加成功')
    } else {
      message.error(resp.msg)
    }
  } catch (error) {
    message.error('添加失败请重试！')
  }
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields) => {
  try {
    const resp = await updateSubject(fields)
    if (resp.code === 200) {
      message.success('配置成功')
    } else {
      message.error(resp.msg)
    }
  } catch (error) {
    message.error('配置失败请重试！')
  }
}

const SubjectInfo = (props) => {
  const [form] = Form.useForm()
  const formRef = useRef()

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      id: props.record?.id,
      categoryId: props.record?.categoryId,
      mappingId: props.record?.mappingId,
      itemId: props.record?.itemId,
      value: props.record?.value,
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
    if (values.id) {
      handleUpdate(values)
    } else {
      handleAdd(values)
    }
  }

  return (
    <Modal
      forceRender
      width={'40%'}
      title={'科目信息'}
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
          <Col span={24}>
            <ProFormSelect
              name="categoryId"
              label={'客户编号'}
              labelCol={{ span: 4 }}
              valueEnum={props.kmOptions}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ProFormSelect
              name="mappingId"
              label={'科目映射关系'}
              labelCol={{ span: 4 }}
              valueEnum={props.mappingOptions}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ProFormSelect
              name="itemId"
              label={'项目名称'}
              labelCol={{ span: 4 }}
              valueEnum={props.itemOptions}
              showSearch
              optionFilterProp="children"
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ProFormText
              name="value"
              label={'会计科目值'}
              labelCol={{ span: 4 }}
            />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  )
}

export default SubjectInfo
