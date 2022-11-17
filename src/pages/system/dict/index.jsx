import { Button, message, Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import UpdateForm from './components/edit'
import { Search, Table, useTable, withTable } from 'table-render'
import { addType, updateType, delType, listType } from '@/api/system/dict/type'
import { getDicts } from '@/api/system/dict/data'
import { useParams } from 'react-router-dom'
import DictData from './components/data'

const schema = {
  type: 'object',
  properties: {
    roleName: {
      title: '字典名称',
      type: 'string',
      width: '25%',
    },
    dictType: {
      title: '字典类型',
      type: 'string',
      width: '25%',
    },
    status: {
      title: '状态',
      type: 'string',
      enum: ['0', '1'],
      enumNames: ['正常', '停用'],
      width: '25%',
      widget: 'select',
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
    const resp = await addType({ ...fields })
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
    const resp = await updateType(fields)
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
    const resp = await delType(selectedRows.map((row) => row.dictId).join(','))
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
    const params = [selectedRow.dictId]
    const resp = await delType(params.join(','))
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

const Dict = () => {
  const { refresh } = useTable()
  const [modalVisible, setModalVisible] = useState(false)
  const [showDictData, setShowDictData] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [statusOptions, setStatusOptions] = useState([])

  let { type } = useParams()

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
      title: '字典主键',
      dataIndex: 'dictId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      valueType: 'text',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
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
          // hidden={!access.hasPerms('system:dictType:edit')}
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
          key="editData"
          // hidden={!access.hasPerms('system:dictType:edit')}
          onClick={() => {
            setShowDictData(true)
            setCurrentRow(record)
          }}
        >
          字典数据
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          // hidden={!access.hasPerms('system:dictType:remove')}
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
      group: type,
    }
    // console.log('params >>> ', requestParams)

    return listType(requestParams).then((res) => {
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
          rowKey="dictId"
          key="dictTypeList"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          toolbarRender={() => [
            <Button
              type="primary"
              key="add"
              // hidden={!access.hasPerms('system:dictType:add')}
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
              // hidden={selectedRowsState?.length === 0 || !access.hasPerms('system:dictType:remove')}
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
          values.group = type
          if (values.dictId) {
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
      <DictData
        showData={showDictData}
        values={currentRow || {}}
        onCancel={() => {
          setShowDictData(false)
          setCurrentRow(undefined)
        }}
      />
    </>
  )
}

export default withTable(Dict)
