import React, { useState, useEffect } from 'react'
import FormContent from './components/FormContent'
import {
  listAccount,
  addAccount,
  updateAccount,
  delAccount,
} from '@/api/finance/bankaccount'
import TableList from '@/components/Table/TableList'
import { useRef } from 'react'

function BankAccountTableList() {
  const formRef = useRef()

  useEffect(() => {}, [])

  const columns = [
    {
      title: '开户名',
      dataIndex: 'accountName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '账号别名',
      dataIndex: 'aliasName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '账号',
      dataIndex: 'account',
      valueType: 'text',
    },
    {
      title: '开户行',
      dataIndex: 'bankName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '开户日期',
      dataIndex: 'openDate',
      hideInSearch: true,
      valueType: 'text',
    },
  ]

  const crud = {
    add: addAccount,
    update: updateAccount,
    del: delAccount,
    list: listAccount,
  }

  const optionBtn = {
    view: false,
    edit: true,
    del: true,
  }

  const modalContent = {
    title: '职员信息',
    width: '640px',
    formRef: formRef,
    children: <FormContent formRef={formRef} />,
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
        contianModal
        modalContent={modalContent}
      />
    </>
  )
}

export default BankAccountTableList
