import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store' // 引入makePersistable方法进行持久化存储

export default class UserInfoStore {
  userInfo = undefined

  configMenus = undefined

  constructor() {
    // 对初始化数据进行响应式处理
    makeAutoObservable(this)
    makePersistable(this, {
      name: 'userInfo', // 存储到localStorage当中的key值是什么，此处为字符串string；
      properties: ['userInfo', 'configMenus'], // 需要持久化的数据是什么，此数据需要为上面声明了的变量，并且传值方式为[string]
      storage: window.localStorage, // 你的数据需要用那种方式存储，常见的就是localStorage
    })
  }

  setUserInfo = (userInfo) => {
    this.userInfo = userInfo
  }

  setconfigMenus = (menus) => {
    this.configMenus = menus
  }

  get getConfigMenus() {
    return this.configMenus
  }

  clearUserInfo = () => {
    this.userInfo = ''
  }
}
