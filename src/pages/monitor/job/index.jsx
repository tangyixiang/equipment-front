import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { Button, message, Modal } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import UpdateForm from './components/edit'
import DetailForm from './components/detail'
import { getDicts } from '@/api/system/dict/data'
import { Search, Table, useTable, withTable } from 'table-render'
import { addJob, updateJob, delJob, listJob, runJob } from '@/api/monitor/job'
import { useNavigate } from 'react-router-dom'

const schema = {
  type: 'object',
  properties: {
    configName: {
      title: '参数名称',
      type: 'string',
      width: '25%',
    },
    configKey: {
      title: '参数键名',
      type: 'string',
      width: '25%',
    },
  },
  labelWidth: 80,
}

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addJob({ ...fields })
    hide()
    if (resp.code === 200) {
      message.success('添加成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('添加失败请重试！')
    return false
  }
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置')
  try {
    const resp = await updateJob(fields)
    hide()
    if (resp.code === 200) {
      message.success('配置成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('配置失败请重试！')
    return false
  }
}

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除')
  if (!selectedRows) return true
  try {
    const resp = await delJob(selectedRows.map((row) => row.jobId).join(','))
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
    const params = [selectedRow.jobId]
    const resp = await delJob(params.join(','))
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

const JobTableList = () => {
  const { refresh } = useTable()

  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [statusOptions, setStatusOptions] = useState([])
  const [jobGroupOptions, setJobGroupOptions] = useState([])
  let navigate = useNavigate()

  useEffect(() => {
    getDicts('sys_normal_disable').then((res) => {
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
      title: '任务ID',
      dataIndex: 'jobId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      valueType: 'text',
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setDetailModalVisible(true)
              setCurrentRow(record)
            }}
          >
            {dom}
          </a>
        )
      },
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
      valueType: 'text',
    },
    {
      title: '方法参数',
      dataIndex: 'param',
      valueType: 'text',
    },
    {
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      enum: statusOptions,
    },
    {
      title: '操作',
      width: '25%',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('monitor:job:edit')}
          onClick={() => {
            setModalVisible(true)
            setCurrentRow(record)
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          // hidden={!access.hasPerms('monitor:job:remove')}
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
        <Button
          type="link"
          size="small"
          key="runOnce"
          onClick={() => {
            Modal.confirm({
              title: '警告',
              content: '确认要立即执行一次？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await runJob(record.jobId, record.jobGroup)
                if (success) {
                  message.success('执行成功')
                }
              },
            })
          }}
        >
          执行一次
        </Button>,
        <Button
          type="link"
          size="small"
          key="detail"
          onClick={() => {
            setDetailModalVisible(true)
            setCurrentRow(record)
          }}
        >
          任务详情
        </Button>,
        <Button
          type="link"
          size="small"
          key="history"
          onClick={() => {
            navigate(`/monitor/job-log?jobName=${record.jobName}`)
          }}
        >
          调度日志
        </Button>,
      ],
    },
  ]

  const searchApi = (params) => {
    const requestParams = {
      ...params,
      pageNum: params.current,
    }

    return listJob(requestParams).then((res) => {
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
          rowKey="jobId"
          key="jobList"
          toolbarRender={() => [
            <Button
              type="primary"
              key="add"
              // hidden={!access.hasPerms('monitor:job:add')}
              onClick={async () => {
                setCurrentRow(undefined)
                setModalVisible(true)
              }}
            >
              新建
            </Button>,
            <Button
              type="primary"
              key="remove"
              // hidden={selectedRowsState?.length === 0 || !access.hasPerms('monitor:job:remove')}
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
                })
              }}
            >
              删除
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
      <UpdateForm
        onSubmit={async (values) => {
          let success = false
          if (values.jobId) {
            success = await handleUpdate({ ...values })
          } else {
            success = await handleAdd({ ...values })
          }
          if (success) {
            setModalVisible(false)
            setCurrentRow(undefined)
            refresh()
          }
        }}
        onCancel={() => {
          setModalVisible(false)
          setCurrentRow(undefined)
        }}
        visible={modalVisible}
        values={currentRow || {}}
        statusOptions={statusOptions}
      />
      <DetailForm
        onCancel={() => {
          setDetailModalVisible(false)
          setCurrentRow(undefined)
        }}
        visible={detailModalVisible}
        values={currentRow || {}}
        statusOptions={statusOptions}
      />
    </>
  )
}

export default withTable(JobTableList)
