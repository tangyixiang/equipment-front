import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal, message } from 'antd'
import TableList from '@/components/Table/TableList'
import FromContent from './components/FromContent'
import {
  addSubject,
  updateSubject,
  listSubject,
  delSubject,
} from '@/api/finance/subject'
import { getDicts } from '@/api/system/dict/data'

function SubjectTableList() {
  const formRef = useRef()
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

  const columns = [
    {
      dataIndex: 'categoryId',
      title: '科目分类',
      valueType: 'select',
      valueEnum: kmOptions,
    },
    {
      dataIndex: 'mappingId',
      title: '科目映射关系',
      valueType: 'select',
      valueEnum: mappingOptions,
    },
    {
      dataIndex: 'itemId',
      title: '项目名称',
      width: '30%',
      valueType: 'select',
      valueEnum: itemOptions,
    },
    {
      dataIndex: 'value',
      title: '科目值',
      width: '20%',
      valueType: 'text',
    },
  ]

  const crud = {
    add: addSubject,
    update: updateSubject,
    del: delSubject,
    list: listSubject,
  }

  const modalContent = {
    title: '科目信息',
    width: '40%',
    formRef: formRef,
    children: (
      <FromContent
        formRef={formRef}
        kmOptions={kmOptions}
        itemOptions={itemOptions}
        mappingOptions={mappingOptions}
      />
    ),
  }

  return (
    <>
      <TableList
        rowKey={'id'}
        columns={columns}
        initData={false}
        func={crud}
        labelWidth={100}
        contianModal={true}
        modalContent={modalContent}
      />
    </>
  )
}

export default SubjectTableList
