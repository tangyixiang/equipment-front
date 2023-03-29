import React, { useState, useLayoutEffect } from 'react'
import { Layout } from 'antd'
import ASider from './ASider'
import { Outlet } from 'react-router-dom'
import AHeader from './AHeader'
import ATabs from './ATabs'
import { getRouters } from '@/api/menu'
import useGlobalStore from '@/store'
import useInitMenus from '@/hooks/useInitMenus'
import useInitRouter from '@/hooks/useInitRouter'

const BaseLayout = (props) => {
  const { userStore } = useGlobalStore()
  let user = userStore.userInfo
  const [activeKey, setActiveKey] = useState('/')
  const [tabItems, setTabItems] = useState([{ key: '/', label: '首页' }])
  const [menus, initMenu] = useInitMenus(tabItems)
  const [initRouer] = useInitRouter()

  console.log(tabItems)

  useLayoutEffect(() => {
    if (user) {
      getRouters().then((res) => {
        const menuTree = initMenu(res.data, setActiveKey, setTabItems)
        initRouer(menuTree, props.initRouer)
      })
    }
  }, [user])

  const removeTab = (key, action) => {
    console.log(`${key}  ${action}`)
  }

  return (
    <Layout className="min-h-screen">
      <AHeader />
      <Layout>
        <ASider menus={menus} />
        <Layout>
          <ATabs tabs={tabItems} active={activeKey} del={removeTab} />
          <Layout.Content className="p-6 min-h-280">
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
