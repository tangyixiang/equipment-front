import { Button } from 'antd'
import React, { useState } from 'react'
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

const OperatTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [uploadModal, setUploadModal] = useState(false)
  const { refresh } = useTable()

  const columns = [
    { dataIndex: 'invoicingPeriod', valueType: 'text', title: '开票期间' },
    { dataIndex: 'flowId', valueType: 'text', title: '流水号' },
    { dataIndex: 'orderId', valueType: 'text', title: '订单号' },
    {
      dataIndex: 'invoiceCreateTime',
      valueType: 'text',
      title: '发票创建时间',
    },
    { dataIndex: 'invoicingTime', valueType: 'text', title: '开票时间' },
    { dataIndex: 'redInvoice', valueType: 'text', title: '红票标志' },
    { dataIndex: 'invoiceType', valueType: 'text', title: '发票种类' },
    { dataIndex: 'invoiceCode', valueType: 'text', title: '发票代码' },
    { dataIndex: 'invoiceId', valueType: 'text', title: '发票号码' },
    { dataIndex: 'buyerName', valueType: 'text', title: '购方名称' },
    { dataIndex: 'buyerTaxId', valueType: 'text', title: '购方税号' },
    { dataIndex: 'buyerPhone', valueType: 'text', title: '购方手机号' },
    { dataIndex: 'buyerEmail', valueType: 'text', title: '购方邮箱' },
    {
      dataIndex: 'buyerBankInfo',
      valueType: 'text',
      title: '购方开户行及账号',
    },
    {
      dataIndex: 'buyerAddressInfo',
      valueType: 'text',
      title: '购方地址、电话',
    },
    { dataIndex: 'productName', valueType: 'text', title: '商品名称' },
    { dataIndex: 'productCode', valueType: 'text', title: '商品编码' },
    { dataIndex: 'specifications', valueType: 'text', title: '规格型号' },
    { dataIndex: 'unit', valueType: 'text', title: '单位' },
    { dataIndex: 'quantity', valueType: 'text', title: '数量' },
    {
      dataIndex: 'unitPriceIncludingTax',
      valueType: 'text',
      title: '含税单价',
    },
    { dataIndex: 'taxRate', valueType: 'text', title: '税率' },
    { dataIndex: 'priceIncludingTax', valueType: 'text', title: '含税金额' },
    { dataIndex: 'priceExcludingTax', valueType: 'text', title: '不含税金额' },
    { dataIndex: 'taxPrice', valueType: 'text', title: '税额' },
    {
      dataIndex: 'totalPriceIncludingTax',
      valueType: 'text',
      title: '合计含税金额',
    },
    {
      dataIndex: 'totalPriceExcludingTax',
      valueType: 'text',
      title: '合计不含税金额',
    },
    { dataIndex: 'totalTaxPrice', valueType: 'text', title: '合计税额' },
    { dataIndex: 'remark', valueType: 'text', title: '备注' },
    { dataIndex: 'billingStaff', valueType: 'text', title: '开票员' },
    { dataIndex: 'payee', valueType: 'text', title: '收款人' },
    { dataIndex: 'reviewer', valueType: 'text', title: '复核人' },
    { dataIndex: 'store', valueType: 'text', title: '部门门店' },
    { dataIndex: 'invoicingMethod', valueType: 'text', title: '开票方式' },
    { dataIndex: 'pdfPath', valueType: 'text', title: 'PDF地址' },
    { dataIndex: 'invoiceState', valueType: 'text', title: '开票状态' },
    { dataIndex: 'specialInvoice', valueType: 'text', title: '特殊票种' },
    { dataIndex: 'clearFlag', valueType: 'text', title: '清单标志' },
    { dataIndex: 'extCode', valueType: 'text', title: '分机号' },
    { dataIndex: 'machineCode', valueType: 'text', title: '机器编号' },
    { dataIndex: 'terminalCode', valueType: 'text', title: '终端号' },
    { dataIndex: 'checkCode', valueType: 'text', title: '校验码' },
    {
      dataIndex: 'unitPriceExcludingTax',
      valueType: 'text',
      title: '单价（不含税）',
    },
    { dataIndex: 'invalidInfo', valueType: 'text', title: '作废人/时间' },
    { dataIndex: 'receiverPhone', valueType: 'text', title: '交付手机' },
    { dataIndex: 'receiverEmail', valueType: 'text', title: '交付邮箱' },
    { dataIndex: 'carInfo', valueType: 'text', title: '车架号/车辆识别代码' },
    { dataIndex: 'auctionName', valueType: 'text', title: '经营/拍卖单位名称' },
    {
      dataIndex: 'auctionAddress',
      valueType: 'text',
      title: '经营/拍卖单位地址',
    },
    {
      dataIndex: 'auctionTaxNo',
      valueType: 'text',
      title: '经营/拍卖单位税号',
    },
    {
      dataIndex: 'auctionPhone',
      valueType: 'text',
      title: '经营/拍卖单位电话',
    },
    { dataIndex: 'bankInfo', valueType: 'text', title: '开户行、账号' },
    {
      dataIndex: 'dataSplit',
      valueType: 'text',
      title: '分录生成标识',
      render: (_, record) => <span>{record.dataSplit ? '是' : '否'}</span>,
    },
    { dataIndex: 'version', valueType: 'text', title: '版本号' },
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
            x: 9000,
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
        path={'/invoice/operating/upload'}
        refresh={refresh}
      />
    </>
  )
}

export default withTable(OperatTableList)
