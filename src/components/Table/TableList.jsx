import React, { useEffect, useRef, useState } from 'react'
import { Button, message, Modal } from 'antd'
import ProTable from '@ant-design/pro-table'
import TableModal from './TableModal'
import { pagination } from '@/constants'

function TableList(props) {
  const { func, optionBtn, rowKey, columns, scroll, labelWidth } = props
  const extratoolBar = props.extratoolBar || []
  const hasModal = props.contianModal != undefined

  /**
   * 关闭Modal
   */
  const closeModal = () => {
    setCurrentRow(undefined)
    // props.onVisible(false)
    setModalVisible(false)
  }

  /**
   * 添加节点
   *
   * @param fields
   */
  const handleAdd = async (fields) => {
    const resp = await func.add({ ...fields })
    if (resp.code === 200) {
      message.success('保存成功')
      return true
    } else {
      return false
    }
  }

  /**
   * 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields) => {
    const resp = await func.update(fields)
    if (resp.code === 200) {
      message.success('保存成功')
      return true
    } else {
      return false
    }
  }

  /**
   * 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows) => {
    if (!selectedRows) return true
    const resp = await func.del(
      selectedRows.map((row) => row[rowKey]).join(',')
    )
    if (resp.code === 200) {
      message.success('删除成功')
      return true
    } else {
      return false
    }
  }

  /**
   * 删除节点
   *
   * @param selectedRow
   */
  const handleRemoveOne = async (selectedRow) => {
    if (!selectedRow) return true
    const params = []
    params.push(selectedRow[rowKey])
    const resp = await func.del(params.join(','))
    if (resp.code === 200) {
      message.success('删除成功')
      return true
    } else {
      return false
    }
  }

  const actionRef = useRef()
  const [readOnly, setReadOnly] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  // const [renderColumn, setRenderColumn] = useState(columns)

  // 执行初始化方法
  useEffect(() => {
    props.initData && func.init()
    if (props.tableRef) {
      props.tableRef(actionRef)
    }
  }, [])

  const viewOption = (record) => {
    return (
      optionBtn.view && (
        <Button
          type="link"
          size="small"
          key="view"
          // hidden={!access.hasPerms('system:user:edit')}
          onClick={() => {
            setCurrentRow(record)
            setReadOnly(true)
            setModalVisible(true)
          }}
        >
          查看
        </Button>
      )
    )
  }

  const editOption = (record) => {
    return (
      optionBtn.edit && (
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('system:user:edit')}
          onClick={() => {
            setCurrentRow(record)
            setReadOnly(false)
            setModalVisible(true)
          }}
        >
          {optionBtn.editName || '编辑'}
        </Button>
      )
    )
  }

  const delOption = (record) => {
    return (
      optionBtn.del && (
        <Button
          type="link"
          size="small"
          danger
          key="remove"
          // hidden={!access.hasPerms('system:user:remove')}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record)
                if (success) {
                  actionRef.current.reload()
                }
              },
            })
          }}
        >
          {optionBtn.del?.name || '删除'}
        </Button>
      )
    )
  }

  const options = {
    title: '操作',
    width: '220px',
    hideInSearch: true,
    render: (_, record) => [
      viewOption(record),
      editOption(record),
      delOption(record),
    ],
  }

  // 每一行添加操作选项
  const result = columns.some((element) => element.title == '操作')
  if (!result && Object.values(optionBtn).indexOf(true) > -1) {
    columns.push(options)
  }

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey={rowKey}
        key="TableList"
        scroll={scroll ? scroll : undefined}
        columns={columns}
        search={{
          labelWidth: labelWidth,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            hidden={props.toolBar?.Add.hidden}
            onClick={async () => {
              setCurrentRow(undefined)
              setModalVisible(true)
            }}
          >
            {props.toolBar?.Add.name || '新建'}
          </Button>,
          <Button
            type="primary"
            danger
            key="remove"
            hidden={props.toolBar?.Del.hidden}
            onClick={async () => handleRemove(selectedRowsState)}
          >
            {props.toolBar?.Del.name || '删除'}
          </Button>,
          ...extratoolBar,
        ]}
        pagination={{
          ...pagination,
          showTotal: (total) => `总共 ${total} 条`,
        }}
        request={(params) =>
          func.list(params).then((res) => {
            const result = {
              data: res.rows,
              total: res.total,
              success: true,
            }
            return result
          })
        }
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
            if (props.selectRow) {
              props.selectRow(selectedRows)
            }
          },
        }}
      />
      {hasModal && (
        <TableModal
          readOnly={readOnly}
          onSubmit={async (values) => {
            let success = false
            if (currentRow && currentRow[rowKey]) {
              values[rowKey] = currentRow[rowKey]
              success = await handleUpdate(values)
            } else {
              success = await handleAdd(values)
            }
            if (success) {
              closeModal()
              actionRef.current.reload()
            }
          }}
          onCancel={closeModal}
          visible={modalVisible}
          values={currentRow || {}}
          content={props.modalContent || {}}
        />
      )}
    </>
  )
}

export default TableList
