import React, { useState, useRef, useEffect } from 'react'
import { Modal, Button, message } from 'antd'
import TableList from '@/components/Table/TableList'
import { listBanFlowUnReconciled } from '@/api/finance/bankflow'
import { matchBankFlow } from '@/api/finance/receivables'

function DzCompont(props) {
  const [reload, setReload] = useState(false)
  const [tableRef, setTableRef] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const handleCancel = () => {
    setReload(true)
    props.onCancel()
  }

  if (props.visible && reload) {
    tableRef.current.reload()
  }

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
      width: 300,
    },
    {
      title: '个性化信息',
      dataIndex: 'otherInfo',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      width: 300,
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

  const crud = {
    list: listBanFlowUnReconciled,
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

  const extratoolBar = [
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
          tableRef.current.reload()
          props.parentTableRef?.current.reload()
          handleCancel()
        })
      }}
    >
      进行对账
    </Button>,
  ]

  return (
    <>
      <Modal
        forceRender
        width={'75%'}
        title={'手工对账'}
        onCancel={handleCancel}
        open={props.visible}
        destroyOnClose={true}
        footer={null}
      >
        <TableList
          rowKey={'id'}
          columns={columns}
          initData={false}
          func={crud}
          tableRef={setTableRef}
          selectRow={setSelectedRows}
          optionBtn={optionBtn}
          labelWidth={100}
          scroll={{
            x: 3200,
          }}
          toolBar={toolBar}
          extratoolBar={extratoolBar}
        />
      </Modal>
    </>
  )
}

export default DzCompont
