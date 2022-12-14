import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createIcon } from '@/utils/IconUtils'

function ASider(props) {
  let navigate = useNavigate()

  const home = {
    key: 'home',
    path: '/home',
    label: '首页',
    icon: createIcon('HomeOutlined'),
    onClick: () => navigate('/home'),
  }

  const filterMenu = (menuList) => {
    return menuList
      .filter((item) => item.hide == 'false')
      .map((item) => {
        if (item.children) {
          item.children = filterMenu(item.children)
        }
        return item
      })
  }

  const menus = filterMenu([home].concat(props.menus))

  return (
    <Layout.Sider width={220} theme="light">
      <Menu
        mode="inline"
        style={{ height: '100%', borderRight: 0, padding: '4px 0' }}
        // items={props.menus}
        items={menus}
      />
    </Layout.Sider>
  )
}

export default ASider
