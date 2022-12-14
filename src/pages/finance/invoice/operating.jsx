import { Button } from 'antd'
import React, { useState, useRef } from 'react'
import { listOperating } from '@/api/finance/invoice'
import { download } from '@/utils/request'
import UploadForm from './components/upload'
import ProTable from '@ant-design/pro-table'

const OperatTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [uploadModal, setUploadModal] = useState(false)
  const actionRef = useRef()

  const columns = [
    { dataIndex: 'invoicingPeriod', valueType: 'text', title: '开票期间' },
    {
      dataIndex: 'flowId',
      valueType: 'text',
      title: '流水号',
      hidenInSearch: true,
    },
    {
      dataIndex: 'orderId',
      valueType: 'text',
      hidenInSearch: true,
      title: '订单号',
    },
    {
      dataIndex: 'invoiceCreateTime',
      valueType: 'text',
      hidenInSearch: true,
      title: '发票创建时间',
    },
    {
      dataIndex: 'invoicingTime',
      valueType: 'text',
      hidenInSearch: true,
      title: '开票时间',
    },
    {
      dataIndex: 'redInvoice',
      valueType: 'text',
      hidenInSearch: true,
      title: '红票标志',
    },
    {
      dataIndex: 'invoiceType',
      valueType: 'text',
      hidenInSearch: true,
      title: '发票种类',
    },
    {
      dataIndex: 'invoiceCode',
      valueType: 'text',
      hidenInSearch: true,
      title: '发票代码',
    },
    {
      dataIndex: 'invoiceId',
      valueType: 'text',
      hidenInSearch: true,
      title: '发票号码',
    },
    {
      dataIndex: 'buyerName',
      valueType: 'text',
      hidenInSearch: true,
      title: '购方名称',
    },
    {
      dataIndex: 'buyerTaxId',
      valueType: 'text',
      hidenInSearch: true,
      title: '购方税号',
    },
    {
      dataIndex: 'buyerPhone',
      valueType: 'text',
      hidenInSearch: true,
      title: '购方手机号',
    },
    {
      dataIndex: 'buyerEmail',
      valueType: 'text',
      hidenInSearch: true,
      title: '购方邮箱',
    },
    {
      dataIndex: 'buyerBankInfo',
      valueType: 'text',
      hidenInSearch: true,
      title: '购方开户行及账号',
    },
    {
      dataIndex: 'buyerAddressInfo',
      valueType: 'text',
      hidenInSearch: true,
      title: '购方地址、电话',
    },
    {
      dataIndex: 'productName',
      valueType: 'text',
      hidenInSearch: true,
      title: '商品名称',
    },
    {
      dataIndex: 'productCode',
      valueType: 'text',
      hidenInSearch: true,
      title: '商品编码',
    },
    {
      dataIndex: 'specifications',
      valueType: 'text',
      hidenInSearch: true,
      title: '规格型号',
    },
    {
      dataIndex: 'unit',
      valueType: 'text',
      hidenInSearch: true,
      title: '单位',
    },
    {
      dataIndex: 'quantity',
      valueType: 'text',
      hidenInSearch: true,
      title: '数量',
    },
    {
      dataIndex: 'unitPriceIncludingTax',
      valueType: 'text',
      hidenInSearch: true,
      title: '含税单价',
    },
    {
      dataIndex: 'taxRate',
      valueType: 'text',
      hidenInSearch: true,
      title: '税率',
    },
    {
      dataIndex: 'priceIncludingTax',
      valueType: 'text',
      hidenInSearch: true,
      title: '含税金额',
    },
    {
      dataIndex: 'priceExcludingTax',
      valueType: 'text',
      hidenInSearch: true,
      title: '不含税金额',
    },
    {
      dataIndex: 'taxPrice',
      valueType: 'text',
      hidenInSearch: true,
      title: '税额',
    },
    {
      dataIndex: 'totalPriceIncludingTax',
      valueType: 'text',
      hidenInSearch: true,
      title: '合计含税金额',
    },
    {
      dataIndex: 'totalPriceExcludingTax',
      valueType: 'text',
      hidenInSearch: true,
      title: '合计不含税金额',
    },
    {
      dataIndex: 'totalTaxPrice',
      valueType: 'text',
      hidenInSearch: true,
      title: '合计税额',
    },
    {
      dataIndex: 'remark',
      valueType: 'text',
      hidenInSearch: true,
      title: '备注',
    },
    {
      dataIndex: 'billingStaff',
      valueType: 'text',
      hidenInSearch: true,
      title: '开票员',
    },
    {
      dataIndex: 'payee',
      valueType: 'text',
      hidenInSearch: true,
      title: '收款人',
    },
    {
      dataIndex: 'reviewer',
      valueType: 'text',
      hidenInSearch: true,
      title: '复核人',
    },
    {
      dataIndex: 'store',
      valueType: 'text',
      hidenInSearch: true,
      title: '部门门店',
    },
    {
      dataIndex: 'invoicingMethod',
      valueType: 'text',
      hidenInSearch: true,
      title: '开票方式',
    },
    {
      dataIndex: 'pdfPath',
      valueType: 'text',
      hidenInSearch: true,
      title: 'PDF地址',
    },
    {
      dataIndex: 'invoiceState',
      valueType: 'text',
      hidenInSearch: true,
      title: '开票状态',
    },
    {
      dataIndex: 'specialInvoice',
      valueType: 'text',
      hidenInSearch: true,
      title: '特殊票种',
    },
    {
      dataIndex: 'clearFlag',
      valueType: 'text',
      hidenInSearch: true,
      title: '清单标志',
    },
    {
      dataIndex: 'extCode',
      valueType: 'text',
      hidenInSearch: true,
      title: '分机号',
    },
    {
      dataIndex: 'machineCode',
      valueType: 'text',
      hidenInSearch: true,
      title: '机器编号',
    },
    {
      dataIndex: 'terminalCode',
      valueType: 'text',
      hidenInSearch: true,
      title: '终端号',
    },
    {
      dataIndex: 'checkCode',
      valueType: 'text',
      hidenInSearch: true,
      title: '校验码',
    },
    {
      dataIndex: 'unitPriceExcludingTax',
      valueType: 'text',
      hidenInSearch: true,
      title: '单价（不含税）',
    },
    {
      dataIndex: 'invalidInfo',
      valueType: 'text',
      hidenInSearch: true,
      title: '作废人/时间',
    },
    {
      dataIndex: 'receiverPhone',
      valueType: 'text',
      hidenInSearch: true,
      title: '交付手机',
    },
    {
      dataIndex: 'receiverEmail',
      valueType: 'text',
      hidenInSearch: true,
      title: '交付邮箱',
    },
    {
      dataIndex: 'carInfo',
      valueType: 'text',
      hidenInSearch: true,
      title: '车架号/车辆识别代码',
    },
    {
      dataIndex: 'auctionName',
      valueType: 'text',
      hidenInSearch: true,
      title: '经营/拍卖单位名称',
    },
    {
      dataIndex: 'auctionAddress',
      valueType: 'text',
      hidenInSearch: true,
      title: '经营/拍卖单位地址',
    },
    {
      dataIndex: 'auctionTaxNo',
      valueType: 'text',
      hidenInSearch: true,
      title: '经营/拍卖单位税号',
    },
    {
      dataIndex: 'auctionPhone',
      valueType: 'text',
      hidenInSearch: true,
      title: '经营/拍卖单位电话',
    },
    {
      dataIndex: 'bankInfo',
      valueType: 'text',
      hidenInSearch: true,
      title: '开户行、账号',
    },
    {
      dataIndex: 'dataSplit',
      valueType: 'text',
      hidenInSearch: true,
      title: '分录生成标识',
      render: (_, record) => <span>{record.dataSplit ? '是' : '否'}</span>,
    },
    {
      dataIndex: 'version',
      valueType: 'text',
      hidenInSearch: true,
      title: '版本号',
    },
  ]

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        key="tablelist"
        scroll={{
          x: 9000,
        }}
        columns={columns}
        request={(params) =>
          listOperating({ ...params, pageNum: params.current }).then((res) => {
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
                '/invoice/operating/template/download',
                {},
                '经营发票导入模板.xlsx'
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

      <UploadForm
        visible={uploadModal}
        onCancel={setUploadModal}
        path={'/invoice/operating/upload'}
        actionRef={actionRef}
      />
    </>
  )
}

export default OperatTableList
