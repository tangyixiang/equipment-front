import React, { useRef, useState, useEffect } from 'react'
import { Card, Col, Row, Button, Modal, message } from 'antd'
import DeptTree from './components/DeptTree'
import UpdateForm from './components/edit'
import {
  getUser,
  delUser,
  listUser,
  addUser,
  updateUser,
  resetUserPwd,
} from '@/api/system/user'
import { getDeptTreeList } from '@/api/system/dept'
import { getDicts } from '@/api/system/dict/data'
import { listPost } from '@/api/system/post'
import { listRole } from '@/api/system/role'
import ProTable from '@ant-design/pro-table'

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')
  try {
    const resp = await addUser({ ...fields })
    hide()
    if (resp.code === 200) {
      message.success('添加成功')
    } else {
      message.error(resp.msg)
    }
    return true
  } catch (error) {
    hide()
    return false
  }
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置')
  try {
    const resp = await updateUser(fields)
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

function UserTableList() {
  const actionRef = useRef()
  const formTableRef = useRef()

  const [modalVisible, setModalVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const [selectDept, setSelectDept] = useState({ id: 0 })

  const [sexOptions, setSexOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])

  const [postIds, setPostIds] = useState()
  const [postList, setPostList] = useState()
  const [roleIds, setRoleIds] = useState()
  const [roleList, setRoleList] = useState()
  const [deptTree, setDeptTree] = useState()

  useEffect(() => {
    getDicts('sys_user_sex').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setSexOptions(opts)
      }
    })
    getDicts('sys_normal_disable').then((res) => {
      if (res.code === 200) {
        const opts = {}
        res.data.forEach((item) => {
          opts[item.dictValue] = item.dictLabel
        })
        setStatusOptions(opts)
      }
    })
  }, [])

  const columns = [
    {
      title: '编号',
      dataIndex: 'userId',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '部门ID',
      dataIndex: 'deptId',
      valueType: 'text',
    },
    {
      title: '用户账号',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户名称',
      dataIndex: 'nickName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '帐号状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
    },
    {
      title: '操作',
      width: '220px',
      hideInSearch: true,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          // hidden={!access.hasPerms('system:user:edit')}
          onClick={() => {
            const fetchUserInfo = async (userId) => {
              const res = await getUser(userId)
              const { postIds, roleIds } = res
              setPostIds(postIds)
              setPostList(
                res.posts.map((item) => {
                  return {
                    value: item.postId,
                    label: item.postName,
                  }
                })
              )
              setRoleIds(roleIds)
              setRoleList(
                res.roles.map((item) => {
                  return {
                    value: item.roleId,
                    label: item.roleName,
                  }
                })
              )
            }
            fetchUserInfo(record.userId)
            getDeptTreeList({}).then((treeData) => {
              setDeptTree(treeData)
            })
            setModalVisible(true)
            setCurrentRow(record)
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          // hidden={!access.hasPerms('system:user:remove')}
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
        <Button
          type="link"
          size="small"
          key="resetpwd"
          // hidden={!access.hasPerms('system:user:edit')}
          onClick={() => {
            resetUserPwd(record.userId, '123456').then((res) => {
              if (res.code == '200') {
                message.success('密码重置成功,密码为 123456', 5)
              }
            })
          }}
        >
          密码重置
        </Button>,
      ],
    },
  ]

  const handleRemoveOne = async (selectedRow) => {
    const hide = message.loading('正在删除')
    if (!selectedRow) return true
    try {
      const params = [selectedRow.userId]
      const resp = await delUser(params.join(','))
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

  return (
    <>
      <Row gutter={[16, 24]}>
        <Col lg={6} md={24}>
          <Card>
            <DeptTree
              onSelect={async (value) => {
                setSelectDept(value)
                if (actionRef.current) {
                  formTableRef?.current?.submit()
                }
              }}
            />
          </Card>
        </Col>
        <Col lg={18} md={24}>
          <ProTable
            actionRef={actionRef}
            formRef={formTableRef}
            columns={columns}
            rowKey="userId"
            key="userList"
            request={(params) =>
              listUser(params).then((res) => {
                return {
                  data: res.rows,
                  total: res.total,
                  extraData: res.code,
                }
              })
            }
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: (total) => `总共 ${total} 条`,
            }}
            toolBarRender={() => [
              <Button
                key="primary"
                type="primary"
                onClick={async () => {
                  if (selectDept.id === '' || selectDept.id == null) {
                    message.warning('请选择左侧父级节点')
                  } else {
                    getDeptTreeList({}).then((treeData) => {
                      setDeptTree(treeData)
                      setCurrentRow(undefined)
                      setModalVisible(true)
                    })
                    listPost().then((res) => {
                      if (res.code === 200) {
                        setPostList(
                          res.rows.map((item) => {
                            return {
                              value: item.postId,
                              label: item.postName,
                            }
                          })
                        )
                      }
                    })
                    listRole().then((res) => {
                      if (res.code === 200) {
                        setRoleList(
                          res.rows.map((item) => {
                            return {
                              value: item.roleId,
                              label: item.roleName,
                            }
                          })
                        )
                      }
                    })
                  }
                }}
              >
                新增用户
              </Button>,
            ]}
          />
        </Col>
      </Row>
      <UpdateForm
        onSubmit={async (values) => {
          let success = false
          if (values.userId) {
            success = await handleUpdate({ ...values })
          } else {
            success = await handleAdd({ ...values })
          }
          if (success) {
            setModalVisible(false)
            setCurrentRow(undefined)
            actionRef.current?.reload()
          }
        }}
        onCancel={() => {
          setModalVisible(false)
          setCurrentRow(undefined)
        }}
        visible={modalVisible}
        values={currentRow || {}}
        sexOptions={sexOptions}
        statusOptions={statusOptions}
        posts={postList || []}
        postIds={postIds || []}
        roles={roleList || []}
        roleIds={roleIds || []}
        depts={deptTree || []}
      />
    </>
  )
}

export default UserTableList
