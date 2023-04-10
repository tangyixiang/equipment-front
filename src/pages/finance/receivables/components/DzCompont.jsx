import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  message,
  Drawer,
  Space,
  Card,
  Row,
  Col,
  Typography,
} from 'antd'
import { pagination } from '@/constants'
import { listBanFlowUnReconciled } from '@/api/finance/bankflow'
import { matchBankFlow } from '@/api/finance/receivables'
import ProTable from '@ant-design/pro-table'

const transalteSourceType = (name) => {
  const data = {
    1: '财政发票',
    2: '经营发票',
    3: '初始化财政发票',
    4: '初始化经营发票',
  }

  return data[name]
}

function DzCompont(props) {
  const actionRef = useRef()
  const [selectedRowsState, setSelectedRows] = useState([])

  const { dzData } = props

  const handleCancel = () => {
    props.onCancel()
  }

  const columns = [
    {
      title: '流水ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '会计期',
      dataIndex: 'period',
      valueType: 'text',
    },
    {
      title: '凭证号',
      dataIndex: 'bankSiteCode',
      valueType: 'text',
      width: 200,
    },
    {
      title: '本方账号',
      dataIndex: 'selfAccount',
      valueType: 'text',
      width: 200,
    },
    {
      title: '对方单位名称',
      dataIndex: 'adversaryOrgName',
      valueType: 'text',
      width: 300,
    },
    {
      title: '对方行号',
      dataIndex: 'adversaryBankCode',
      valueType: 'text',
    },
    {
      title: '金额',
      dataIndex: 'price',
      valueType: 'text',
      width: 100,
    },
    {
      title: '已对账金额',
      dataIndex: 'confirmPrice',
      valueType: 'text',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '未对账金额',
      dataIndex: 'unConfirmPrice',
      valueType: 'text',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '对账标识',
      dataIndex: 'reconciliationFlag',
      valueType: 'select',
      valueEnum: {
        1: 'Y',
        2: 'N',
        3: 'P',
      },
      width: 100,
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      valueType: 'text',
      width: 300,
    },
    {
      title: '个性化信息',
      dataIndex: 'otherInfo',
      valueType: 'text',
      ellipsis: true,
      width: 300,
    },
    {
      title: '交易时间',
      dataIndex: 'tradeTimeArray',
      valueType: 'dateRange',
      width: 200,
      render: (_, row, index, action) => row.tradeTime,
    },
    {
      title: '对账类别',
      dataIndex: 'reconciliationModel',
      valueType: 'select',
      valueEnum: {
        1: '自动',
        2: '手动',
      },
      width: 100,
    },
    {
      title: '应收对账ID',
      dataIndex: 'associationIdStr',
      valueType: 'text',
      render: (_, record) => {
        if (record.associationId != null) {
          return record.associationId.map((item) => (
            <div key={item}>{item}</div>
          ))
        }
        console.log(record.associationId)
        return record.associationId
      },
    },
  ]

  return (
    <>
      <Drawer
        title={'手工对账'}
        placement="right"
        width={'70%'}
        onClose={handleCancel}
        destroyOnClose={true}
        open={props.visible}
        extra={
          <Button
            type="primary"
            onClick={() => {
              if (selectedRowsState.length == 0) {
                message.error('请选择银行流水')
                return false
              }
              const dzIds = props.dzData.map((item) => item.id)
              const bankIds = selectedRowsState.map((item) => item.id)
              matchBankFlow(dzIds, bankIds).then((res) => {
                message.success('对账成功')
                props.parentTableRef?.current.reload()
                actionRef.current.reload()
                handleCancel()
              })
            }}
          >
            进行对账
          </Button>
        }
      >
        <Space direction="vertical" size="middle" className="flex">
          <div className="text-base font-bold">应收单信息:</div>
          <Row gutter={24}>
            {dzData.map((item) => (
              <Col span={8} className="my-1" key={`col-${item.id}`}>
                <Card key={item.id} className="shadow-md h-[220px]">
                  <div className="p-1">客户名称: {item.clientOrgName}</div>
                  <div className="p-1">
                    单据类别: {transalteSourceType(item.sourceType)}
                  </div>
                  <div className="p-1">应收金额: {item.receivableAmount}</div>
                  <div className="p-1">对账金额: {item.confirmAmount}</div>
                  <div className="p-1">对账余额: {item.unConfirmAmount}</div>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-base font-bold">银行流水信息:</div>
          <ProTable
            actionRef={actionRef}
            rowKey={'id'}
            key="BankTableList"
            columns={columns}
            pagination={{
              ...pagination,
              showTotal: (total) => `总共 ${total} 条`,
            }}
            search={{
              labelWidth: 100,
            }}
            scroll={{
              x: 2600,
            }}
            request={async (params) => {
              // const clientOrgName = props.dzData[0].clientOrgName
              // const bankAccount = props.dzData[0].bankAccount
              const data = {
                ...params,
                // selfAccount: bankAccount,
                // adversaryOrgName: clientOrgName,
              }
              const res = await listBanFlowUnReconciled(data)
              return {
                data: res.rows,
                total: res.total,
                success: true,
              }
            }}
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows)
              },
            }}
          />
        </Space>
      </Drawer>
    </>
  )
}

export default DzCompont
