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
import { EditableProTable } from '@ant-design/pro-table'
import { nanoid } from 'nanoid'
import history from '@/utils/history'
// import { useSearchParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import styles from '@/css/global.module.scss'

function ContractInfo(props) {
  // const [search, setSearch] = useSearchParams()
  const { state } = useLocation()

  const [editableKeys, setEditableRowKeys] = useState([])
  const [orgDataSource, setOrgDataSource] = useState([])
  const [itemDataSource, setItemDataSource] = useState([])
  const [form] = Form.useForm()
  // const title = search.get('title')
  const { title } = state
  const { record, open, readOnly, onCancel } = props

  useEffect(() => {
    setOrgDataSource([
      {
        id: '1',
        title: '甲方单位',
        orgId: '',
        orgContactName: '',
        orgContactPhone: '',
      },
      {
        id: '2',
        title: '乙方单位',
        orgId: '',
        orgContactName: '',
        orgContactPhone: '',
      },
    ])
  }, [])

  const desc = [
    {
      name: 'name',
      label: '合同名称',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请输入合同名称!',
        },
      ],
    },
    {
      name: 'contractCode',
      label: '合同编号',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'price',
      label: '合同金额(元)',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'contractType',
      label: '合同类型',
      iptCell: (
        <Select>
          <Select.Option value="1">固定期限合同</Select.Option>
          <Select.Option value="2">非固定期限合同</Select.Option>
        </Select>
      ),
      rules: [
        {
          required: true,
          message: '请选择合同类型!',
        },
      ],
    },
    {
      name: 'startDate',
      label: '合同开始日期',
      iptCell: <DatePicker />,
      rules: [
        {
          required: true,
          message: '请输入合同开始日期!',
        },
      ],
    },
    {
      name: 'endDate',
      label: '合同结束日期',
      iptCell: <DatePicker />,
      rules: [
        {
          required: true,
          message: '请输入合同结束日期!',
        },
      ],
    },
    {
      name: 'contractPeriod',
      label: '合同有效期',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'deptId',
      label: '合同签订部门',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请选择合同签订部门!',
        },
      ],
    },
    {
      name: 'createBy',
      label: '申请人',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'attachment',
      label: '合同附件',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'remark',
      label: '备注',
      iptCell: <Input.TextArea rows={3} />,
      singleRow: 'true',
    },
  ]

  const columns = [
    {
      title: '单位类型',
      dataIndex: 'title',
      readonly: true,
      width: '10%',
    },
    {
      title: '单位名称',
      dataIndex: 'orgId',
    },
    {
      title: '经办人',
      dataIndex: 'orgContactName',
      width: '15%',
    },
    {
      title: '经办人联系电话',
      dataIndex: 'orgContactPhone',
      width: '15%',
    },
    {
      title: '操作',
      width: 200,
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id)
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setOrgDataSource(
              orgDataSource.filter((item) => item.id !== record.id)
            )
          }}
        >
          删除
        </a>,
      ],
    },
  ]

  const itemColumns = [
    {
      title: '检测项目',
      dataIndex: 'checkItemId',
      width: '10%',
    },
    {
      title: '金额类别',
      dataIndex: 'priceType',
    },
    {
      title: '金额(元)',
      dataIndex: 'price',
      width: '15%',
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      valueType: 'date',
      width: '15%',
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      valueType: 'date',
      width: '15%',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '15%',
    },
    {
      title: '操作',
      width: 200,
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id)
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setItemDataSource(
              itemDataSource.filter((item) => item.id !== record.id)
            )
          }}
        >
          删除
        </a>,
      ],
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
          <Button type="primary" danger>
            生效/失效
          </Button>
          <Button type="primary">提交</Button>
        </Space>
      }
    >
      <Form form={form} onFinish={onFinish} disabled={readOnly}>
        <div className="text-base font-bold py-2 pl-1">基本信息</div>
        <OFormContent formCellDesc={desc} />
        <div className="text-base font-bold p-2 pl-1 mt-9">签订单位</div>

        <EditableProTable
          rowKey="id"
          className={styles.table}
          recordCreatorProps={false}
          loading={false}
          columns={columns}
          value={orgDataSource}
          onChange={setOrgDataSource}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row)
              // await waitTime(2000)
            },
            onChange: setEditableRowKeys,
          }}
        />
        <div className="text-base font-bold p-2 pl-1 mt-9">合同明细</div>

        <EditableProTable
          rowKey="id"
          className={styles.table}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'top',
            // 每次新增的时候需要Key
            record: () => ({ id: nanoid() }),
          }}
          loading={false}
          columns={itemColumns}
          value={itemDataSource}
          onChange={setItemDataSource}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row)
              // await waitTime(2000)
            },
            onChange: setEditableRowKeys,
          }}
        />
      </Form>
    </Card>
  )
}

export default ContractInfo
