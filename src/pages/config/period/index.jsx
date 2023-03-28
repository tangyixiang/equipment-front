import React, { useRef, useState } from 'react'
import TableList from '@/components/Table/TableList'
import {
  listPeriod,
  delPeriod,
  addPeriod,
  updatePeriod,
  changePeriodStatus,
} from '@/api/config/period'
import FormContent from './components/FormContent'
import { Switch } from 'antd'

function EmployeeTableList() {
  const formRef = useRef()
  const [tableRef, setTableRef] = useState()

  const columns = [
    {
      dataIndex: 'period',
      title: '会计期间',
      valueType: 'text',
    },
    {
      dataIndex: 'value',
      title: '凭证号起始值',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      dataIndex: 'open',
      title: '会计状态',
      valueType: 'select',
      valueEnum: {
        0: '关闭',
        1: '打开',
      },
      render: (value, record) => (
        <Switch
          key={record.id}
          checked={record.open}
          onChange={(checked) => openChange(checked, record)}
        />
      ),
    },
  ]

  function openChange(checked, record) {
    changePeriodStatus({ ...record, open: checked })
    tableRef.current.reload()
  }

  const crud = {
    add: addPeriod,
    update: updatePeriod,
    del: delPeriod,
    list: listPeriod,
  }

  const optionBtn = {
    view: true,
    edit: true,
    del: true,
  }

  const modalContent = {
    title: '会计期间',
    width: '30%',
    formRef: formRef,
    children: <FormContent formRef={formRef} />,
  }

  return (
    <>
      <TableList
        rowKey={'id'}
        tableRef={setTableRef}
        columns={columns}
        initData={false}
        func={crud}
        optionBtn={optionBtn}
        labelWidth={80}
        contianModal
        modalContent={modalContent}
      />
    </>
  )
}

export default EmployeeTableList
