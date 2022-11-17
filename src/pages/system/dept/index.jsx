import { Button, message, Modal } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import UpdateForm from './components/edit'
import { Search, Table, useTable, withTable } from 'table-render'
import {
  addDept,
  updateDept,
  delDept,
  listDeptExcludeChild,
  listDept,
} from '@/api/system/dept'
import { getDicts } from '@/api/system/dict/data'
import { buildTreeData } from '@/utils/common'

const schema = {
  type: 'object',
  properties: {
    deptName: {
      title: '部门名称',
      type: 'string',
      width: '30%',
    },
    leader: {
      title: '负责人',
      type: 'string',
      width: '30%',
    },
  },
  labelWidth: 80,
}

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addDept({ ...fields })
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
    const resp = await updateDept(fields)
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
    const resp = await delDept(selectedRows.map((row) => row.deptId).join(','))
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
    const params = [selectedRow.deptId]
    const resp = await delDept(params.join(','))
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

function Dept() {
  const { refresh } = useTable()

  const [modalVisible, setModalVisible] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [deptTree, setDeptTree] = useState([])
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
      title: '部门名称',
      dataIndex: 'deptName',
      valueType: 'text',
    },
    {
      title: '显示顺序',
      dataIndex: 'orderNum',
      valueType: 'text',
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      valueType: 'text',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: '部门状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
    },
    {
      title: '操作',
      width: '220px',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('system:dept:edit')}
          onClick={() => {
            listDeptExcludeChild(record.deptId).then((res) => {
              if (res.code === 200) {
                let depts = buildTreeData(
                  res.data,
                  'deptId',
                  'deptName',
                  '',
                  '',
                  ''
                )
                if (depts.length === 0) {
                  depts = [
                    {
                      id: 0,
                      title: '无上级',
                      children: undefined,
                      key: 0,
                      value: 0,
                    },
                  ]
                }
                setDeptTree(depts)
                setModalVisible(true)
                setCurrentRow(record)
              } else {
                message.warn(res.msg)
              }
            })
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          // hidden={!access.hasPerms('system:dept:remove')}
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
    return listDept({ ...params }).then((res) => {
      return {
        rows: buildTreeData(res.data, 'deptId', '', '', '', ''),
        total: res.data.length,
        success: true,
      }
    })
  }

  return (
    <>
      <div style={{ width: '100%', float: 'right' }}>
        <Search schema={schema} api={searchApi} displayType="row" />
        <Table
          rowKey="deptId"
          key="deptList"
          toolbarRender={() => [
            <Button
              type="primary"
              key="add"
              // hidden={!access.hasPerms('system:dept:add')}
              onClick={async () => {
                listDept().then((res) => {
                  if (res.code === 200) {
                    setDeptTree(
                      buildTreeData(res.data, 'deptId', 'deptName', '', '', '')
                    )
                    setCurrentRow(undefined)
                    setModalVisible(true)
                  } else {
                    message.warn(res.msg)
                  }
                })
              }}
            >
              新建
            </Button>,
            <Button
              type="primary"
              key="remove"
              danger
              // hidden={selectedRowsState?.length === 0 || !access.hasPerms('system:dept:remove')}
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
          if (values.deptId) {
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
        deptTree={deptTree}
        statusOptions={statusOptions}
      />
    </>
  )
}

export default withTable(Dept)
