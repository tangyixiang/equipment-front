import React from 'react'
import UserInfoStore from './UserStore'
import TabStore from './TabStore'

class RootStore {
  userStore
  tabs
  constructor() {
    // 对引入进行来的子模块进行实例化操作，并挂载到RootStore上
    this.userStore = new UserInfoStore()
    this.tabs = new TabStore()
  }
}

// 实例化操作
const rootStore = new RootStore()
// 这里可以使用React context 完成统一方法的封装需求
const context = React.createContext(rootStore)
// 封装useGlobalStore方法，业务组件调用useGlobalStore方法便就可以直接获取rootStore
const useGlobalStore = () => React.useContext(context)

export default useGlobalStore
