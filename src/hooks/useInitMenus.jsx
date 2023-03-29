import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { createIcon } from '@/utils/IconUtils'

function useInitMenus(tabItems) {
  let navigate = useNavigate()
  const [tabs, setTabs] = useState(tabItems || [])
  const [menus, setMenus] = useState([])

  function initMenu(data, setActive, setTabItem) {
    const menuTree = data.map((item) => ({
      key: item.path.match(':') ? item.path + nanoid() : item.path,
      path: item.path,
      label: item.meta.title,
      icon: createIcon(item.meta.icon),
      children: item.children
        ? initMenu(item.children, setActive, setTabItem)
        : undefined,
      // hideChildrenInMenu: item.hidden,
      hide: item.hidden + '',
      component: item.component,
      authority: item.perms,
      parent: item.menuType === 'M' ? 'true' : 'false',
      onClick: () => showPage(item, setActive, setTabItem),
    }))
    setMenus(menuTree)
    return menuTree
  }

  const showPage = (item, setActive, setTabItem) => {
    if (item.menuType === 'C') {
      if (item.query) {
        navigate(item.path.split(':')[0] + item.query)
      } else {
        navigate(item.path)
      }
      setActive(item.path)
      const exist = tabs.some((e) => e.key === item.path)
      if (!exist) {
        const array = [...tabs, { key: item.path, label: item.meta.title }]
        console.log(tabs)
        setTabs([...tabs, { key: item.path, label: item.meta.title }])
        setTabItem(array)
      }
    }
  }
  return [menus, initMenu]
}

export default useInitMenus
