import { Button, message, Modal } from 'antd'
import React, { useState, useRef } from 'react'
import {
  listContract,
  addContract,
  updateContract,
  delContract,
} from '@/api/examine/contract'
import ContractInfo from './components/ContractInfo'
import { useNavigate } from 'react-router-dom'
import ProTable from '@ant-design/pro-table'

const schema = {
  type: 'object',
  properties: {
    contractCode: {
      title: '合同编号',
      type: 'string',
      width: '25%',
    },
    name: {
      title: '合同名称',
      type: 'string',
      width: '25%',
    },
    seater: {
      title: '合同类型',
      type: 'string',
      enum: ['1', '2'],
      enumNames: ['固定期限合同', '非固定期限合同'],
      width: '25%',
      widget: 'select',
    },
    sellOrgId: {
      title: '乙方单位',
      type: 'string',
      width: '25%',
    },
    contractSignDateStart: {
      title: '合同签订日期',
      type: 'range',
      format: 'date',
      // widget: 'dateRange',
      width: '25%',
    },
    status: {
      title: '合同状态',
      type: 'string',
      enum: ['1', '2'],
      enumNames: ['生效中', '已失效'],
      width: '25%',
      widget: 'select',
    },
  },
  // labelWidth: 120,
}

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addContract({ ...fields })
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
    const resp = await updateContract(fields)
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
    const resp = await delContract(selectedRows.map((row) => row.id).join(','))
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
    const params = [selectedRow.id]
    const resp = await delContract(params.join(','))
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

const ContractTableList = () => {
  const actionRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  let navigate = useNavigate()

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '合同编号',
      dataIndex: 'contractCode',
      valueType: 'text',
    },
    {
      title: '合同名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      valueType: 'select',
      enum: {
        1: '固定期限合同',
        2: '非固定期限合同',
      },
    },
    {
      title: '乙方单位',
      dataIndex: 'sellOrgId',
      valueType: 'text',
    },
    {
      title: '合同签订日期',
      dataIndex: 'contractSignDate',
      valueType: 'text',
    },
    {
      title: '合同生效日期',
      dataIndex: 'startDate',
      valueType: 'text',
    },
    {
      title: '合同截止日期',
      dataIndex: 'endDate',
      valueType: 'text',
    },

    {
      title: '合同状态',
      dataIndex: 'status',
      valueType: 'select',
      enum: {
        1: '生效中',
        2: '已失效',
      },
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
            setReadOnly(false)
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
            setModalVisible(true)
            setReadOnly(true)
            setCurrentRow(record)
          }}
        >
          查看
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
                  actionRef.current?.reload()
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
        rowKey="id"
        key="companyCarList"
        columns={columns}
        request={(params) =>
          listContract(params).then((res) => {
            return {
              data: res.rows,
              total: res.total,
              success: true,
            }
          })
        }
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `总共 ${total} 条`,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            // hidden={!access.hasPerms('system:dictType:add')}
            onClick={async () => {
              setModalVisible(true)
              setReadOnly(false)
              setCurrentRow(undefined)
              navigate('/examine/contract/info', {
                state: { title: '合同新增' },
              })
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
    </>
  )
}

export default ContractTableList
