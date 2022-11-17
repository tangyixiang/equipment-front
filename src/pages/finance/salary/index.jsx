import { Button, message, Modal, Upload } from 'antd'
import React, { useState, useEffect } from 'react'
import { Search, Table, useTable, withTable } from 'table-render'
import { listSalary } from '@/api/finance/salary'
import { download } from '@/utils/request'
import UploadForm from './components/upload'

const schema = {
  type: 'object',
  properties: {
    salaryPeriod: {
      title: '发薪期间',
      type: 'string',
      width: '25%',
    },
  },
}

const EmployeeSalaryTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [uploadModal, setUploadModal] = useState(false)
  const { refresh } = useTable()

  const columns = [
    { dataIndex: 'salaryPeriod', valueType: 'text', title: '工资期间' },
    { dataIndex: 'employeeCode', valueType: 'text', title: '职员编号' },
    { dataIndex: 'employeeName', valueType: 'text', title: '职员名称' },
    { dataIndex: 'postSalary', valueType: 'text', title: '岗位工资' },
    { dataIndex: 'rankSalary', valueType: 'text', title: '薪级工资' },
    {
      dataIndex: 'performanceSalary',
      valueType: 'text',
      title: '基础性绩效工资',
    },
    {
      dataIndex: 'housingSalary',
      valueType: 'text',
      title: '住房物业服务补贴',
    },
    { dataIndex: 'bonusSalary', valueType: 'text', title: '奖励性绩效' },
    {
      dataIndex: 'extraIncreaseSalary1',
      valueType: 'text',
      title: '预留增项1',
    },
    {
      dataIndex: 'extraIncreaseSalary2',
      valueType: 'text',
      title: '预留增项2',
    },
    {
      dataIndex: 'extraIncreaseSalary3',
      valueType: 'text',
      title: '预留增项3',
    },
    {
      dataIndex: 'extraIncreaseSalary4',
      valueType: 'text',
      title: '预留增项4',
    },
    {
      dataIndex: 'extraIncreaseSalary5',
      valueType: 'text',
      title: '预留增项5',
    },
    { dataIndex: 'paymentRatio', valueType: 'text', title: '预发 百分比' },
    { dataIndex: 'unPaymentSalary', valueType: 'text', title: '差额' },
    { dataIndex: 'salaryPayable', valueType: 'text', title: '应发工资' },
    { dataIndex: 'endowmentInsurance', valueType: 'text', title: '养老保险' },
    { dataIndex: 'medicalInsurance', valueType: 'text', title: '医保' },
    {
      dataIndex: 'unemploymentInsurance',
      valueType: 'text',
      title: '失业保险',
    },
    {
      dataIndex: 'housingAccumulation funds',
      valueType: 'text',
      title: '公积金',
    },
    { dataIndex: 'occupationalAnnuity', valueType: 'text', title: '职业年金' },
    {
      dataIndex: 'occupationalAnnuityDifferent',
      valueType: 'text',
      title: '职业年金清算差额',
    },
    { dataIndex: 'unionFees', valueType: 'text', title: '工会费' },
    {
      dataIndex: 'individualIncomeTax',
      valueType: 'text',
      title: '个人所得税',
    },
    {
      dataIndex: 'extraDecreaseSalary1',
      valueType: 'text',
      title: '预留减项1',
    },
    {
      dataIndex: 'extraDecreaseSalary2',
      valueType: 'text',
      title: '预留减项2',
    },
    {
      dataIndex: 'extraDecreaseSalary3',
      valueType: 'text',
      title: '预留减项3',
    },
    {
      dataIndex: 'extraDecreaseSalary4',
      valueType: 'text',
      title: '预留减项4',
    },
    {
      dataIndex: 'extraDecreaseSalary5',
      valueType: 'text',
      title: '预留减项5',
    },
    {
      dataIndex: 'decreaseTotalSalary',
      valueType: 'text',
      title: '扣款合计',
    },
    { dataIndex: 'actualAmount', valueType: 'text', title: '实发金额' },
    { dataIndex: 'remark', valueType: 'text', title: '备注' },
  ]

  const searchApi = (params) => {
    const requestParams = {
      ...params,
      pageNum: params.current,
    }
    // console.log('params >>> ', requestParams)

    return listSalary(requestParams).then((res) => {
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
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          scroll={{
            x: 4000,
          }}
          toolbarAction
          toolbarRender={() => [
            <Button
              type="primary"
              key="template"
              onClick={async () => {
                download(
                  '/employee/salary/template/download',
                  {},
                  '工资导入模板.xlsx'
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

export default withTable(EmployeeSalaryTableList)
