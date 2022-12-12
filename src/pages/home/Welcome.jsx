import React from 'react'
import styles from './index.module.scss'

function Welcome() {
  return (
    <div className={styles.home}>
      <img src={require('@/assets/login/welcome.png')} alt="welcome" />
    </div>
  )
}

export default Welcome
