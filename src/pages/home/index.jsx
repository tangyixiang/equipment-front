import React from 'react'
import { Col, Row, Card, Button } from 'antd'

const Content = () => {
  return (
    <Col span={4}>
      <Card>
        <div className="flex justify-between">
          <p>检修率</p>
          <p>50%</p>
        </div>
        <div className="flex justify-between">
          <p>累计报检数</p>
          <p>177</p>
        </div>
      </Card>
    </Col>
  )
}

function Home() {
  return (
    <>
      <Row gutter={12}>
        {new Array(6).fill(null).map((_, i) => (
          <Content key={i} />
        ))}
      </Row>

      <Row gutter={12}>
        <Col span={16}>
          <Row className="mt-6">
            <Col span={24}>
              <Card
                title="快捷入口"
                bordered={false}
                style={{ width: '100%' }}
                extra={<Button>页面配置</Button>}
              >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>

          <Row className="mt-6">
            <Col span={24}>
              <Card
                title="工作签批"
                bordered={false}
                style={{ width: '100%' }}
                extra={<Button>页面配置</Button>}
              >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={8}>
          <Row className="mt-6">
            <Col span={24}>
              <Card
                title="平台公告"
                bordered={false}
                style={{ width: '100%' }}
                extra={<Button type="link">{'更多>'}</Button>}
              >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
          <Row className="mt-6">
            <Col span={24}>
              <Card title="App下载" bordered={false} style={{ width: '100%' }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default Home
