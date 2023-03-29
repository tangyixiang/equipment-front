import React, { useContext } from 'react'
import { Tabs } from 'antd'
import './index.scss'
import history from '@/utils/history'

function ATabs(props) {
  const handleClick = (path) => {
    history.push(path)
  }

  const onEdit = (targetKey, action) => {}

  return (
    <div className="tabs">
      <Tabs
        // activeKey={tabs.active}
        size="small"
        items={[]}
        type="editable-card"
        hideAdd
        onChange={handleClick}
        onEdit={onEdit}
      />
    </div>
  )
}

export default ATabs
