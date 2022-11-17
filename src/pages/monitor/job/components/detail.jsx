import React, { useEffect } from 'react'
import { Modal, Descriptions, Button } from 'antd'

const OperlogForm = (props) => {
  const { values, statusOptions } = props

  useEffect(() => {}, [props])

  const misfirePolicy = {
    0: '默认策略',
    1: '立即执行',
    2: '执行一次',
    3: '放弃执行',
  }

  const handleCancel = () => {
    props.onCancel()
  }

  return (
    <Modal
      width={800}
      title={'操作日志详细信息'}
      open={props.visible}
      destroyOnClose
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          关闭
        </Button>,
      ]}
    >
      <Descriptions column={24}>
        <Descriptions.Item span={12} label={'任务编号'}>
          {values.jobId}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'任务名称'}>
          {values.jobName}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'任务组名'}>
          {values.jobGroup}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'是否并发执行'}>
          {values.concurrent === '1' ? '禁止' : '允许'}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'计划执行错误策略'}>
          {misfirePolicy[values.misfirePolicy ? values.misfirePolicy : '0']}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'创建时间'}>
          {values.createTime}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'状态'}>
          {statusOptions[values.status ? values.status : 0]}
        </Descriptions.Item>
        <Descriptions.Item span={12} label={'下次执行时间'}>
          {values.nextValidTime}
        </Descriptions.Item>
        <Descriptions.Item span={24} label={'cron执行表达式'}>
          {values.cronExpression}
        </Descriptions.Item>
        <Descriptions.Item span={24} label={'调用目标字符串'}>
          {values.invokeTarget}
        </Descriptions.Item>
        <Descriptions.Item span={24} label={'方法参数'}>
          {values.param}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default OperlogForm
