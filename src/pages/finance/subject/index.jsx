import React, { useState, useEffect } from 'react'
import { Button, Modal, message } from 'antd'
import { Search, Table, useTable, withTable } from 'table-render'
import UpdateForm from './components/edit'
import { listSubject, delSubject } from '@/api/finance/subject'

import { getDicts } from '@/api/system/dict/data'

const handleRemoveOne = async (selectedRow) => {
  if (!selectedRow) return true
  try {
    const params = [selectedRow.userId]
    const resp = await delSubject(params.join(','))
    if (resp.code === 200) {
      message.success('删除成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    message.error('删除失败，请重试')
    return false
  }
}

function SubjectTableList() {
  const { refresh, tableState, setTable } = useTable()
  const [modalVisible, setModalVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [kmOptions, setKmOptions] = useState({})
  const [mappingOptions, setMappingOptions] = useState({})
  const [itemOptions, setItemOptions] = useState({})

  useEffect(() => {
    getDicts('km_category').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setKmOptions(opts)
      }
    })
    getDicts('km_mapping').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setMappingOptions(opts)
      }
    })
    getDicts('item_category').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setItemOptions(opts)
      }
    })
  }, [])

  const schema = {
    type: 'object',
    properties: {
      mappingId: {
        title: '科目映射关系',
        type: 'string',
        width: '30%',
        widget: 'select',
        enum: Object.keys(mappingOptions),
        enumNames: Object.values(mappingOptions),
      },
      value: {
        title: '会计科目值',
        type: 'string',
        width: '25%',
      },
    },
    labelWidth: 120,
  }

  const columns = [
    {
      dataIndex: 'categoryId',
      title: '科目分类',
      valueType: 'select',
      enum: kmOptions,
    },
    {
      dataIndex: 'mappingId',
      title: '科目映射关系',
      valueType: 'select',
      enum: mappingOptions,
    },
    {
      dataIndex: 'itemId',
      title: '项目名称',
      valueType: 'select',
      enum: itemOptions,
    },
    {
      dataIndex: 'value',
      title: '科目值',
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
          // hidden={!access.hasPerms('system:user:edit')}
          onClick={() => {
            setCurrentRow(record)
            setModalVisible(true)
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
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
    // console.log('params >>> ', requestParams)
    return listSubject(requestParams)
      .then((res) => {
        return {
          rows: res.rows,
          total: res.total,
          extraData: res.code,
        }
      })
      .catch((e) => {
        console.log('Oops, error', e)
        // 注意一定要返回 rows 和 total
        return {
          rows: [],
          total: 0,
        }
      })
  }

  return (
    <>
      <Search schema={schema} displayType="row" api={searchApi} />
      <Table
        columns={columns}
        rowKey="id"
        key="subjectList"
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `总共 ${total} 条`,
        }}
        toolbarAction
        toolbarRender={() => [
          <Button
            key="primary"
            type="primary"
            onClick={async () => {
              setModalVisible(true)
            }}
          >
            新增科目
          </Button>,
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
          },
        }}
      />
      <UpdateForm
        kmOptions={kmOptions}
        mappingOptions={mappingOptions}
        itemOptions={itemOptions}
        record={currentRow || {}}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setCurrentRow(undefined)
        }}
      />
    </>
  )
}

export default withTable(SubjectTableList)
