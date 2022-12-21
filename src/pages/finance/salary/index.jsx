import { Button } from 'antd'
import React, { useState, useRef } from 'react'
import { listSalary } from '@/api/finance/salary'
import { download } from '@/utils/request'
import UploadForm from './components/upload'
import { useNavigate } from 'react-router-dom'
import ProTable from '@ant-design/pro-table'

const EmployeeSalaryTableList = () => {
  const [selectedRowsState, setSelectedRows] = useState([])
  const [uploadModal, setUploadModal] = useState(false)
  const navigate = useNavigate()
  const actionRef = useRef()

  const columns = [
    { dataIndex: 'salaryPeriod', valueType: 'text', title: '工资期间' },
    {
      dataIndex: 'employeeName',
      valueType: 'text',
      hideInSearch: true,
      title: '职员名称',
    },
    {
      dataIndex: 'employeeDept',
      valueType: 'text',
      hideInSearch: true,
      title: '部门',
    },
    {
      dataIndex: 'employeeAccountNo',
      valueType: 'text',
      hideInSearch: true,
      title: '账户',
    },
    {
      dataIndex: 'employeeIdNumber',
      valueType: 'text',
      hideInSearch: true,
      title: '居民身份证',
    },
    {
      dataIndex: 'postSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '岗位工资',
    },
    {
      dataIndex: 'additionPostSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '补岗位工资',
    },
    {
      dataIndex: 'rankSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '薪级工资',
    },
    {
      dataIndex: 'additionRankSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '补薪级工资',
    },
    {
      dataIndex: 'performanceSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '基础性绩效工资',
    },
    {
      dataIndex: 'additionPerformanceSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '补基础性绩效工资',
    },
    {
      dataIndex: 'extraIncreaseSalary1',
      valueType: 'text',
      hideInSearch: true,
      title: '预留增项1',
    },
    {
      dataIndex: 'extraIncreaseSalary2',
      valueType: 'text',
      hideInSearch: true,
      title: '预留增项2',
    },
    {
      dataIndex: 'extraIncreaseSalary3',
      valueType: 'text',
      hideInSearch: true,
      title: '预留增项3',
    },
    {
      dataIndex: 'extraIncreaseSalary4',
      valueType: 'text',
      hideInSearch: true,
      title: '预留增项4',
    },
    {
      dataIndex: 'extraIncreaseSalary5',
      valueType: 'text',
      hideInSearch: true,
      title: '预留增项5',
    },
    {
      dataIndex: 'salaryTotal',
      valueType: 'text',
      hideInSearch: true,
      title: '应发合计',
    },
    {
      dataIndex: 'bonusSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '奖励性绩效',
    },
    {
      dataIndex: 'housingSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '住房物业服务补贴',
    },
    {
      dataIndex: 'salaryPayable',
      valueType: 'text',
      hideInSearch: true,
      title: '应发工资',
    },
    {
      dataIndex: 'endowmentInsurance',
      valueType: 'text',
      hideInSearch: true,
      title: '养老保险',
    },
    {
      dataIndex: 'medicalInsurance',
      valueType: 'text',
      hideInSearch: true,
      title: '医保',
    },
    {
      dataIndex: 'unemploymentInsurance',
      valueType: 'text',
      hideInSearch: true,
      title: '失业保险',
    },
    {
      dataIndex: 'housingAccumulationFunds',
      valueType: 'text',
      hideInSearch: true,
      title: '公积金',
    },
    {
      dataIndex: 'unionFees',
      valueType: 'text',
      hideInSearch: true,
      title: '工会费',
    },
    {
      dataIndex: 'occupationalAnnuity',
      valueType: 'text',
      hideInSearch: true,
      title: '职业年金',
    },
    {
      dataIndex: 'extraDecreaseSalary1',
      valueType: 'text',
      hideInSearch: true,
      title: '预留减项1',
    },
    {
      dataIndex: 'extraDecreaseSalary2',
      valueType: 'text',
      hideInSearch: true,
      title: '预留减项2',
    },
    {
      dataIndex: 'extraDecreaseSalary3',
      valueType: 'text',
      hideInSearch: true,
      title: '预留减项3',
    },
    {
      dataIndex: 'extraDecreaseSalary4',
      valueType: 'text',
      hideInSearch: true,
      title: '预留减项4',
    },
    {
      dataIndex: 'extraDecreaseSalary5',
      valueType: 'text',
      hideInSearch: true,
      title: '预留减项5',
    },
    { dataIndex: 'decreaseTotalSalary', valueType: 'text', title: '扣款合计' },
    {
      dataIndex: 'individualIncomeTax',
      valueType: 'text',
      hideInSearch: true,
      title: '个人所得税',
    },
    {
      dataIndex: 'actualAmount',
      valueType: 'text',
      hideInSearch: true,
      title: '实发金额',
    },
    {
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
      title: '备注',
    },
  ]

  return (
    <>
      <ProTable
        rowKey="id"
        key="tablelist"
        columns={columns}
        request={(params) =>
          listSalary(params).then((res) => {
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
        scroll={{
          x: 4000,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => navigate('/report/salary')}>
            工资统计报表
          </Button>,
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
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
          },
        }}
      />
      <UploadForm
        visible={uploadModal}
        onCancel={setUploadModal}
        actionRef={actionRef}
      />
    </>
  )
}

export default EmployeeSalaryTableList
