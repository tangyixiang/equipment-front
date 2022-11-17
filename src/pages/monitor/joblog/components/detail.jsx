import React, { useEffect } from 'react'
import { Form, Modal, Descriptions } from 'antd'

const JobLogForm = (props) => {
  const [form] = Form.useForm()

  const { values, statusOptions, jobGroupOptions } = props

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      jobLogId: props.values.jobLogId,
      jobName: props.values.jobName,
      jobGroup: props.values.jobGroup,
      invokeTarget: props.values.invokeTarget,
      jobMessage: props.values.jobMessage,
      status: props.values.status,
      exceptionInfo: props.values.exceptionInfo,
      createTime: props.values.createTime,
    })
  }, [form, props])

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    props.onCancel()
    form.resetFields()
  }

  return (
    <Modal
      width={640}
      title={'定时任务调度日志'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Descriptions column={24}>
        <Descriptions.Item span={12} label={'任务编号'}>
          {values.jobLogId}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'执行时间'}>
          {values.createTime}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'任务名称'}>
          {values.jobName}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'任务组名'}>
          {jobGroupOptions[values.jobGroup ? values.jobGroup : 'DEFAULT']}
        </Descriptions.Item>
        <Descriptions.Item span={24} label={'调用目标'}>
          {values.invokeTarget}
        </Descriptions.Item>
        <Descriptions.Item span={24} label={'日志信息'}>
          {values.jobMessage}
        </Descriptions.Item>
        <Descriptions.Item span={24} label={'异常信息'}>
          {values.exceptionInfo}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'执行状态'}>
          {statusOptions[values.status ? values.status : 0]}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default JobLogForm
