import React, { useState, useEffect } from 'react'
import { getDeptTreeList } from '@/api/system/dept'
import { Tree, message } from 'antd'

const { DirectoryTree } = Tree

export const DeptTree = (props) => {
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const fetchDeptList = async () => {
    const hide = message.loading('正在查询')
    try {
      await getDeptTreeList({}).then((res) => {
        const exKeys = []
        exKeys.push('1')
        setTreeData(res)
        exKeys.push(res[0].children[0].id)
        setExpandedKeys(exKeys)
        props.onSelect(res[0].children[0])
      })
      hide()
      // message.success('数据查询成功');
      return true
    } catch (error) {
      hide()
      // message.error('数据查询失败');
      return false
    }
  }

  useEffect(() => {
    fetchDeptList()
  }, [])

  const onSelect = (keys, info) => {
    props.onSelect(info.node)
  }

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  return (
    <DirectoryTree
      // multiple
      defaultExpandAll
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onSelect={onSelect}
      treeData={treeData}
    />
  )
}

export default DeptTree
