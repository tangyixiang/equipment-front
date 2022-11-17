import React, { useState } from 'react'
import { userStore } from '@/store'

// 验证上下文空间
let AuthContext = React.createContext(null)

// 利用useContext导出验证上下文，供其它组件使用
export function useAuth() {
  return React.useContext(AuthContext)
}

// 验证提供者
export default function AuthProvider({ children }) {
  // 登录验证
  let signin = (userInfo) => {
    userStore.setUserInfo(userInfo)
  }

  // 退出登录
  let signout = (callback) => {
    userStore.clearUserInfo()
  }

  let value = { signin, signout }

  // 传递验证上下文(AuthContext)属性给嵌套的插槽children子组件(App)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
