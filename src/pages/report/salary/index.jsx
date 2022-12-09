import ProTable from '@ant-design/pro-table'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { salaryReport } from '@/api/finance/salary'

function EmployeeSalaryReport() {
  const [data, setData] = useState([])

  const param = {
    startPeriod: '202208',
    endPeriod: '202210',
    periodCondition: true,
    deptCondition: true,
    employeeTypeCondition: true,
  }
  // useEffect(() => {
  //   salaryReport(param).then((res) => {
  //     // const treeData = res.data
  //     setData(res.data)
  //   })
  // }, [])

  const columns = [
    { dataIndex: 'name', valueType: 'text', title: '分组' },
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
      title: '补基础性绩效工资',
      hideInSearch: true,
    },
    {
      dataIndex: 'extraIncreaseSalary1',
      valueType: 'text',
      title: '预留增项1',
      hideInSearch: true,
    },
    {
      dataIndex: 'extraIncreaseSalary2',
      valueType: 'text',
      title: '预留增项2',
      hideInSearch: true,
    },
    {
      dataIndex: 'extraIncreaseSalary3',
      valueType: 'text',
      title: '预留增项3',
      hideInSearch: true,
    },
    {
      dataIndex: 'extraIncreaseSalary4',
      valueType: 'text',
      title: '预留增项4',
      hideInSearch: true,
    },
    {
      dataIndex: 'extraIncreaseSalary5',
      valueType: 'text',
      title: '预留增项5',
      hideInSearch: true,
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
      hideInSearch: true,
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
    {
      dataIndex: 'decreaseTotalSalary',
      valueType: 'text',
      hideInSearch: true,
      title: '扣款合计',
    },
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
  ]

  return (
    <>
      <ProTable
        rowKey={'name'}
        columns={columns}
        scroll={{
          x: 4000,
        }}
        request={(params) =>
          salaryReport({ ...param }).then((res) => {
            const result = {
              data: res.data,
              total: 0,
              success: true,
            }
            return result
          })
        }
      />
    </>
  )
}

export default EmployeeSalaryReport
