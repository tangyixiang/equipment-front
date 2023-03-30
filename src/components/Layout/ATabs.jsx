import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import useGlobalStore from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'
import './index.scss'

function ATabs(props) {
  const {
    tabs,
    tabs: { tabList },
  } = useGlobalStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(pathname)

  useEffect(() => {
    addTabs()
  }, [pathname])

  const clickTabs = (path) => {
    navigate(path)
  }

  const addTabs = () => {
    const exist = tabList.some((e) => e.key === pathname)
    if (!exist) {
      const newTabs = tabList.concat({ key: pathname, label: pathname })
      tabs.setTabList(newTabs)
    }
    setActive(pathname)
  }

  const delTab = (tabPath) => {
    if (tabPath === '/') return
    if (pathname === tabPath) {
      tabList.forEach((item, index) => {
        if (item.key !== pathname) return
        const nextTab = tabList[index + 1] || tabList[index - 1]
        if (!nextTab) return
        navigate(nextTab.path)
      })
    }
    tabs.setTabList(tabList.filter((item) => item.path !== tabPath))
  }

  return (
    <div className="tabs">
      <Tabs
        activeKey={active}
        size="small"
        items={tabList}
        type="editable-card"
        hideAdd
        onChange={clickTabs}
        onEdit={delTab}
      />
    </div>
  )
}

export default ATabs
