import React from 'react'
import { Layout, Dropdown, Menu, Space, message } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import useGlobalStore from '@/store'
import { logout } from '@/api/login'
import { clearSessionToken } from '@/utils/access'
import ResetPwd from '@/pages/system/user/components/ResetPwd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const name = process.env.REACT_APP_SYS_NAME

function AHeader() {
  const { userStore, tabStore } = useGlobalStore()
  const [showResetPwd, setShowResetPwd] = useState(false)
  let navigate = useNavigate()

  const handleMenuClick = (e) => {
    if (e.key === 'changePassword') {
      setShowResetPwd(true)
    }

    if (e.key === 'logout') {
      logout()
      tabStore.clearTabList()
      clearSessionToken()
      message.success('退出成功', 1, () => {
        navigate('/login')
      })
    }
  }

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: '修改密码',
          key: 'changePassword',
        },
        {
          label: '退出登录',
          key: 'logout',
        },
      ]}
    />
  )

  return (
    <>
      <Layout.Header className="pl-5 h-12">
        <div className="flex justify-between h-12">
          {/* <img className="w-[42px]" alt="logo" src="./logo.svg" /> */}
          <div className="flex">
            <img className="w-[42px]" alt="logo" src="./logo.svg" />
            <div className="text-white text-base flex items-center">{name}</div>
          </div>
          <Dropdown overlay={menu}>
            <Space className="text-slate-100">
              {userStore.userInfo.nickName}
              <DownOutlined style={{ fontSize: '12px' }} />
            </Space>
          </Dropdown>
        </div>
      </Layout.Header>
      <ResetPwd open={showResetPwd} onCancel={setShowResetPwd} />
    </>
  )
}

export default AHeader
