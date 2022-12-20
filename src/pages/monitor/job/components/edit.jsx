import React, { useEffect } from 'react'
import {
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form'
import { Form, Modal, Row, Col } from 'antd'
import { getDicts } from '@/api/system/dict/data'

const JobForm = (props) => {
  const [form] = Form.useForm()

  const { statusOptions } = props

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      jobId: props.values.jobId,
      jobName: props.values.jobName,
      jobGroup: props.values.jobGroup,
      invokeTarget: props.values.invokeTarget,
      cronExpression: props.values.cronExpression,
      misfirePolicy: props.values.misfirePolicy,
      concurrent: props.values.concurrent,
      status: props.values.status,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
      remark: props.values.remark,
      param: props.values.param,
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
    props.onSubmit(values)
  }

  return (
    <Modal
      width={640}
      title={'编辑定时任务调度'}
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              labelCol={{ span: 6 }}
              name="jobId"
              label={'任务ID'}
              width="xl"
              placeholder="请输入任务ID"
              disabled
              hidden={!props.values.jobId}
              rules={[
                {
                  required: false,
                  message: '请输入任务ID！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              labelCol={{ span: 6 }}
              name="jobName"
              label={'任务名称'}
              width="xl"
              placeholder="请输入任务名称"
              rules={[
                {
                  required: true,
                  message: '请输入任务名称！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              labelCol={{ span: 6 }}
              name="jobGroup"
              label={'任务组名'}
              width="xl"
              request={async () => {
                let data = []
                const res = await getDicts('sys_job_group')
                if (res.code === 200) {
                  data = res.data.map((item) => ({
                    label: item.dictLabel,
                    value: item.dictValue,
                  }))
                }
                return data
              }}
              placeholder="请输入任务组名"
              rules={[
                {
                  required: true,
                  message: '请输入任务组名！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              labelCol={{ span: 6 }}
              name="invokeTarget"
              label={'调用目标字符串'}
              width="xl"
              placeholder="请输入调用目标字符串"
              rules={[
                {
                  required: true,
                  message: '请输入调用目标字符串！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              labelCol={{ span: 6 }}
              name="param"
              label={'方法参数'}
              width="xl"
              placeholder="请输入方法参数"
              rules={[
                {
                  required: false,
                  message: '请输入方法参数！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              labelCol={{ span: 6 }}
              name="cronExpression"
              label={'cron执行表达式'}
              width="xl"
              placeholder="请输入cron执行表达式"
              rules={[
                {
                  required: true,
                  message: '请输入cron执行表达式！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              labelCol={{ span: 6 }}
              name="misfirePolicy"
              label={'计划执行错误策略'}
              // （1立即执行 2执行一次 3放弃执行）
              valueEnum={{
                1: '立即执行',
                2: '执行一次',
                3: '放弃执行',
              }}
              placeholder="请选择计划执行错误策略"
              rules={[
                {
                  required: true,
                  message: '请输入计划执行错误策略！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              labelCol={{ span: 6 }}
              name="concurrent"
              label={'是否并发执行'}
              // （1立即执行 2执行一次 3放弃执行）
              valueEnum={{
                0: '允许',
                1: '禁止',
              }}
              placeholder="请选择是否并发执行"
              rules={[
                {
                  required: true,
                  message: '请选择是否并发执行！',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormRadio.Group
              labelCol={{ span: 6 }}
              valueEnum={statusOptions}
              name="status"
              label={'状态'}
              width="xl"
              placeholder="请输入状态"
              rules={[
                {
                  required: false,
                  message: '请输入状态！',
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default JobForm
