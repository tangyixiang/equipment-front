import React, { useEffect, useState } from 'react'
import { Row } from 'antd'
import OFormCell from './OFormCell'

/**
 * 将数据切分
 * @param {*} array 数据组
 * @param {*} subGroupLength 切分长度
 * @returns
 */
function splice(array, subGroupLength) {
  var index = 0
  var newArray = []

  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }

  return newArray
}

function OFormContent(props) {
  const { formCellDesc } = props

  const [renderContent, setRenderContent] = useState()

  const styles = 'border-[0.5px] border-solid border-gray-200 mt-[-0.5px]'

  useEffect(() => {
    const compentsArray = formCellDesc.map((item) => {
      return {
        singleRow: item.singleRow,
        name: item.name,
        compoents: (
          <OFormCell
            key={item.name}
            name={item.name}
            label={item.label}
            iptCell={item.iptCell}
            rules={item.rules}
            singleRow={item.singleRow}
          />
        ),
      }
    })
    const compentsGroupArray = splice(compentsArray, 2)

    const renderData = compentsGroupArray.map((item) => {
      let hasSingleRow = item.find((ele) => ele.singleRow == 'true')
      if (hasSingleRow) {
        return item.map((child) => (
          <Row key={'row' + child.name} className={styles}>
            {child.compoents}
          </Row>
        ))
      } else {
        const names = item.map((child) => child.name)
        return (
          <Row key={'row' + names.toString()} className={styles}>
            {item.map((child) => child.compoents)}
          </Row>
        )
      }
    })
    // console.log(renderData)
    setRenderContent(renderData)
  }, [props])

  return <>{renderContent}</>
}

export default OFormContent
