import { Button, Upload } from 'antd'
import React, { useState, useEffect } from 'react'
import { Search, Table, withTable } from 'table-render'
import { download } from '@/utils/request'
import { listTaskLog } from '@/api/task'
import { getDicts } from '@/api/system/dict/data'
import ExecuteTask from './components/execute'

const schema = {
  type: 'object',
  properties: {
    jobName: {
      title: '作业名称',
      type: 'string',
      width: '25%',
    },
    status: {
      title: '当前状态',
      type: 'string',
      enum: [0, 1],
      enumNames: ['已完成', '失败'],
      width: '25%',
      widget: 'select',
    },
  },
}

const TaskTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [taskModal, setTaskModal] = useState(false)
  const [jobGroupOptions, setJobGroupOptions] = useState([])

  useEffect(() => {
    getDicts('sys_job_group').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setJobGroupOptions(opts)
      }
    })
  }, [])

  const columns = [
    { dataIndex: 'jobLogId', valueType: 'text', title: '作业流水ID' },
    {
      dataIndex: 'jobGroup',
      valueType: 'text',
      enum: jobGroupOptions,
      title: '作业类别',
    },
    { dataIndex: 'jobName', valueType: 'text', title: '作业名称' },
    { dataIndex: 'startTime', valueType: 'text', title: '开始执行时间' },
    { dataIndex: 'stopTime', valueType: 'text', title: '结束执行时间' },
    {
      dataIndex: 'status',
      valueType: 'select',
      enum: {
        0: '已完成',
        1: '失败',
      },
      title: '当前状态',
    },
    {
      title: '操作',
      width: '120px',
      render: (_, record) => {
        if (record.taskType == 1 && record.status == '0') {
          return [
            <Button
              type="link"
              size="small"
              key="download"
              onClick={() => {
                download(
                  '/task/split/result?jobLogId=' + record.taskId,
                  {},
                  '发票分录结果.xlsx'
                )
              }}
            >
              导出分录
            </Button>,
          ]
        } else {
          return []
        }
      },
    },
  ]

  const searchApi = (params) => {
    const requestParams = {
      ...params,
      pageNum: params.current,
    }
    // console.log('params >>> ', requestParams)

    return listTaskLog(requestParams).then((res) => {
      const result = {
        rows: res.rows,
        total: res.total,
        success: true,
      }
      return result
    })
  }

  return (
    <>
      <div style={{ width: '100%', float: 'right' }}>
        <Search schema={schema} api={searchApi} displayType="row" />
        <Table
          rowKey="jobLogId"
          key="tablelist"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          toolbarAction
          toolbarRender={() => [
            <Button type="primary" onClick={() => setTaskModal(true)}>
              手工运行作业
            </Button>,
          ]}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows)
            },
          }}
        />
      </div>
      <ExecuteTask visible={taskModal} onCancel={setTaskModal} />
    </>
  )
}

export default withTable(TaskTableList)
