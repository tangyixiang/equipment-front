import { Button, Upload } from 'antd'
import React, { useState, useEffect } from 'react'
import { Search, Table, useTable, withTable } from 'table-render'
import { listOperating } from '@/api/finance/invoice'
import { download } from '@/utils/request'
import UploadForm from './components/upload'

const schema = {
  type: 'object',
  properties: {
    invoicingPeriod: {
      title: '发票期间',
      type: 'string',
      width: '25%',
    },
  },
}

const FinanceTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [uploadModal, setUploadModal] = useState(false)
  const { refresh } = useTable()

  const columns = [
    { dataIndex: 'invoicingPeriod', valueType: 'text', title: '发票期间' },
    { dataIndex: 'invoicingDate', valueType: 'text', title: '开票时间' },
    { dataIndex: 'orgName', valueType: 'text', title: '单位名称' },
    { dataIndex: 'invoicingOrgName', valueType: 'text', title: '开票机构' },
    { dataIndex: 'invoiceBm', valueType: 'text', title: '票据编码' },
    { dataIndex: 'invoiceName', valueType: 'text', title: '票据名称' },
    { dataIndex: 'invoiceCode', valueType: 'text', title: '票据代码' },
    { dataIndex: 'invoiceId', valueType: 'text', title: '票号' },
    { dataIndex: 'payer', valueType: 'text', title: '缴款人' },
    {
      dataIndex: 'socialCreditCode',
      valueType: 'text',
      title: '社会统一信用代码',
    },
    { dataIndex: 'printed', valueType: 'text', title: '已打印' },
    { dataIndex: 'redInvoiceFlag', valueType: 'text', title: '已开红票' },
    { dataIndex: 'paperInvoiceNo', valueType: 'text', title: '相关纸质票号' },
    {
      dataIndex: 'electronInvoiceNo',
      valueType: 'text',
      title: '相关电子票号',
    },
    { dataIndex: 'checkCode', valueType: 'text', title: '校验码' },
    { dataIndex: 'creator', valueType: 'text', title: '编制人' },
    { dataIndex: 'itemCode', valueType: 'text', title: '项目编码' },
    { dataIndex: 'itemName', valueType: 'text', title: '项目名称' },
    { dataIndex: 'unit', valueType: 'text', title: '计量单位' },
    { dataIndex: 'quantity', valueType: 'text', title: '数量' },
    { dataIndex: 'standard', valueType: 'text', title: '标准' },
    { dataIndex: 'price', valueType: 'text', title: '金额' },
    { dataIndex: 'remark', valueType: 'text', title: '备注' },
    { dataIndex: 'status', valueType: 'text', title: '状态' },
    { dataIndex: 'dataSplit', valueType: 'text', title: '分录生成标识' },
    { dataIndex: 'version', valueType: 'text', title: '版本' },
  ]

  const searchApi = (params) => {
    const requestParams = {
      ...params,
      pageNum: params.current,
    }
    // console.log('params >>> ', requestParams)

    return listOperating(requestParams).then((res) => {
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
            x: 4600,
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
                  '/invoice/finance/template/download',
                  {},
                  '财政发票导入模板.xlsx'
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
        path={'/invoice/finance/upload'}
        refresh={refresh}
      />
    </>
  )
}

export default withTable(FinanceTableList)
