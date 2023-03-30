import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store' // 引入makePersistable方法进行持久化存储

const HOME = { key: '/', label: '首页', closable: false }

export default class TabStore {
  tabList = [HOME]
  routerList = []

  constructor() {
    // 对初始化数据进行响应式处理
    makeAutoObservable(this)
    // 数据持久化
    makePersistable(this, {
      name: 'tabs', // 存储到localStorage当中的key值是什么，此处为字符串string；
      properties: ['tabList'], // 需要持久化的数据是什么，此数据需要为上面声明了的变量，并且传值方式为[string]
      storage: window.sessionStorage, // 你的数据需要用那种方式存储，常见的就是localStorage
    })
  }

  setTabList = (tabList) => {
    this.tabList = tabList
  }

  clearTabList = () => {
    this.tabList = [HOME]
  }

  setRouterList = (menuTree) => {
    const routerArray = []
    this.flatMenu(menuTree, routerArray)
    this.routerList = routerArray
  }

  flatMenu(data, routerArray) {
    data.forEach((item) => {
      if (item.children) {
        this.flatMenu(item.children, routerArray)
      }
      const key = item.query ? item.path.split(':')[0] + item.query : item.path
      if (item.parent === 'true') return
      routerArray.push({ key: key, label: item.label })
    })
  }
}
