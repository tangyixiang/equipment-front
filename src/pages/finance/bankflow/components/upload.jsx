import React, { useEffect, useState, useRef } from 'react'
import { uploadValidate, uploadFlow } from '@/api/finance/bankflow'
import { listAccount } from '@/api/finance/bankaccount'
import { UploadOutlined } from '@ant-design/icons'
import ProForm, { ProFormDatePicker, ProFormSelect } from '@ant-design/pro-form'
import {
  Form,
  Modal,
  Row,
  Col,
  Upload,
  message,
  Button,
  Space,
  Typography,
} from 'antd'
import { formateDate } from '@/utils/common'
import { listOpen } from '@/api/config/period'

const UploadForm = (props) => {
  const [form] = Form.useForm()
  const formRef = useRef()
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    form.resetFields()
  }, [form, props])

  const handleOk = () => {
    form.submit()
  }

  const handleCancel = () => {
    props.onCancel()
    setFileList([])
    form.resetFields()
  }

  const handleFinish = async (values) => {
    const { account, startDate, endDate, period } = values
    if (fileList.length == 0) {
      message.error('请选择需要上传的文件')
      return false
    }
    uploadFlow(account, startDate, endDate, period, fileList).then((res) => {
      message.success('导入成功')
      handleCancel()
    })
  }

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      const isExcel =
        file.type === 'application/vnd.ms-excel' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        message.error('请上传excel文件格式文件')
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        message.error('文件大小超过10MB!')
      }
      if (isExcel && isLt2M) {
        confirmUpload(file).then(() => setFileList([...fileList, file]))
      }
      return false
    },
    fileList,
  }

  const confirmUpload = (file) => {
    return new Promise(function (resolve, reject) {
      const account = form.getFieldValue('account')
      const startDate = formateDate(form.getFieldValue('startDate'))
      const endDate = formateDate(form.getFieldValue('endDate'))
      const period = formateDate(form.getFieldValue('period'))
      uploadValidate(account, startDate, endDate, period, file).then((res) => {
        if (res.data.validate) {
          return resolve()
        } else {
          Modal.confirm({
            title: '导入确认',
            content:
              '已存在此账号此时间段的银行流水，请先取消导入会计期+时间范围内对账，否则系统无法执行导入',
            onOk: () => {
              resolve()
            },
            onCancel: () => {
              reject()
            },
          })
        }
      })
    })
  }

  return (
    <>
      <Modal
        forceRender
        width={'34%'}
        title={'导入银行流水范围选择'}
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
                name="account"
                label={'本方账号'}
                labelCol={{ span: 4 }}
                width="md"
                request={async () => {
                  let data = []
                  const res = await listAccount()
                  if (res.code === 200) {
                    data = res.rows.map((item) => ({
                      label: item.aliasName + '/' + item.account,
                      value: item.account,
                    }))
                  }
                  return data
                }}
                rules={[
                  {
                    required: true,
                    message: '请选择本方账号！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <ProFormSelect
                name="period"
                label={'会计期间'}
                labelCol={{ span: 4 }}
                width="md"
                request={async () => {
                  let data = []
                  const res = await listOpen()
                  if (res.code === 200) {
                    data = res.rows.map((item) => ({
                      label: item.period,
                      value: item.period,
                    }))
                  }
                  return data
                }}
                rules={[
                  {
                    required: true,
                    message: '请选择会计期间！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ProFormDatePicker
                name="startDate"
                label={'开始日期'}
                labelCol={{ span: 4 }}
                width="md"
                rules={[
                  {
                    required: true,
                    message: '请选择开始日期！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ProFormDatePicker
                name="endDate"
                label={'结束日期'}
                labelCol={{ span: 4 }}
                width="md"
                rules={[
                  {
                    required: true,
                    message: '请选择结束日期！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={1}>
              <Upload {...uploadProps}>
                <Space>
                  <Button icon={<UploadOutlined />}>上传</Button>
                  <div>支持xls，xlsx格式附件，附件大小不能超过10M</div>
                </Space>
              </Upload>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={20} offset={1}>
              <Typography.Text type="danger">
                同一时间区间同一账号下已导入系统数据将被覆盖，请谨慎导入!
              </Typography.Text>
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  )
}

export default UploadForm
