import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import DetailForm from './components/detail'
import { getDicts } from '@/api/system/dict/data'
import { Search, Table, useTable, withTable } from 'table-render'
import history from '@/utils/history'
import { delJobLog, cleanJobLog, listJobLog } from '@/api/monitor/jobLog'
import { useSearchParams } from 'react-router-dom'

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除')
  if (!selectedRows) return true
  try {
    const resp = await delJobLog(
      selectedRows.map((row) => row.jobLogId).join(',')
    )
    hide()
    if (resp.code === 200) {
      message.success('删除成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('删除失败，请重试')
    return false
  }
}

const handleRemoveAll = async () => {
  const hide = message.loading('正在删除')
  try {
    const resp = await cleanJobLog()
    hide()
    if (resp.code === 200) {
      message.success('删除成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('删除失败，请重试')
    return false
  }
}

const handleRemoveOne = async (selectedRow) => {
  const hide = message.loading('正在删除')
  if (!selectedRow) return true
  try {
    const params = [selectedRow.jobLogId]
    const resp = await delJobLog(params.join(','))
    hide()
    if (resp.code === 200) {
      message.success('删除成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('删除失败，请重试')
    return false
  }
}

const JobLogTableList = () => {
  const { refresh } = useTable()
  const [searchParams, setSearchParams] = useSearchParams()

  const [modalVisible, setModalVisible] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [statusOptions, setStatusOptions] = useState([])
  const [jobGroupOptions, setJobGroupOptions] = useState([])

  useEffect(() => {
    getDicts('sys_job_status').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setStatusOptions(opts)
      }
    })
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
      title: '任务日志ID',
      dataIndex: 'jobLogId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      valueType: 'text',
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      valueType: 'text',
      enum: jobGroupOptions,
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '日志信息',
      dataIndex: 'jobMessage',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      valueType: 'select',
      enum: statusOptions,
    },
    {
      title: '操作',
      width: '220px',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="detail"
          // hidden={!access.hasPerms('monitor:log:list')}
          onClick={() => {
            setModalVisible(true)
            setCurrentRow(record)
          }}
        >
          详细
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          // hidden={!access.hasPerms('monitor:log:remove')}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record)
                if (success) {
                  refresh()
                }
              },
            })
          }}
        >
          删除
        </Button>,
      ],
    },
  ]

  const searchApi = (params) => {
    const requestParams = {
      ...params,
      pageNum: params.current,
      jobName: searchParams.get('jobName'),
    }

    return listJobLog(requestParams).then((res) => {
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
        <Search schema={[]} hidden api={searchApi} displayType="row" />
        <Table
          rowKey="jobLogId"
          key="jobLogList"
          toolbarRender={() => [
            <Button
              type="primary"
              danger
              key="remove"
              // hidden={selectedRowsState?.length === 0 || !access.hasPerms('monitor:log:remove')}
              onClick={async () => {
                Modal.confirm({
                  title: '是否确认删除所选数据项?',
                  icon: <ExclamationCircleOutlined />,
                  content: '请谨慎操作',
                  async onOk() {
                    const success = await handleRemove(selectedRowsState)
                    if (success) {
                      setSelectedRows([])
                      refresh()
                    }
                  },
                  onCancel() {},
                })
              }}
            >
              删除
            </Button>,
            <Button
              type="primary"
              key="clear"
              // hidden={!access.hasPerms('monitor:operlog:remove')}
              onClick={async () => {
                Modal.confirm({
                  title: '是否确认清空所有登录日志数据项?',
                  icon: <ExclamationCircleOutlined />,
                  content: '请谨慎操作',
                  async onOk() {
                    handleRemoveAll()
                    refresh()
                  },
                  onCancel() {},
                })
              }}
            >
              清空
            </Button>,
            <Button
              type="primary"
              key="goback"
              onClick={async () => {
                history.back()
              }}
            >
              返回
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
      <DetailForm
        onCancel={() => {
          setModalVisible(false)
          setCurrentRow(undefined)
        }}
        visible={modalVisible}
        values={currentRow || {}}
        statusOptions={statusOptions}
        jobGroupOptions={jobGroupOptions}
      />
    </>
  )
}

export default withTable(JobLogTableList)
