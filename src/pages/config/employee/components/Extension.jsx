import React, { useState } from 'react'
import { Row, Col, Upload, message } from 'antd'
import { EditableProTable } from '@ant-design/pro-table'
import { nanoid } from 'nanoid'
import { transFormEditTableSelectData } from '@/utils/dictUtils'
import { ProFormSelect } from '@ant-design/pro-form'
import { getDicts } from '@/api/system/dict/data'
import { getUploadUrl } from '@/utils/common'
import { getAccessToken } from '@/utils/access'
import EditTableUpload from './EditTableUpload'

function Extension(props) {
  const [editableKeys, setEditableRowKeys] = useState([])
  const [fileList, setFileList] = useState([])
  // 值的下拉选项
  const [dimensionValueOpt, setDimensionValueOpt] = useState({})
  const { dimensionValueMap } = props

  const beforeUpload = (file) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    // if (!isJpgOrPng) {
    //   message.error('请上传上传JPG/PNG格式图片')
    // }
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      message.error('图片大小超过10MB!')
    }
    return isLt2M
  }

  const handleChange = (row, file, fileList) => {
    if (file.status === 'done') {
      if (file.response.code !== 200) {
        message.error(file.response.msg)
        setFileList(fileList.pop())
      }
    }
    console.log(fileList)
    console.log(row)
    setFileList(fileList)
  }

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
      // renderFormItem: (text, row, index) => (
      //   <Upload
      //     action={getUploadUrl() + '/common/upload'}
      //     headers={{ Authorization: 'Bearer ' + getAccessToken() }}
      //     fileList={fileList}
      //     beforeUpload={beforeUpload}
      //     onChange={({ file, fileList }) => handleChange(row, file, fileList)}
      //   >
      //     <Button>上传</Button>
      //   </Upload>
      // ),

      // renderText: (text, record) => {
      //   if (record.attachment) {
      //     let fileNames = record.attachment.map((item) => item.name)
      //     return fileNames.toString()
      //   }
      // },
      // renderFormItem: (text, row, index) => <EditTableUpload />,
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
      valueEnum: props.dimensionKeyOpt.valueEnum,
    },
    {
      title: '值',
      dataIndex: 'dimensionValue',
      valueType: 'select',
      dependencies: ['dimensionKey'],
      renderText: (text, record) => {
        if (!record.dimensionKey && !record.dimensionValue) return ''
        let label = ''
        dimensionValueMap[record.dimensionKey].forEach((item) => {
          if (item.value == text) {
            label = item.label
          }
        })
        return label
      },
      renderFormItem: (text, row, index) => {
        return (
          <ProFormSelect
            params={{ dimensionKey: row.record?.dimensionKey }}
            request={async (params) => {
              // console.log('parasm:%o', params)
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
