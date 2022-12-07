import React, { useState, useEffect } from 'react'
import { Row, Col, Select } from 'antd'
import { EditableProTable } from '@ant-design/pro-table'
import { nanoid } from 'nanoid'
import { transFormEditTableSelectData } from '@/utils/dictUtils'
import { ProFormSelect } from '@ant-design/pro-form'
import { getDicts } from '@/api/system/dict/data'

function Extension(props) {
  const [editableKeys, setEditableRowKeys] = useState([])
  const [chooseDimension, setChooseDimension] = useState('')
  const [dataSource, setDataSource] = useState([])

  // 值的下拉选项
  const [dimensionValueOpt, setDimensionValueOpt] = useState({})

  const certificateColumns = [
    {
      title: '检验资质',
      dataIndex: 'inspection',
      valueType: 'select',
      valueEnum: props.inspectionOpt,
    },
    {
      title: '证书编号',
      dataIndex: 'code',
    },
    {
      title: '生效时间',
      dataIndex: 'startDate',
      valueType: 'date',
    },
    {
      title: '失效时间',
      dataIndex: 'endDate',
      valueType: 'date',
    },
    {
      title: '附件',
      dataIndex: 'attachment',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
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
            const tableDataSource =
              props.formRef.current?.getFieldValue('certificate')
            props.formRef.current?.setFieldsValue({
              certificate: tableDataSource.filter(
                (item) => item.id !== record.id
              ),
            })
          }}
        >
          删除
        </a>,
      ],
    },
  ]

  const dimensionColumns = [
    {
      title: '扩展维度类别',
      dataIndex: 'dimensionKey',
      // valueType: 'select',
      renderFormItem: (text, row, index) => {
        return (
          <ProFormSelect
            onChange={(value) => {
              transFormEditTableSelectData(value, setDimensionValueOpt)
              const tableDataSource =
                props.formRef.current?.getFieldValue('dimensions')
              tableDataSource.forEach((item) => {
                if (item.id == row.recordKey) {
                  item.dimensionValue = undefined
                }
              })
              // console.log(row.recordKey)
            }}
            options={props.dimensionKeyOpt.opts}
          ></ProFormSelect>
        )
      },
      // valueEnum: props.dimensionKeyOpt.valueEnum,
      // fieldProps: {
      //   onChange: (value) => {
      //     setChooseDimension(value)
      //     // transFormEditTableSelectData(value, setDimensionValueOpt)
      //   },
      // },
    },
    {
      title: '值',
      dataIndex: 'dimensionValue',
      valueType: 'select',
      dependencies: ['dimensionKey'],
      renderFormItem: (text, row, index) => {
        return (
          <ProFormSelect
            params={{ dimensionKey: row.record?.dimensionKey }}
            request={async (params) => {
              console.log('parasm:%o', params)
              if (!params.dimensionKey) return []
              const res = await getDicts(params.dimensionKey)
              let result = res.data.map((item) => ({
                label: item.dictLabel,
                value: item.dictValue,
              }))
              return result
            }}
          />
        )
      },

      // params: { "dimensionKey": chooseDimension },
      // dependencies: ['dimensionKey'],
      // request: async (arg, option) => {
      //   console.log(arg)
      //   let curDimension = arg.dimensionKey || option?.record?.dimensionKey
      //   if (!curDimension) {
      //     return []
      //   }
      //   const res = await getDicts(curDimension)
      //   let result = res.data.map((item) => ({
      //     label: item.dictLabel,
      //     value: item.dictValue,
      //   }))
      //   return result
      // },
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
            const tableDataSource =
              props.formRef.current?.getFieldValue('dimensions')
            props.formRef.current?.setFieldsValue({
              dimensions: tableDataSource.filter(
                (item) => item.id !== record.id
              ),
            })
          }}
        >
          删除
        </a>,
      ],
    },
  ]

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24} order={1}>
          <div className="text-base font-bold pl-4 my-4">检验资质</div>
          <EditableProTable
            rowKey="id"
            name="certificate"
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'top',
              // 每次新增的时候需要Key
              record: () => ({ id: nanoid() }),
            }}
            loading={false}
            columns={certificateColumns}
            controlled
            editable={{
              type: 'multiple',
              editableKeys,
              onSave: async (rowKey, data, row) => {
                // console.log(data)
              },
              onChange: setEditableRowKeys,
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24} order={1}>
          <div className="text-base font-bold pl-4 my-4">检验扩展管理维度</div>
          <EditableProTable
            rowKey="id"
            name="dimensions"
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'top',
              // 每次新增的时候需要Key
              record: () => ({ id: nanoid() }),
            }}
            loading={false}
            columns={dimensionColumns}
            controlled
            editable={{
              type: 'multiple',
              editableKeys,
              onSave: async (rowKey, data, row) => {
                // console.log(data)
              },
              onChange: setEditableRowKeys,
            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default Extension
