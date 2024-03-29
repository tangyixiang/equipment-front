import { Button, message, Modal } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import UpdateForm from './components/edit'
import { getDicts } from '@/api/system/dict/data'
import { addRole, updateRole, delRole, listRole } from '@/api/system/role'
import { getRoleMenuList, treeselect } from '@/api/system/menu'
import ProTable from '@ant-design/pro-table'
import { pagination } from '@/constants'

function formatTreeSelectData(arrayList) {
  const treeSelectData = arrayList.map((item) => {
    const node = {
      id: item.id,
      title: item.label,
      key: item.id,
      value: item.id,
    }
    if (item.children) {
      node.children = formatTreeSelectData(item.children)
    }
    return node
  })
  return treeSelectData
}

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addRole({ ...fields })
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
    const resp = await updateRole(fields)
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
    const resp = await delRole(selectedRows.map((row) => row.roleId).join(','))
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
    const params = [selectedRow.roleId]
    const resp = await delRole(params.join(','))
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

function RoleTableList() {
  const actionRef = useRef()

  const [modalVisible, setModalVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  const [statusOptions, setStatusOptions] = useState([])

  const [menuTree, setMenuTree] = useState()
  const [menuIds, setMenuIds] = useState([])

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
      title: '角色ID',
      dataIndex: 'roleId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      valueType: 'text',
    },
    {
      title: '权限字符串',
      dataIndex: 'roleKey',
      valueType: 'text',
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime}</span>,
      search: {
        transform: (value) => {
          return {
            'params[beginTime]': value[0],
            'params[endTime]': value[1],
          }
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      width: '220px',
      hideInSearch: true,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('system:role:edit')}
          onClick={() => {
            getRoleMenuList(record.roleId).then((res) => {
              if (res.code === 200) {
                const treeData = formatTreeSelectData(res.menus)
                setMenuTree(treeData)
                setMenuIds(res.checkedKeys)
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
          // hidden={!access.hasPerms('system:role:remove')}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record)
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload()
                  }
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

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey="roleId"
        key="roleList"
        columns={columns}
        request={(params) =>
          listRole(params).then((res) => {
            return {
              data: res.rows,
              total: res.total,
              success: true,
            }
          })
        }
        pagination={{
          ...pagination,
          showTotal: (total) => `总共 ${total} 条`,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={async () => {
              treeselect().then((res) => {
                if (res.code === 200) {
                  const treeData = formatTreeSelectData(res.data)
                  setMenuTree(treeData)
                  setMenuIds([])
                  setModalVisible(true)
                  setCurrentRow(undefined)
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
            onClick={async () => {
              const success = await handleRemove(selectedRowsState)
              if (success) {
                setSelectedRows([])
                actionRef.current?.reload()
              }
            }}
          >
            批量删除
          </Button>,
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
          },
        }}
      />
      <UpdateForm
        onSubmit={async (values) => {
          let success = false
          if (values.roleId) {
            success = await handleUpdate({ ...values })
          } else {
            success = await handleAdd({ ...values })
          }
          if (success) {
            setModalVisible(false)
            setCurrentRow(undefined)
            if (actionRef.current) {
              actionRef.current.reload()
            }
          }
        }}
        onCancel={() => {
          setModalVisible(false)
          setCurrentRow(undefined)
        }}
        visible={modalVisible}
        values={currentRow || {}}
        menuTree={menuTree || []}
        menuCheckedKeys={menuIds || []}
        statusOptions={statusOptions}
      />
    </>
  )
}

export default RoleTableList
