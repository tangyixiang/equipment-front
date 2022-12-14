import React from 'react'
import { Layout } from 'antd'
import ASider from './ASider'
import { Outlet } from 'react-router-dom'
import AHeader from './AHeader'

const BaseLayout = (props) => {
  return (
    <Layout className="min-h-screen">
      <AHeader />
      <Layout>
        <ASider menus={props.menus} />
        <Layout>
          <Layout.Content className="p-6 min-h-280">
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
