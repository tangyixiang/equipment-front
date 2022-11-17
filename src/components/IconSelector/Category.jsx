import * as React from 'react'
import { message } from 'antd'
import CopyableIcon from './CopyableIcon'
import styles from './style.module.scss'

class Category extends React.Component {
  copyId

  state = {
    justCopied: null,
  }

  componentWillUnmount() {
    window.clearTimeout(this.copyId)
  }

  onSelect = (name) => {
    const { onSelect } = this.props
    if (onSelect) {
      onSelect(name)
    }
    message.success(
      <span>
        <code className="copied-code">{name}</code> selected 🎉
      </span>
    )
    this.setState({ justCopied: name }, () => {
      this.copyId = window.setTimeout(() => {
        this.setState({ justCopied: null })
      }, 2000)
    })
  }

  render() {
    const { icons, title, newIcons, theme } = this.props
    const items = icons.map((name) => (
      <CopyableIcon
        key={name}
        name={name}
        theme={theme}
        isNew={newIcons.indexOf(name) >= 0}
        justCopied={this.state.justCopied}
        onSelect={this.onSelect}
      />
    ))

    return (
      <div>
        {/* <h3>{messages[`app.docs.components.icon.category.${title}`]}</h3> */}
        <ul className={styles.anticonsList}>{items}</ul>
      </div>
    )
  }
}

export default Category
