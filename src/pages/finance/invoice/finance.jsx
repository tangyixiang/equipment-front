import { Button } from 'antd'
import React, { useState, useRef } from 'react'
import { listFinance } from '@/api/finance/invoice'
import { download } from '@/utils/request'
import UploadForm from './components/upload'
import ProTable from '@ant-design/pro-table'

const FinanceTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [uploadModal, setUploadModal] = useState(false)
  const actionRef = useRef()

  const columns = [
    { dataIndex: 'invoicingPeriod', valueType: 'text', title: '发票期间' },
    {
      dataIndex: 'invoicingDate',
      valueType: 'text',
      title: '开票时间',
      hideInSearch: true,
    },
    {
      dataIndex: 'orgName',
      valueType: 'text',
      title: '单位名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'invoicingOrgName',
      valueType: 'text',
      title: '开票机构',
      hideInSearch: true,
    },
    {
      dataIndex: 'invoiceBm',
      valueType: 'text',
      title: '票据编码',
      hideInSearch: true,
    },
    {
      dataIndex: 'invoiceName',
      valueType: 'text',
      title: '票据名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'invoiceCode',
      valueType: 'text',
      title: '票据代码',
      hideInSearch: true,
    },
    {
      dataIndex: 'invoiceId',
      valueType: 'text',
      title: '票号',
      hideInSearch: true,
    },
    {
      dataIndex: 'payer',
      valueType: 'text',
      title: '缴款人',
      hideInSearch: true,
    },
    {
      dataIndex: 'socialCreditCode',
      valueType: 'text',
      title: '社会统一信用代码',
      hideInSearch: true,
    },
    {
      dataIndex: 'printed',
      valueType: 'text',
      title: '已打印',
      hideInSearch: true,
    },
    {
      dataIndex: 'redInvoiceFlag',
      valueType: 'text',
      title: '已开红票',
      hideInSearch: true,
    },
    {
      dataIndex: 'paperInvoiceNo',
      valueType: 'text',
      title: '相关纸质票号',
      hideInSearch: true,
    },
    {
      dataIndex: 'electronInvoiceNo',
      valueType: 'text',
      title: '相关电子票号',
      hideInSearch: true,
    },
    {
      dataIndex: 'checkCode',
      valueType: 'text',
      title: '校验码',
      hideInSearch: true,
    },
    {
      dataIndex: 'creator',
      valueType: 'text',
      title: '编制人',
      hideInSearch: true,
    },
    {
      dataIndex: 'itemCode',
      valueType: 'text',
      title: '项目编码',
      hideInSearch: true,
    },
    {
      dataIndex: 'itemName',
      valueType: 'text',
      title: '项目名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'unit',
      valueType: 'text',
      title: '计量单位',
      hideInSearch: true,
    },
    {
      dataIndex: 'quantity',
      valueType: 'text',
      title: '数量',
      hideInSearch: true,
    },
    {
      dataIndex: 'standard',
      valueType: 'text',
      title: '标准',
      hideInSearch: true,
    },
    {
      dataIndex: 'price',
      valueType: 'text',
      title: '金额',
      hideInSearch: true,
    },
    {
      dataIndex: 'remark',
      valueType: 'text',
      title: '备注',
      hideInSearch: true,
    },
    {
      dataIndex: 'status',
      valueType: 'text',
      title: '状态',
      hideInSearch: true,
    },
    {
      dataIndex: 'dataSplit',
      valueType: 'text',
      title: '分录生成标识',
      hideInSearch: true,
      render: (_, record) => <span>{record.dataSplit ? '是' : '否'}</span>,
    },
    {
      dataIndex: 'version',
      valueType: 'text',
      title: '版本',
      hideInSearch: true,
    },
  ]

  return (
    <>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          key="tablelist"
          scroll={{
            x: 4600,
          }}
          columns={columns}
          request={(params) =>
            listFinance(params).then((res) => {
              const result = {
                data: res.rows,
                total: res.total,
                success: true,
              }
              return result
            })
          }
          pagination={{
            defaultPageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          toolBarRender={() => [
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
        actionRef={actionRef}
      />
    </>
  )
}

export default FinanceTableList
