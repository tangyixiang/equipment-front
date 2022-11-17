import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Card,
  Space,
  Button,
} from 'antd'
import OFormContent from '@/components/OForm/OFormContent'
import history from '@/utils/history'

function TripInfo(props) {
  const { title, readOnly } = props
  const [form] = Form.useForm()

  const baseDesc = [
    {
      name: 'id',
      label: '申请流水号',
      iptCell: <Input autoComplete="off" readOnly />,
    },
    {
      name: 'checkCode',
      label: '申检单编号',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'createBy',
      label: '姓名',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'deptId',
      label: '部门',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'postId',
      label: '岗位',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'createTime',
      label: '发起时间',
      iptCell: <Input autoComplete="off" />,
    },
  ]

  const applyDesc = [
    {
      name: 'startDate',
      label: '开始日期',
      iptCell: <DatePicker />,
      rules: [
        {
          required: true,
          message: '请选择开始日期!',
        },
      ],
    },
    {
      name: 'endDate',
      label: '结束日期',
      iptCell: <DatePicker />,
      rules: [
        {
          required: true,
          message: '请选择结束日期!',
        },
      ],
    },
    {
      name: 'tripDays',
      label: '外出时长(天)',
      iptCell: <Input autoComplete="off" />,
      // singleRow: 'true',
    },
    {
      name: 'tripType',
      label: '申请外出类别',
      iptCell: (
        <Select>
          <Select.Option value="1">检验</Select.Option>
          <Select.Option value="2">学习</Select.Option>
          <Select.Option value="3">公务</Select.Option>
          <Select.Option value="4">请假</Select.Option>
        </Select>
      ),
      rules: [
        {
          required: true,
          message: '请选择外出类别!',
        },
      ],
    },
    {
      name: 'tripMethod',
      label: '出行方式',
      iptCell: (
        <Select>
          <Select.Option value="1">公务用车</Select.Option>
          <Select.Option value="2">其他方式</Select.Option>
        </Select>
      ),
      rules: [
        {
          required: true,
          message: '请选择出行方式!',
        },
      ],
    },
    {
      name: 'partner',
      label: '同行人员',
      iptCell: <Input autoComplete="off" />,
      // singleRow: 'true',
    },
    {
      name: 'addressDesc',
      label: '地点说明',
      iptCell: <Input autoComplete="off" />,
      singleRow: 'true',
    },
    {
      name: 'outReason',
      label: '外出事由',
      iptCell: <Input.TextArea rows={3} autoComplete="off" />,
      singleRow: 'true',
      rules: [
        {
          required: true,
          message: '请填写外出事由!',
        },
      ],
    },
    {
      name: 'pictures',
      label: '图片',
      iptCell: <Upload />,
      singleRow: 'true',
    },
  ]

  const confirmDesc = [
    {
      name: 'useStartDate',
      label: '开始日期',
      iptCell: <DatePicker />,
    },
    {
      name: 'useEndDate',
      label: '结束日期',
      iptCell: <DatePicker />,
    },
    {
      name: 'useTripDays',
      label: '实际外出时长(天)',
      iptCell: <Input autoComplete="off" />,
      singleRow: 'true',
    },
  ]

  const onFinish = (values) => {
    console.log(values)
  }

  return (
    <Card
      title={title}
      extra={
        <Space>
          <Button type="primary" onClick={() => history.back()}>
            返回
          </Button>
          <Button type="primary">提交</Button>
          <Button type="primary">保存</Button>
        </Space>
      }
    >
      <Form form={form} onFinish={onFinish} disabled={readOnly}>
        <div className="text-base font-bold py-2 pl-1">发起人信息</div>
        <OFormContent formCellDesc={baseDesc} />

        <div className="text-base font-bold p-2 pl-1 mt-9">申请信息</div>
        <OFormContent formCellDesc={applyDesc} />

        <div className="text-base font-bold p-2 pl-1 mt-9">合同明细</div>
        <OFormContent formCellDesc={confirmDesc} />

        {/* <div className="text-base font-bold p-2 pl-1 mt-9">派车信息</div> */}
      </Form>
    </Card>
  )
}

export default TripInfo
