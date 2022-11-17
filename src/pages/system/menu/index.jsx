import { Button, message, Modal } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import UpdateForm from './components/edit'
import { Search, Table, useTable, withTable } from 'table-render'
import { addMenu, updateMenu, delMenu, listMenu } from '@/api/system/menu'
import { getDicts } from '@/api/system/dict/data'
import { createIcon } from '@/utils/IconUtils'
import { buildTreeData } from '@/utils/common'

const schema = {
  type: 'object',
  properties: {
    menuName: {
      title: '菜单名称',
      type: 'string',
      width: '25%',
    },
    perms: {
      title: '权限标识',
      type: 'string',
      width: '25%',
    },
    menuType: {
      title: '菜单类型',
      type: 'string',
      enum: ['M', 'C', 'F'],
      enumNames: ['目录', '菜单', '按钮'],
      width: '25%',
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
    const resp = await addMenu({ ...fields })
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
    const resp = await updateMenu(fields)
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
    const resp = await delMenu(selectedRows.map((row) => row.menuId).join(','))
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
    const params = [selectedRow.menuId]
    const resp = await delMenu(params.join(','))
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

function Menu() {
  const { refresh } = useTable()

  const [modalVisible, setModalVisible] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [menuTree, setMenuTree] = useState([])
  const [visibleOptions, setVisibleOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])

  useEffect(() => {
    getDicts('sys_show_hide').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setVisibleOptions(opts)
      }
    })
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
      title: '菜单名称',
      dataIndex: 'menuName',
      valueType: 'text',
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      valueType: 'text',
      render: (text) => createIcon(text),
    },
    {
      title: '显示顺序',
      dataIndex: 'orderNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      valueType: 'text',
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      valueType: 'select',
      enum: {
        M: '目录',
        C: '菜单',
        F: '按钮',
      },
      hideInTable: true,
    },
    {
      title: '菜单状态',
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
          key="edit"
          // hidden={!access.hasPerms('system:menu:edit')}
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
          // hidden={!access.hasPerms('system:menu:remove')}
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
    return listMenu(params).then((res) => {
      const menu = { id: 0, label: '主类目', children: [], value: 0 }
      const memuData = buildTreeData(res.data, 'menuId', 'menuName', '', '', '')
      menu.children = memuData
      const treeData = []
      treeData.push(menu)
      setMenuTree(treeData)
      return {
        rows: memuData,
        total: 0,
        success: true,
      }
    })
  }

  return (
    <>
      <div style={{ width: '100%', float: 'right' }}>
        <Search schema={schema} api={searchApi} displayType="row" />
        <Table
          rowKey="menuId"
          key="menuList"
          toolbarRender={() => [
            <Button
              type="primary"
              key="add"
              // hidden={!access.hasPerms('system:menu:add')}
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
              // hidden={selectedRowsState?.length === 0 || !access.hasPerms('system:menu:remove')}
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
          if (values.menuId) {
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
        visibleOptions={visibleOptions}
        statusOptions={statusOptions}
        menuTree={menuTree}
      />
    </>
  )
}

export default withTable(Menu)
