import React, { useRef, useState, useEffect } from 'react'
import TableList from '@/components/Table/TableList'
import { Button } from 'antd'
import { download } from '@/utils/request'
import { listTaskLog, runTask } from '@/api/task'
import FormContent from './components/FormContent'
import { getDicts } from '@/api/system/dict/data'

function TaskTableList() {
  const formRef = useRef()
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
    {
      dataIndex: 'jobLogId',
      valueType: 'text',
      hideInSearch: true,
      title: '作业流水ID',
    },
    {
      dataIndex: 'jobGroup',
      valueType: 'text',
      valueEnum: jobGroupOptions,
      hideInSearch: true,
      title: '作业类别',
    },
    { dataIndex: 'jobName', valueType: 'text', title: '作业名称' },
    {
      dataIndex: 'startTime',
      valueType: 'text',
      hideInSearch: true,
      title: '开始执行时间',
    },
    {
      dataIndex: 'stopTime',
      valueType: 'text',
      hideInSearch: true,
      title: '结束执行时间',
    },
    {
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: '已完成',
        1: '失败',
      },
      title: '当前状态',
    },
    {
      title: '操作',
      width: '120px',
      hideInSearch: true,
      render: (_, record) => {
        if (record.taskType == 1 && record.status == '0') {
          return [
            <Button
              type="link"
              size="small"
              key="download"
              onClick={() => {
                download(
                  '/task/split/result?jobLogId=' + record.jobLogId,
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

  const crud = {
    add: runTask,
    update: runTask,
    list: listTaskLog,
  }

  const optionBtn = {
    view: false,
    edit: true,
    del: true,
  }

  const toolBar = {
    Add: { hidden: false, name: '手工运行作业' },
    Del: { hidden: true, name: '' },
  }

  const modalContent = {
    title: '作业任务运行',
    width: '35%',
    formRef: formRef,
    children: <FormContent formRef={formRef} />,
  }
  return (
    <>
      <TableList
        rowKey={'jobLogId'}
        columns={columns}
        initData={false}
        func={crud}
        optionBtn={optionBtn}
        labelWidth={80}
        toolBar={toolBar}
        contianModal
        modalContent={modalContent}
      />
    </>
  )
}

export default TaskTableList
