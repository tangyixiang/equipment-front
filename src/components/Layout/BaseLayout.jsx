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
  const {
    tabStore,
    userStore: { userInfo },
  } = useGlobalStore()

  const [menus, initMenu] = useInitMenus()
  const [initRouer] = useInitRouter()

  useLayoutEffect(() => {
    if (userInfo) {
      getRouters().then((res) => {
        const menuTree = initMenu(res.data)
        initRouer(menuTree, props.initRouer)
        tabStore.setRouterList(menuTree)
      })
    }
  }, [userInfo])

  return (
    <Layout className="min-h-screen">
      <AHeader />
      <Layout>
        <ASider menus={menus} />
        <Layout>
          <ATabs />
          <Layout.Content className="p-6 min-h-280">
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
