import React, { useState } from 'react'
import { Button } from 'antd'
import TableList from '@/components/Table/TableList'
import UploadForm from './components/upload'
import { listBankFlow } from '@/api/finance/bankflow'
import { download } from '@/utils/request'

function BankFlowTableList() {
  const [uploadModal, setUploadModal] = useState(false)
  const [tableRef, setTableRef] = useState()

  const columns = [
    {
      title: '流水ID',
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '凭证号',
      dataIndex: 'bankSiteCode',
      valueType: 'text',
      hideInSearch: true,
      width: 200,
    },
    {
      title: '本方账号',
      dataIndex: 'selfAccount',
      valueType: 'text',
      width: 200,
    },
    {
      title: '对方账号',
      dataIndex: 'adversaryAccount',
      valueType: 'text',
      width: 200,
    },
    {
      title: '交易时间',
      dataIndex: 'tradeTimeArray',
      valueType: 'dateRange',
      render: (_, row, index, action) => row.tradeTime,
    },
    {
      title: '借/贷',
      dataIndex: 'tradeType',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        1: '借',
        2: '贷',
      },
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'price',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '对方行号',
      dataIndex: 'adversaryBankCode',
      valueType: 'text',
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      valueType: 'text',
      width: 300,
    },
    {
      title: '用途',
      dataIndex: 'comment',
      valueType: 'text',
      width: 300,
    },
    {
      title: '对方单位名称',
      dataIndex: 'adversaryOrgName',
      valueType: 'text',
    },
    {
      title: '个性化信息',
      dataIndex: 'otherInfo',
      valueType: 'text',
      hideInSearch: true,
      width: 300,
    },
    {
      title: '对账标识',
      dataIndex: 'reconciliationFlag',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        1: 'Y',
        2: 'N',
      },
      width: 100,
    },
    {
      title: '对账类别',
      dataIndex: 'reconciliationModel',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        1: '自动',
        2: '手动',
      },
      width: 100,
    },
    {
      title: '应收对账ID',
      dataIndex: 'associationId',
      hideInSearch: true,
      valueType: 'text',
    },
  ]

  const crud = {
    list: listBankFlow,
  }

  const optionBtn = {
    view: false,
    edit: false,
    del: false,
  }
  const toolBar = {
    Add: { hidden: true },
    Del: { hidden: true },
  }

  return (
    <>
      <TableList
        rowKey={'id'}
        columns={columns}
        initData={false}
        func={crud}
        tableRef={setTableRef}
        optionBtn={optionBtn}
        labelWidth={100}
        scroll={{
          x: 3000,
        }}
        toolBar={toolBar}
        extratoolBar={[
          <Button
            type="primary"
            key="template"
            onClick={async () => {
              download(
                '/bank/flow/template/download',
                {},
                '银行流水导入模板.xlsx'
              )
            }}
          >
            下载模板
          </Button>,
          <Button onClick={() => setUploadModal(true)}>批量导入</Button>,
        ]}
      />
      <UploadForm
        visible={uploadModal}
        onCancel={() => {
          setUploadModal(false)
          tableRef.current.reload()
        }}
      />
    </>
  )
}

export default BankFlowTableList
