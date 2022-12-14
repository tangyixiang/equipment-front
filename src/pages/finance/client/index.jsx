import { Button, message, Modal, Upload } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import ProTable from '@ant-design/pro-table'
import {
  listClient,
  delClient,
  listClientFinanceItem,
} from '@/api/finance/clientorg'
import { getUploadUrl } from '@/utils/common'
import { getAccessToken } from '@/utils/access'
import { download } from '@/utils/request'
import FinanceInfo from './components/info'

const handleRemoveOne = async (selectedRow) => {
  const hide = message.loading('正在删除')
  if (!selectedRow) return true
  try {
    const params = [selectedRow.id]
    const resp = await delClient(params.join(','))
    hide()
    if (resp.code === 200) {
      message.success('删除成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('删除失败，请重试')
    return false
  }
}

const ClientOrgTableList = () => {
  const actionRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)

  const [fileList, setFileList] = useState([])
  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  const [financeItem, setFinanceItem] = useState([])

  const columns = [
    {
      title: '客户ID',
      dataIndex: 'id',
      valueType: 'text',

      hideInSearch: true,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '统一社会信用码',
      dataIndex: 'socialCreditCode',
      valueType: 'text',
    },
    {
      title: '单位地址',
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '所在地区',
      dataIndex: 'region',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      width: '320px',
      hideInSearch: true,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('system:dictType:edit')}
          onClick={() => {
            setModalVisible(true)
            setCurrentRow(record)
            console.log(record.id)
            listClientFinanceItem({ clientOrgId: record.id }).then((res) =>
              setFinanceItem(res.data)
            )
          }}
        >
          财务信息编辑
        </Button>,
        <Button
          type="link"
          size="small"
          key="editData"
          // hidden={!access.hasPerms('system:dictType:edit')}
          onClick={() => {
            setModalVisible(true)
            setCurrentRow(record)
          }}
        >
          回款明细
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          // hidden={!access.hasPerms('system:dictType:remove')}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record)
                if (success) {
                  actionRef.current?.reload()
                }
              },
            })
          }}
        >
          删除
        </Button>,
      ],
    },
  ]

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
      actionRef.current?.reload()
    }
    setFileList(fileList)
  }

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        key="companyClientOrgList"
        search={{
          labelWidth: 120,
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `总共 ${total} 条`,
        }}
        request={(params) =>
          listClient({ ...params, pageNum: params.current }).then((res) => {
            const result = {
              data: res.rows,
              total: res.total,
              success: true,
            }
            return result
          })
        }
        toolBarRender={() => [
          <Button
            type="primary"
            key="template"
            onClick={async () => {
              download(
                '/company/client/template/download',
                {},
                '客户导入模板.xlsx'
              )
            }}
          >
            下载模板
          </Button>,
          <Upload
            action={getUploadUrl() + '/company/client/upload'}
            headers={{ Authorization: 'Bearer ' + getAccessToken() }}
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>批量导入</Button>
          </Upload>,
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
          },
        }}
      />

      <FinanceInfo
        record={currentRow || {}}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        financeItem={financeItem}
      />
    </>
  )
}

export default ClientOrgTableList
