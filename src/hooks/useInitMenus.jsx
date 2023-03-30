import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { createIcon } from '@/utils/IconUtils'

function useInitMenus() {
  let navigate = useNavigate()
  const [menus, setMenus] = useState([])

  function initMenu(data) {
    const menuTree = data.map((item) => ({
      key: item.path.match(':') ? item.path + nanoid() : item.path,
      path: item.path,
      label: item.meta.title,
      icon: createIcon(item.meta.icon),
      children: item.children
        ? initMenu(item.children)
        : undefined,
      // hideChildrenInMenu: item.hidden,
      hide: item.hidden + '',
      component: item.component,
      authority: item.perms,
      parent: item.menuType === 'M' ? 'true' : 'false',
      onClick: () => showPage(item),
    }))
    setMenus(menuTree)
    return menuTree
  }

  const showPage = (item) => {
    if (item.menuType === 'C') {
      if (item.query) {
        navigate(item.path.split(':')[0] + item.query)
      } else {
        navigate(item.path)
      }
    }
  }
  return [menus, initMenu]
}

export default useInitMenus
