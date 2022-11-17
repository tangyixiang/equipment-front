import * as React from 'react'
import Icon, * as AntdIcons from '@ant-design/icons'
import { Radio, Input, Empty, Tabs, Row, Col } from 'antd'
import debounce from 'lodash/debounce'
import Category from './Category'
import { categories } from './fields'
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons'
import { Fragment } from 'react'

const { TabPane } = Tabs

const allIcons = AntdIcons

const ThemeType = {
  Filled: 'Filled',
  Outlined: 'Outlined',
  TwoTone: 'TwoTone',
}

class IconSelector extends React.PureComponent {
  static categories = categories

  static newIconNames = []

  state = {
    theme: ThemeType.Outlined,
    searchKey: '',
  }

  constructor(props) {
    super(props)
    this.handleSearchIcon = debounce(this.handleSearchIcon, 300)
  }

  handleChangeTheme = (e) => {
    this.setState({
      theme: e.target.value,
    })
  }

  handleSearchIcon = (searchKey) => {
    this.setState((prevState) => ({
      ...prevState,
      searchKey,
    }))
  }

  getTitle(cate) {
    const titles = {
      direction: '方向性图标',
      suggestion: '提示建议性图标',
      editor: '编辑类图标',
      data: '数据类图标',
      logo: '品牌和标识',
      other: '网站通用图标',
    }
    return titles[cate]
  }

  renderTabs() {
    const { searchKey = '', theme } = this.state
    const { onSelect } = this.props

    const categoriesResult = Object.keys(categories)
      .map((key) => {
        let iconList = categories[key]
        if (searchKey) {
          const matchKey = searchKey
            .replace(new RegExp(`^<([a-zA-Z]*)\\s/>$`, 'gi'), (_, name) => name)
            .replace(/(Filled|Outlined|TwoTone)$/, '')
            .toLowerCase()
          iconList = iconList.filter((iconName) =>
            iconName.toLowerCase().includes(matchKey)
          )
        }
        // CopyrightCircle is same as Copyright, don't show it
        iconList = iconList.filter((icon) => icon !== 'CopyrightCircle')
        return {
          category: key,
          icons: iconList
            .map((iconName) => iconName + theme)
            .filter((iconName) => allIcons[iconName]),
        }
      })
      .filter(({ icons }) => !!icons.length)
      .map(({ category, icons }) => ({
        label: this.getTitle(category),
        key: category,
        children: (
          <Category
            key={category}
            title={category}
            theme={theme}
            icons={icons}
            newIcons={IconSelector.newIconNames}
            onSelect={(name) => {
              if (onSelect) {
                onSelect(name, allIcons[name])
              }
            }}
          />
        ),
      }))

    // <TabPane tab={this.getTitle(category)} key={category}>
    // <Category
    //   key={category}
    //   title={category}
    //   theme={theme}
    //   icons={icons}
    //   newIcons={IconSelector.newIconNames}
    //   onSelect={(name) => {
    //     if (onSelect) {
    //       onSelect(name, allIcons[name])
    //     }
    //   }}
    // />
    // </TabPane>
    return categoriesResult.length === 0 ? (
      <Empty style={{ margin: '2em 0' }} />
    ) : (
      categoriesResult
    )
  }

  render() {
    return (
      <Fragment>
        <Row gutter={[16, 16]}>
          <Col span={4}>
            <Radio.Group
              value={this.state.theme}
              onChange={this.handleChangeTheme}
              size="large"
              buttonStyle="solid"
            >
              <Radio.Button value={ThemeType.Outlined}>
                <Icon component={OutlinedIcon} />{' '}
                {/* {messages['app.docs.components.icon.outlined']} */}
              </Radio.Button>
              <Radio.Button value={ThemeType.Filled}>
                <Icon component={FilledIcon} />{' '}
                {/* {messages['app.docs.components.icon.filled']} */}
              </Radio.Button>
              <Radio.Button value={ThemeType.TwoTone}>
                <Icon component={TwoToneIcon} />{' '}
                {/* {messages['app.docs.components.icon.two-tone']} */}
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={18}>
            <Input.Search
              style={{ margin: '0 10px', flex: 1 }}
              allowClear
              onChange={(e) => this.handleSearchIcon(e.currentTarget.value)}
              size="large"
              autoFocus
              // suffix={<IconPicSearcher />}
            />
          </Col>
        </Row>
        <Row>
          {/* <Tabs defaultActiveKey="1">{this.renderTabs()}</Tabs> */}
          <Tabs defaultActiveKey="1" items={this.renderTabs()} />
        </Row>
      </Fragment>
    )
  }
}

export default IconSelector
