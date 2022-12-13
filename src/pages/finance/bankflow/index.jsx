import { Button } from 'antd'
import React, { useState, useEffect } from 'react'

import { Search, Table, useTable, withTable } from 'table-render'
import { listBankFlow } from '@/api/finance/bankflow'

import { download } from '@/utils/request'
import UploadForm from './components/upload'

const schema = {
  type: 'object',
  properties: {
    selfAccount: {
      title: '本方账号',
      type: 'string',
      width: '25%',
    },
    tradeTimeArray: {
      title: '交易日期',
      type: 'range',
      format: 'date',
      width: '25%',
    },
    adversaryBankCode: {
      title: '对方行号',
      type: 'string',
      width: '25%',
    },
    adversaryAccount: {
      title: '对方账号',
      type: 'string',
      width: '25%',
    },
    adversaryOrgName: {
      title: '对方单位名称',
      type: 'string',
      width: '25%',
    },
    summary: {
      title: '摘要',
      type: 'string',
      width: '25%',
    },
    comment: {
      title: '用途',
      type: 'string',
      width: '25%',
    },
  },
}

const BankFlowTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [uploadModal, setUploadModal] = useState(false)
  const { refresh } = useTable()

  const columns = [
    {
      title: '流水ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '凭证号',
      dataIndex: 'bankSiteCode',
      valueType: 'text',
    },
    {
      title: '本方账号',
      dataIndex: 'selfAccount',
      valueType: 'text',
    },
    {
      title: '对方账号',
      dataIndex: 'adversaryAccount',
      valueType: 'text',
    },
    {
      title: '交易时间',
      dataIndex: 'tradeTime',
      valueType: 'text',
    },
    {
      title: '借/贷',
      dataIndex: 'tradeType',
      valueType: 'select',
      enum: {
        1: '借',
        2: '贷',
      },
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'price',
      valueType: 'text',
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
      width: 300,
    },
    {
      title: '对账标识',
      dataIndex: 'reconciliationFlag',
      valueType: 'select',
      enum: {
        1: 'Y',
        2: 'N',
      },
      width: 100,
    },
    {
      title: '对账类别',
      dataIndex: 'reconciliationModel',
      valueType: 'select',
      enum: {
        1: '自动',
        2: '手动',
      },
      width: 100,
    },
    {
      title: '应收对账ID',
      dataIndex: 'associationId',
      valueType: 'text',
    },
  ]

  const searchApi = (params) => {
    console.log(params)
    const requestParams = {
      ...params,
      pageNum: params.current,
    }

    return listBankFlow(requestParams).then((res) => {
      const result = {
        rows: res.rows,
        total: res.total,
        success: true,
      }
      return result
    })
  }

  return (
    <>
      <div style={{ width: '100%', float: 'right' }}>
        <Search schema={schema} api={searchApi} displayType="row" />
        <Table
          rowKey="id"
          key="tablelist"
          scroll={{
            x: 2500,
          }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          toolbarAction
          toolbarRender={() => [
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
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows)
            },
          }}
        />
      </div>

      <UploadForm
        visible={uploadModal}
        onCancel={setUploadModal}
        refresh={refresh}
      />
    </>
  )
}

export default withTable(BankFlowTableList)
