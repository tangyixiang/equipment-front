import { Button, message, Modal } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import UpdateForm from './components/edit'
import { Search, Table, useTable, withTable } from 'table-render'
import {
  addPost,
  updatePost,
  delPost,
  listDeptExcludeChild,
  listPost,
} from '@/api/system/post'
import { getDicts } from '@/api/system/dict/data'
import { buildTreeData } from '@/utils/common'

const schema = {
  type: 'object',
  properties: {
    postCode: {
      title: '岗位编码',
      type: 'string',
      width: '30%',
    },
    postName: {
      title: '岗位名称',
      type: 'string',
      width: '30%',
    },
  },
  labelWidth: 120,
}

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addPost({ ...fields })
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
    const resp = await updatePost(fields)
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
    const resp = await delPost(selectedRows.map((row) => row.postId).join(','))
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
    const params = [selectedRow.postId]
    const resp = await delPost(params.join(','))
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

function Post() {
  const { refresh } = useTable()

  const [modalVisible, setModalVisible] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [statusOptions, setStatusOptions] = useState([])

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
  }, [])

  const columns = [
    {
      title: '岗位编码',
      dataIndex: 'postCode',
      valueType: 'text',
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
      valueType: 'text',
    },
    {
      title: '显示顺序',
      dataIndex: 'postSort',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      enum: statusOptions,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      title: '操作',
      width: '220px',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('system:post:edit')}
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
          // hidden={!access.hasPerms('system:post:remove')}
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
    return listPost({ ...params }).then((res) => {
      return {
        rows: res.rows,
        total: res.total,
        success: true,
      }
    })
  }

  return (
    <>
      <div style={{ width: '100%', float: 'right' }}>
        <Search schema={schema} api={searchApi} displayType="row" />
        <Table
          rowKey="postId"
          key="postList"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          toolbarRender={() => [
            <Button
              type="primary"
              key="add"
              // hidden={!access.hasPerms('system:post:add')}
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
              danger
              // hidden={selectedRowsState?.length === 0 || !access.hasPerms('system:post:remove')}
              onClick={async () => {
                const success = await handleRemove(selectedRowsState)
                if (success) {
                  setSelectedRows([])
                  refresh()
                }
              }}
            >
              批量删除
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
          if (values.postId) {
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
    </>
  )
}

export default withTable(Post)
