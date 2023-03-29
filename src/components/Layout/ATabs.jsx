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
        activeKey={props.active}
        size="small"
        items={props.tabs}
        type="editable-card"
        hideAdd
        onChange={handleClick}
        onEdit={props.del}
      />
    </div>
  )
}

export default ATabs
