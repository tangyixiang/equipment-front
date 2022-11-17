import { Button, Modal, message, Form } from 'antd'
import React, { useState, useEffect } from 'react'
import { Search, Table, useTable, withTable } from 'table-render'
import { delData, listData, updateData, addData } from '@/api/system/dict/data'
import {
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form'

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addData({ ...fields })
    hide()
    if (resp.code === 200) {
      message.success('添加成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('添加失败请重试！')
    return false
  }
}

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置')
  try {
    const resp = await updateData(fields)
    hide()
    if (resp.code === 200) {
      message.success('配置成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    message.error('配置失败请重试！')
    return false
  }
}

const handleRemoveOne = async (selectedRow) => {
  const hide = message.loading('正在删除')
  if (!selectedRow) return true
  try {
    const resp = await delData(selectedRow.dictCode)
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

function DictData(props) {
  const [form] = Form.useForm()
  const { refresh, setTable } = useTable()

  const [currentRow, setCurrentRow] = useState()
  const [modalVisible, setModalVisible] = useState(false)

  // useEffect(() => {
  //   if (props.values.dictType) {
  //     refresh({ dictType: props.values.dictType })
  //   }
  // }, [props])

  const columns = [
    {
      title: '字典排序',
      dataIndex: 'dictSort',
      valueType: 'text',
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      valueType: 'text',
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      valueType: 'text',
    },
    {
      title: '操作',
      width: '220px',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="editDictData"
          onClick={() => {
            setModalVisible(true)
            initForm(record)
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="removeDictData"
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

  const searchApi = (params) => {
    const requestParam = {
      ...params,
      pageNum: params.current,
      dictType: props.values.dictType,
    }
    return listData(requestParam).then((res) => {
      const result = {
        rows: res.rows,
        total: res.total,
        success: true,
      }
      return result
    })
  }

  const handleCancel = () => {
    props.onCancel()
    setTable({ dataSource: [] })
  }

  const handleOk = () => {
    form.submit()
  }

  const handleEditCancel = () => {
    setModalVisible(false)
    form.resetFields()
  }

  const handleFinish = async (values) => {
    let success = false
    if (values.dictCode) {
      success = await handleUpdate({ ...values })
    } else {
      success = await handleAdd({ ...values })
    }
    if (success) {
      setModalVisible(false)
      setCurrentRow(undefined)
      refresh()
    }
  }

  const initForm = (record) => {
    form.setFieldsValue({
      dictCode: record.dictCode,
      dictSort: record.dictSort,
      dictLabel: record.dictLabel,
      dictValue: record.dictValue,
      dictType: record.dictType,
      remark: record.remark,
    })
  }

  return (
    <>
      <Modal
        destroyOnClose
        width={720}
        open={props.showData}
        onCancel={handleCancel}
        footer={null}
      >
        <Search hidden schema={[]} api={searchApi} displayType="row" />
        <Table
          columns={columns}
          rowKey="dictCode"
          key="dictDataList"
          toolbarRender={() => [
            <Button
              type="primary"
              key="add"
              // hidden={!access.hasPerms('system:dictType:add')}
              onClick={async () => {
                setCurrentRow(undefined)
                initForm({ dictType: props.values.dictType })
                setModalVisible(true)
              }}
            >
              添加
            </Button>,
          ]}
        />
      </Modal>

      <Modal
        title="编辑"
        open={modalVisible}
        destroyOnClose
        onOk={handleOk}
        onCancel={handleEditCancel}
      >
        <Form form={form} onFinish={handleFinish}>
          <ProFormText
            name="dictCode"
            label={'字典编码'}
            width="xl"
            placeholder="请输入字典编码"
            disabled
            hidden={true}
            rules={[
              {
                required: false,
                message: '请输入字典编码！',
              },
            ]}
          />
          <ProFormText
            name="dictType"
            label={'字典类型'}
            width="xl"
            placeholder="请输入字典类型"
            disabled
            hidden={!props.values.dictType}
            rules={[
              {
                required: false,
                message: '请输入字典类型！',
              },
            ]}
          />
          <ProFormText
            name="dictLabel"
            label={'字典标签'}
            width="xl"
            placeholder="请输入字典标签"
            fieldProps={{
              autoComplete: 'off',
            }}
            rules={[
              {
                required: false,
                message: '请输入字典标签！',
              },
            ]}
          />
          <ProFormText
            name="dictValue"
            label={'字典键值'}
            width="xl"
            fieldProps={{
              autoComplete: 'off',
            }}
            placeholder="请输入字典键值"
            rules={[
              {
                required: false,
                message: '请输入字典键值！',
              },
            ]}
          />
          <ProFormDigit
            name="dictSort"
            label={'字典排序'}
            width="xl"
            placeholder="请输入字典排序"
            rules={[
              {
                required: false,
                message: '请输入字典排序！',
              },
            ]}
          />
          <ProFormTextArea
            name="remark"
            label={'备注'}
            width="xl"
            placeholder="请输入备注"
            rules={[
              {
                required: false,
                message: '请输入备注！',
              },
            ]}
          />
        </Form>
      </Modal>
    </>
  )
}

export default withTable(DictData)
