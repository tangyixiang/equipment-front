import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { getCodeImg, login } from '@/api/login'
import { getUserProfile } from '@/api/system/user'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Form, Input, Image, Row, Col, message } from 'antd'
import { setSessionToken, clearSessionToken } from '@/utils/access'
import useGlobalStore from '@/store'
import { observer } from 'mobx-react-lite'

function Login() {
  const [captchaCode, setCaptchaCode] = useState('')
  const [uuid, setUuid] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { userStore } = useGlobalStore()

  // 获取URL来路，/ or /protected
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    // getCaptchaCode()
  }, [])

  const getCaptchaCode = async () => {
    const response = await getCodeImg()
    const imgdata = `data:image/png;base64,${response.img}`
    setCaptchaCode(imgdata)
    setUuid(response.uuid)
  }

  const handleSubmit = async (values) => {
    try {
      // 登录
      const response = await login({ ...values, uuid })
      if (response.code === 200) {
        const current = new Date()
        const expireTime = current.setTime(
          current.getTime() + 1000 * 12 * 60 * 60
        )
        setSessionToken(response.token, response.token, expireTime)
        message.success('登录成功')
        getUserProfile().then((res) => {
          const { userName, nickName } = res.data
          userStore.setUserInfo({ userName, nickName })
          navigate(from, { replace: true })
        })
        return
      } else {
        console.log('login failed')
        clearSessionToken()
        message.error(response.msg)
        getCaptchaCode()
      }
    } catch (error) {
      clearSessionToken()
      console.log(error)
      getCaptchaCode()
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.loginBox}>
        <div className={styles.boxLeft}>
          <img alt="logo" src={require('@/assets/login/login_left.png')} />
        </div>
        <div className={styles.boxRight}>
          <Form
            name="loginForm"
            className="w-[336px]"
            onFinish={handleSubmit}
            initialValues={{
              code: '342432',
              username: 'admin',
              password: 'admin123',
            }}
          >
            <Form.Item>
              <div className="flex justify-center">
                <span className="text-3xl font-bold mb-4">欢迎使用</span>
              </div>
            </Form.Item>
            <Form.Item
              name="username"
              className="mb-6"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                placeholder="用户名"
                autoComplete="off"
                className="rounded h-10"
              />
            </Form.Item>
            <Form.Item
              name="password"
              className="mb-6"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password placeholder="密码" className="rounded h-10" />
            </Form.Item>
            {/* <Form.Item
              name="code"
              className="mb-6"
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
              ]}
            >
              <Row>
                <Col span={16}>
                  <Input placeholder="验证码" className="rounded h-10" />
                </Col>
                <Col span={8}>
                  <Image
                    src={captchaCode}
                    alt="验证码"
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'top',
                      cursor: 'pointer',
                      paddingLeft: '10px',
                      width: '100px',
                    }}
                    preview={false}
                    onClick={() => getCaptchaCode()}
                  />
                </Col>
              </Row>
            </Form.Item> */}
            <Form.Item>
              <div className="flex justify-center ...">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-[268px] rounded-3xl mt-6"
                >
                  登录
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default observer(Login)
