import React, { useEffect, useState, useRef } from 'react'
import { uploadSalary } from '@/api/finance/salary'
import { UploadOutlined } from '@ant-design/icons'
import ProForm, { ProFormText, ProFormDatePicker } from '@ant-design/pro-form'
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
import { formateMonth } from '@/utils/common'

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
    props.onCancel(false)
    setFileList([])
    form.resetFields()
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
        setFileList([...fileList, file])
      }
      return false
    },
    fileList,
  }

  const handleFinish = (values) => {
    let period = formateMonth(values.period)
    uploadSalary(period, fileList).then((res) => {
      message.success('导入成功')
      handleCancel()
      props.actionRef.current?.reload()
    })
  }

  return (
    <>
      <Modal
        forceRender
        width={'34%'}
        title={'导入范围选择'}
        open={props.visible}
        destroyOnClose
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProForm
          form={form}
          layout="horizontal"
          submitter={false}
          formRef={formRef}
          onFinish={handleFinish}
        >
          <Row>
            <Col span={24}>
              <ProFormDatePicker
                name="period"
                label={'导入期间'}
                labelCol={{ span: 4 }}
                picker="month"
                format="YYYYMM"
                width="md"
                rules={[
                  {
                    required: true,
                    message: '请选择期间！',
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
                同发薪期间已导入系统数据将被覆盖，请谨慎导入!
              </Typography.Text>
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  )
}

export default UploadForm
