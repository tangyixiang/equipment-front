import React, { useState, useEffect } from 'react'
import { Button, Modal, message } from 'antd'
import { Search, Table, useTable, withTable } from 'table-render'
import UpdateForm from './components/edit'
import {
  listEmployee,
  delEmployee,
  addEmployee,
  updateEmployee,
} from '@/api/config/employee'
import { listPost, optionselect } from '@/api/system/post'
import { listDept, getDeptTreeList } from '@/api/system/dept'

const handleRemoveOne = async (selectedRow) => {
  if (!selectedRow) return true
  try {
    const params = [selectedRow.userId]
    const resp = await delEmployee(params.join(','))
    if (resp.code === 200) {
      message.success('删除成功')
    }
    return true
  } catch (error) {
    message.error('删除失败，请重试')
    return false
  }
}

function EmployeeTableList() {
  const { refresh } = useTable()
  const [modalVisible, setModalVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [postList, setPostList] = useState()
  const [deptTree, setDeptTree] = useState()

  const [postMap, setPostMap] = useState({})
  const [deptMap, setDeptMap] = useState({})

  useEffect(() => {
    listPost().then((res) => {
      if (res.code === 200) {
        setPostList(
          res.rows.map((item) => {
            return {
              value: item.postId,
              label: item.postName,
            }
          })
        )
      }
      let opts = {}
      res.rows.forEach((item) => (opts[item.postId] = item.postName))
      setPostMap(opts)
    })
    listDept({}).then((res) => {
      let opts = {}
      res.data.forEach((item) => (opts[item.deptId] = item.deptName))
      setDeptMap(opts)
    })
    getDeptTreeList({}).then((treeData) => {
      setDeptTree(treeData)
    })
  }, [])

  const schema = {
    type: 'object',
    properties: {
      nickName: {
        title: '职员名称',
        type: 'string',
        width: '25%',
      },
    },
    labelWidth: 120,
  }

  const columns = [
    {
      dataIndex: 'userCode',
      title: '编号',
      valueType: 'text',
    },
    {
      dataIndex: 'nickName',
      title: '职员名称',
      valueType: 'text',
    },
    {
      dataIndex: 'deptId',
      title: '所在部门',
      valueType: 'text',
      render: (text, row, _, action) => {
        return <div>{deptMap[text]}</div>
      },
    },
    {
      dataIndex: 'hireType',
      title: '人员性质',
      valueType: 'select',
      enum: {
        1: '在编',
        2: '聘用',
      },
    },
    {
      dataIndex: 'postId',
      title: '岗位',
      valueType: 'text',
      render: (text, row, _, action) => {
        return <div>{postMap[text]}</div>
      },
    },
    {
      dataIndex: 'positionId',
      title: '职务',
      valueType: 'text',
    },
    {
      dataIndex: 'status',
      title: '职员状态',
      valueType: 'select',
      enum: {
        0: '启用',
        1: '禁用',
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
    return listEmployee(requestParams)
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
        key="EmployeeList"
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
            onClick={() => setModalVisible(true)}
          >
            新增
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
          if (currentRow.id) {
            success = await updateEmployee({ id: currentRow.id, ...values })
          } else {
            success = addEmployee(values)
          }
          if (success) {
            message.success('保存成功')
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
        posts={postList || []}
        depts={deptTree || []}
      />
    </>
  )
}

export default withTable(EmployeeTableList)
