import { Button, message, Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import CardInfo from './components/edit'
import { listCar, addCar, updateCar, delCar } from '@/api/office/car'
import ProTable from '@ant-design/pro-table'
import { useRef } from 'react'

const schema = {
  type: 'object',
  properties: {
    plateNumber: {
      title: '车牌号',
      type: 'string',
      width: '16%',
    },
    carType: {
      title: '车辆类别',
      type: 'string',
      enum: ['1', '2', '3', '4'],
      enumNames: ['轿车', 'SUV', '皮卡', 'MPV'],
      width: '16%',
      widget: 'select',
    },
    seater: {
      title: '车辆品牌',
      type: 'string',
      enum: ['1', '2'],
      enumNames: ['5座', '7座'],
      width: '16%',
      widget: 'select',
    },
    brand: {
      title: '车辆品牌',
      type: 'string',
      width: '16%',
    },
    status: {
      title: '状态',
      type: 'string',
      enum: ['1', '2', '3'],
      enumNames: ['正常', '停用', '报废'],
      width: '16%',
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
    const resp = await addCar({ ...fields })
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
    const resp = await updateCar(fields)
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
    const resp = await delCar(selectedRows.map((row) => row.id).join(','))
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
    const resp = await delCar(params.join(','))
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

const CarTableList = () => {
  const actionRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const [readOnly, setReadOnly] = useState(false)

  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  useEffect(() => {}, [])

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '车座',
      dataIndex: 'seater',
      valueType: 'select',
      enum: {
        1: '5座',
        2: '7座',
      },
    },
    {
      title: '车辆类别',
      dataIndex: 'carType',
      valueType: 'select',
      enum: {
        1: '轿车',
        2: 'SUV',
        3: '皮卡',
        4: 'MPV',
      },
    },
    {
      title: '车辆品牌',
      dataIndex: 'brand',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      enum: {
        1: '正常',
        2: '停用',
        3: '报废',
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      valueType: 'text',
    },
    {
      title: '操作',
      width: '220px',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
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
        request={(params) =>
          listCar(params).then((res) => {
            const result = {
              data: res.rows,
              total: res.total,
              success: true,
            }
            return result
          })
        }
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            // hidden={!access.hasPerms('system:dictType:add')}
            onClick={async () => {
              setModalVisible(true)
              setReadOnly(false)
              setCurrentRow(undefined)
              // history.push('/office/car/info')
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
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
          },
        }}
      />
      <CardInfo
        title={'新增车辆'}
        open={modalVisible}
        record={currentRow || {}}
        readOnly={readOnly}
        onCancel={setModalVisible}
        onSubmit={async (values) => {
          let success = false
          if (values.id) {
            success = await handleUpdate({ ...values })
          } else {
            success = await handleAdd({ ...values })
          }
          if (success) {
            setModalVisible(false)
            setCurrentRow(undefined)
            actionRef.current?.reload()
          }
        }}
      />
    </>
  )
}

export default CarTableList
