import * as React from 'react'
import { Badge } from 'antd'
import classNames from 'classnames'
import * as AntdIcons from '@ant-design/icons'
import styles from './style.module.scss'

const allIcons = AntdIcons

const CopyableIcon = ({ name, isNew, justCopied, theme, onSelect }) => {
  const className = classNames({
    copied: justCopied === name,
    [theme]: !!theme,
  })
  return (
    <li
      className={className}
      onClick={() => {
        if (onSelect) {
          onSelect(name)
        }
      }}
    >
      {React.createElement(allIcons[name], { className: styles.anticon })}
      <span className={styles.anticonTitle}>
        <Badge dot={isNew}>{name}</Badge>
      </span>
    </li>
  )
}

export default CopyableIcon
