import { Button, message, Modal } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import UpdateForm from './components/edit'
import { Search, Table, useTable, withTable } from 'table-render'
import {
  addNotice,
  updateNotice,
  delNotice,
  listNotice,
} from '@/api/system/notice'
import { getDicts } from '@/api/system/dict/data'

const schema = {
  type: 'object',
  properties: {
    noticeTitle: {
      title: '公告标题',
      type: 'string',
      width: '25%',
    },
    createBy: {
      title: '创建者',
      type: 'string',
      width: '25%',
    },
    noticeType: {
      title: '公告类型',
      type: 'string',
      enum: ['1', '2'],
      enumNames: ['通知', '公告'],
      width: '25%',
      widget: 'select',
    },
  },
  labelWidth: 80,
}

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addNotice({ ...fields })
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

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置')
  try {
    const resp = await updateNotice(fields)
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

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除')
  if (!selectedRows) return true
  try {
    const resp = await delNotice(
      selectedRows.map((row) => row.noticeId).join(',')
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

const handleRemoveOne = async (selectedRow) => {
  const hide = message.loading('正在删除')
  if (!selectedRow) return true
  try {
    const params = [selectedRow.noticeId]
    const resp = await delNotice(params.join(','))
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

const Notice = () => {
  const { refresh } = useTable()

  const [modalVisible, setModalVisible] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [noticeTypeOptions, setNoticeTypeOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])

  useEffect(() => {
    getDicts('sys_notice_type').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setNoticeTypeOptions(opts)
      }
    })
    getDicts('sys_notice_status').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setStatusOptions(opts)
      }
    })
  }, [])

  const columns = [
    {
      title: '公告ID',
      dataIndex: 'noticeId',
      valueType: 'text',
    },
    {
      title: '公告标题',
      dataIndex: 'noticeTitle',
      valueType: 'text',
    },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      valueType: 'select',
      enum: noticeTypeOptions,
    },
    {
      title: '公告状态',
      dataIndex: 'status',
      valueType: 'select',
      enum: statusOptions,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      width: '220px',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('system:notice:edit')}
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
          // hidden={!access.hasPerms('system:notice:remove')}
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
    }
    return listNotice(requestParams).then((res) => {
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
          headerTitle={'信息'}
          rowKey="noticeId"
          key="noticeList"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          toolbarRender={() => [
            <Button
              type="primary"
              key="add"
              // hidden={!access.hasPerms('system:notice:add')}
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
              // hidden={selectedRowsState?.length === 0 || !access.hasPerms('system:notice:remove')}
              onClick={async () => {
                const success = await handleRemove(selectedRowsState)
                if (success) {
                  setSelectedRows([])
                  refresh()
                }
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
          if (values.noticeId) {
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
        noticeTypeOptions={noticeTypeOptions}
        statusOptions={statusOptions}
      />
    </>
  )
}

export default withTable(Notice)
