import { Button, message, Modal, Upload } from 'antd'
import React, { useState, useEffect } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Search, Table, useTable, withTable } from 'table-render'
import {
  listClient,
  delClient,
  listClientFinanceItem,
} from '@/api/finance/clientorg'
import { getUploadUrl } from '@/utils/common'
import { getAccessToken } from '@/utils/access'
import { download } from '@/utils/request'
import FinanceInfo from './components/info'

const schema = {
  type: 'object',
  properties: {
    name: {
      title: '客户名称',
      type: 'string',
      width: '25%',
    },
    socialCreditCode: {
      title: '统一社会信用码',
      type: 'string',
      width: '25%',
      labelWidth: 120,
    },
  },
}

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除')
  if (!selectedRows) return true
  try {
    const resp = await delClient(selectedRows.map((row) => row.id).join(','))
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
  const { refresh } = useTable()
  const [modalVisible, setModalVisible] = useState(false)
  const [readOnly, setReadOnly] = useState(false)

  const [fileList, setFileList] = useState([])
  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  const [financeItem, setFinanceItem] = useState([])

  const columns = [
    {
      title: '客户ID',
      dataIndex: 'id',
      valueType: 'text',
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
    },
    {
      title: '所在地区',
      dataIndex: 'region',
      valueType: 'text',
    },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      valueType: 'text',
    },
    {
      title: '操作',
      width: '320px',
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
                  refresh()
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
      refresh()
    }
    setFileList(fileList)
  }

  const searchApi = (params) => {
    const requestParams = {
      ...params,
      pageNum: params.current,
    }
    // console.log('params >>> ', requestParams)

    return listClient(requestParams).then((res) => {
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
          key="companyClientOrgList"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          toolbarAction
          toolbarRender={() => [
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
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows)
            },
          }}
        />
      </div>
      <FinanceInfo
        record={currentRow || {}}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        financeItem={financeItem}
      />
    </>
  )
}

export default withTable(ClientOrgTableList)
