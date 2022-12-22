import React from 'react'
import { Button, Upload, message } from 'antd'
import { getUploadUrl } from '@/utils/common'
import { getAccessToken } from '@/utils/access'

const EditTableUpload = (props) => {
  const attachments = props.value
  const { onChange } = props

  const changeFile = ({ file, fileList }) => {
    if (file.status !== 'uploading') {
      // console.log(file, fileList)
      const arr = []
      fileList.forEach((item) => {
        if (item.response) {
          arr.push({
            name: item.name,
            id: item.response.data,
          })
        } else {
          arr.push(item)
        }
      })
      onChange(arr)
    }
  }

  const beforeUpload = (file) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    // if (!isJpgOrPng) {
    //   message.error('请上传上传JPG/PNG格式图片')
    // }
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      message.error('图片大小超过10MB!')
    }
    return isLt2M
  }

  return (
    <Upload
      action={getUploadUrl() + '/common/upload'}
      headers={{ Authorization: 'Bearer ' + getAccessToken() }}
      onChange={changeFile}
      beforeUpload={beforeUpload}
      defaultFileList={attachments}
    >
      <Button type="link">上传</Button>
    </Upload>
  )
}

export default EditTableUpload
