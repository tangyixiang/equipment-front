import React, { useState } from 'react'
import { ProFormSelect } from '@ant-design/pro-form'
import { Row, Col } from 'antd'
import { listJob } from '@/api/monitor/job'
import { listOpen } from '@/api/config/period'

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
            label={'会计期间'}
            labelCol={{ span: 4 }}
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
    </>
  )
}

export default FromContent
