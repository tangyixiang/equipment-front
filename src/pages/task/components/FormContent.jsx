import React, { useState } from 'react'
import { ProFormSelect } from '@ant-design/pro-form'
import { Row, Col } from 'antd'
import { listJob } from '@/api/monitor/job'
import { getDicts } from '@/api/system/dict/data'

function FromContent(props) {
  const [rule, setRule] = useState(false)

  return (
    <>
      <Row>
        <Col span={24}>
          <ProFormSelect
            name="jobId"
            label={'任务类别'}
            labelCol={{ span: 4 }}
            request={async () => {
              const res = await listJob({ jobGroup: 'BUSI' })
              return res.rows.map((item) => ({
                label: item.jobName,
                value: item.jobId,
              }))
            }}
            onChange={(value) => {
              listJob({ jobGroup: 'BUSI' }).then((res) => {
                const data = res.rows.filter((item) => item.jobId == value)
                if (data) {
                  setRule(data[0].jobName == '分录生成作业')
                }
              })
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
            request={async () => {
              const res = await getDicts('invoice_accounting_period')
              return res.data.map((item) => ({
                label: item.dictLabel,
                value: item.dictLabel,
              }))
            }}
            rules={[
              {
                required: rule,
                message: '请选择期间！',
              },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}

export default FromContent
