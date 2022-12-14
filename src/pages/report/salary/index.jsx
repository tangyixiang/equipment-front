import moment from 'moment'
import { DatePicker, Checkbox, Button } from 'antd'
import ProTable from '@ant-design/pro-table'
import { salaryReport } from '@/api/finance/salary'
import React, { useRef } from 'react'
import { download } from '@/utils/request'

function EmployeeSalaryReport() {
  const actionRef = useRef()
  const formRef = useRef()

  const columns = [
    {
      key: 'range',
      title: '选择范围',
      hideInTable: true,
      dataIndex: 'range',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return <DatePicker.RangePicker picker="month" format={'YYYYMM'} />
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      key: 'condition',
      hideInTable: true,
      title: '聚合条件',
      dataIndex: 'condition',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return <Checkbox.Group options={conditionCheck} />
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      dataIndex: 'name',
      valueType: 'text',
      title: '分组',
      hideInSearch: true,
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

  const conditionCheck = [
    {
      key: 'period',
      label: '期间',
      value: 'period',
    },
    {
      key: 'dept',
      label: '部门',
      value: 'dept',
    },
    {
      key: 'employeeType',
      label: '人员性质',
      value: 'employeeType',
    },
  ]

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        formRef={formRef}
        form={{
          ignoreRules: false,
        }}
        scroll={{
          x: 4000,
        }}
        manualRequest={true}
        toolbar={{
          actions: [
            <Button
              key="primary"
              type="primary"
              onClick={() => {
                const range = formRef.current
                  .getFieldValue('range')
                  .map((item) => moment(item).format('YYYY-MM-DD HH:mm:ss'))
                const condition = formRef.current.getFieldValue('condition')
                download(
                  '/report/employee/salary/result',
                  { range: range, condition: condition },
                  '工资统计结果.xlsx'
                )
              }}
            >
              结果导出
            </Button>,
          ],
        }}
        search={{
          optionRender: ({ searchText, resetText }, { form }, dom) => [
            ...dom.reverse(),
          ],
        }}
        request={async (params) => {
          console.log(params)
          const res = await salaryReport({ ...params })
          const result = {
            data: res.data,
            total: 0,
            success: true,
          }
          return result
        }}
      />
    </>
  )
}

export default EmployeeSalaryReport
