import React, { useEffect, useState, useRef } from 'react'
import ProForm, { ProFormSelect } from '@ant-design/pro-form'
import { Form, Modal, Row, Col, message } from 'antd'
import { formateMonth } from '@/utils/common'
import { runTask } from '@/api/task'
import { listJob } from '@/api/monitor/job'

const ExecuteTask = (props) => {
  const [form] = Form.useForm()
  const formRef = useRef()

  useEffect(() => {
    form.resetFields()
  }, [form, props])

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    props.onCancel()
    form.resetFields()
  }

  const handleFinish = async (values) => {
    runTask(values).then((res) => {
      if (res.code == 200) {
        message.success('运行成功,请稍后查看运行结果')
        handleCancel()
      }
    })
    return true
  }

  return (
    <>
      <Modal
        forceRender
        width={'35%'}
        title={'作业任务运行'}
        open={props.visible}
        destroyOnClose
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProForm
          form={form}
          layout="horizontal"
          submitter={false}
          onFinish={handleFinish}
          formRef={formRef}
        >
          <Row>
            <Col span={24}>
              <ProFormSelect
                name="jobId"
                label={'任务类别'}
                labelCol={{ span: 4 }}
                request={async () => {
                  let data = []
                  const res = await listJob({ jobGroup: 'BUSI' })
                  if (res.code === 200) {
                    data = res.rows.map((item) => ({
                      label: item.jobName,
                      value: item.jobId,
                    }))
                  }
                  return data
                }}
                rules={[
                  {
                    required: true,
                    message: '请选择任务类别！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ProFormSelect
                name="params"
                label={'会计期'}
                labelCol={{ span: 4 }}
                rules={[
                  {
                    required: true,
                    message: '请选择期间！',
                  },
                ]}
              />
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  )
}

export default ExecuteTask
