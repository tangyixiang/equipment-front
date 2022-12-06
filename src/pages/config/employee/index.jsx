import React, { useRef, useState } from 'react'
import TableList from '@/components/Table/TableList'
import {
  listEmployee,
  delEmployee,
  addEmployee,
  updateEmployee,
} from '@/api/config/employee'
import FromContent from './components/FromContent'
import { useEffect } from 'react'
import { listPost } from '@/api/system/post'
import { listDept } from '@/api/system/dept'

function EmployeeTableList() {
  const formRef = useRef()
  const [postMap, setPostMap] = useState({})
  const [deptMap, setDeptMap] = useState({})

  useEffect(() => {
    listPost().then((res) => {
      let opts = {}
      res.rows.forEach((item) => (opts[item.postId] = item.postName))
      setPostMap(opts)
    })
    listDept({}).then((res) => {
      let opts = {}
      res.data.forEach((item) => (opts[item.deptId] = item.deptName))
      setDeptMap(opts)
    })
  }, [])

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
      hideInSearch: true,
      valueType: 'text',
      render: (text, row, _, action) => {
        return <div>{deptMap[text]}</div>
      },
    },
    {
      dataIndex: 'hireType',
      title: '人员性质',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        1: '在编',
        2: '聘用',
      },
    },
    {
      dataIndex: 'postId',
      title: '岗位',
      hideInSearch: true,
      valueType: 'text',
      render: (text, row, _, action) => {
        return <div>{postMap[text]}</div>
      },
    },
    {
      dataIndex: 'positionId',
      title: '职务',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      dataIndex: 'status',
      title: '职员状态',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        0: '启用',
        1: '禁用',
      },
    },
  ]

  const crud = {
    add: addEmployee,
    update: updateEmployee,
    del: delEmployee,
    list: listEmployee,
  }

  const optionBtn = {
    view: true,
    edit: true,
    del: true,
  }

  const modalContent = {
    title: '职员信息',
    width: '70%',
    formRef: formRef,
    children: <FromContent formRef={formRef} />,
  }

  return (
    <>
      <TableList
        rowKey={'id'}
        columns={columns}
        initData={false}
        func={crud}
        optionBtn={optionBtn}
        labelWidth={80}
        contianModal={true}
        modalContent={modalContent}
      />
    </>
  )
}

export default EmployeeTableList
