import React, { useState } from 'react'
import { Button, message, Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import TableList from '@/components/Table/TableList'
import {
  listReceivable,
  delInitData,
  cancelReceivable,
} from '@/api/finance/receivables'
import { getUploadUrl } from '@/utils/common'
import { getAccessToken } from '@/utils/access'
import { download } from '@/utils/request'
import DzCompont from './components/DzCompont'

function ReceivablesTableList() {
  const [fileList, setFileList] = useState([])
  const [tableRef, setTableRef] = useState()
  const [selectedRows, setSelectedRows] = useState([])
  const [dzModal, setDzModal] = useState(false)

  const columns = [
    {
      dataIndex: 'id',
      title: '票据号码',
      valueType: 'text',
    },
    {
      dataIndex: 'period',
      title: '期间',
      valueType: 'dateMonth',
      width: 100,
      render: (_, record) => record.period,
    },
    {
      dataIndex: 'invoiceStartDate',
      title: '开票日期开始',
      valueType: 'date',
      hideInTable: true,
    },
    {
      dataIndex: 'invoiceEndDate',
      title: '开票日期结束',
      valueType: 'date',
      hideInTable: true,
    },
    {
      dataIndex: 'amountStart',
      title: '应收金额大于',
      valueType: 'money',
      hideInTable: true,
    },
    {
      dataIndex: 'amountEnd',
      title: '应收金额小于',
      valueType: 'money',
      hideInTable: true,
    },
    {
      dataIndex: 'sourceType',
      title: '单据类别',
      valueType: 'select',
      valueEnum: {
        1: '财政发票',
        2: '经营发票',
        3: '初始化财政发票',
        4: '初始化经营发票',
      },
    },
    {
      dataIndex: 'invoicingDate',
      title: '开票时间',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      dataIndex: 'clientOrgName',
      title: '客户名称',
      valueType: 'text',
    },
    {
      dataIndex: 'applyCheckDate',
      title: '申检日期',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      dataIndex: 'receivableAmount',
      title: '应收金额',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      dataIndex: 'confirmAmount',
      title: '对账金额',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      dataIndex: 'unConfirmAmount',
      title: '对账余额',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      dataIndex: 'reconciliationFlag',
      title: '对账标识',
      valueType: 'select',
      width: 100,
      valueEnum: {
        1: 'Y',
        2: 'N',
        3: 'P',
      },
    },
    {
      dataIndex: 'reconciliationModel',
      title: '对账类别',
      valueType: 'select',
      width: 100,
      valueEnum: {
        1: '自动',
        2: '手动',
      },
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
    {
      title: '操作',
      width: '110px',
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="view"
          disabled={record.reconciliationFlag == '2'}
          // hidden={!access.hasPerms('system:user:edit')}
          onClick={() => {
            cancelReceivable([record.id]).then(() => {
              message.success('取消成功')
              tableRef.current.reload()
            })
          }}
        >
          取消对账
        </Button>,
      ],
    },
  ]

  const crud = {
    list: listReceivable,
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

  const beforeUpload = (file) => {
    const isExcel =
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!isExcel) {
      message.error('请上传excel文件格式文件')
    }
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      message.error('图片大小超过10MB!')
    }
    return isExcel && isLt2M
  }

  const handleChange = ({ file, fileList }) => {
    console.log(file.status)
    if (file.status === 'done') {
      if (file.response.code !== 200) {
        message.error(file.response.msg)
      } else {
        message.success('导入成功')
      }
      setFileList(fileList.pop())
      tableRef.current.reload()
    }
    setFileList(fileList)
  }

  const extratoolBar = [
    <Button
      onClick={() => {
        if (selectedRows.length == 0) {
          message.error('请选择应收账单')
          return false
        }
        setDzModal(true)
      }}
    >
      进行手工对账
    </Button>,
    <Button
      onClick={() => {
        if (selectedRows.length == 0) {
          message.error('请选择应收账单')
          return false
        }
        const dzIds = selectedRows.map((item) => item.id)
        cancelReceivable(dzIds).then(() => {
          message.success('取消成功')
          tableRef.current.reload()
        })
      }}
    >
      取消应收对账
    </Button>,
    <Button
      key="template"
      onClick={async () => {
        download(
          '/company/receivable/template/download',
          {},
          '应收单初始化导入模板.xlsx'
        )
      }}
    >
      下载初始化导入模板
    </Button>,
    <Upload
      action={getUploadUrl() + '/company/receivable/upload'}
      headers={{ Authorization: 'Bearer ' + getAccessToken() }}
      fileList={fileList}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />}>批量导入</Button>
    </Upload>,
    <Button
      type="primary"
      key="delData"
      danger
      onClick={() => {
        const dzIds = selectedRows.map((item) => item.id)
        delInitData(dzIds).then(() => {
          message.success('删除初始化数据成功')
          tableRef.current.reload()
        })
      }}
    >
      删除初始化单据
    </Button>,
  ]

  return (
    <>
      <TableList
        rowKey={'id'}
        columns={columns}
        tableRef={setTableRef}
        selectRow={setSelectedRows}
        initData={false}
        func={crud}
        scroll={{
          x: 2000,
        }}
        optionBtn={optionBtn}
        toolBar={toolBar}
        extratoolBar={extratoolBar}
        labelWidth={120}
        contianModal={false}
      />
      <DzCompont
        parentTableRef={tableRef}
        visible={dzModal}
        dzData={selectedRows}
        onCancel={setDzModal}
      />
    </>
  )
}

export default ReceivablesTableList
