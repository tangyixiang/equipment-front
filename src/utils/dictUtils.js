import { getDicts } from '@/api/system/dict/data'

/**
 * 转换成pro table 中的select数据
 *
 * @param {*} dictType  字典类型
 * @param {*} setDataSource setState 方法
 */
export async function transFormEditTableSelectData(dictType, setDataSource) {
  const opts = {}
  const res = await getDicts(dictType)
  if (res.code === 200) {
    res.data.forEach((item) => {
      opts[item.dictValue] = {
        text: item.dictLabel,
      }
    })
  }
  setDataSource(opts)
}

/**
 * 转换成普通的select数据
 * @param {*} dictType  字典类型
 * @param {*} setDataSource  setState 方法
 */
export async function transFormNormalSelectData(dictType, setDataSource) {
  const opts = {}
  const res = await getDicts(dictType)
  if (res.code === 200) {
    res.data.forEach((item) => {
      opts[item.dictValue] = item.dictLabel
    })
  }
  setDataSource(opts)
}

/**
 * options select 数据
 *
 * @param {*} dictType
 * @param {*} setDataSource
 */
export async function transFormEditTableOptions(dictType, setDataSource) {
  let opts = []
  let valueEnum = {}
  const res = await getDicts(dictType)
  if (res.code === 200) {
    opts = res.data.map((item) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }))
    res.data.forEach((item) => {
      valueEnum[item.dictValue] = {
        text: item.dictLabel,
      }
    })
  }
  setDataSource({ opts, valueEnum })
}
