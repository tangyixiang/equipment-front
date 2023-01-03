import React from 'react'
import { Button, Upload, message } from 'antd'
import { getUploadUrl } from '@/utils/common'
import { getAccessToken } from '@/utils/access'
import { encode, decode } from 'js-base64'

const EditTableUpload = (props) => {
  const attachments = props.value
  const { onChange } = props

  const changeFile = ({ file, fileList }) => {
    if (file.status !== 'uploading') {
      const arr = []
      fileList.forEach((item) => {
        if (item.response) {
          // arr.push({
          //   key: item.uid,
          //   name: item.name,
          //   data: item.response?.url,
          // })
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
      message.error('文件大小超过10MB!')
    }
    return isLt2M
  }

  const handleDownload = (file) => {
    console.log(file)
    fetch(file.response.url, {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((response) => {
        response.blob().then((blob) => {
          const aLink = document.createElement('a')
          document.body.appendChild(aLink)
          aLink.style.display = 'none'
          aLink.href = window.URL.createObjectURL(blob)
          aLink.download = file.response.originalFilename
          aLink.click()
          document.body.removeChild(aLink)
        })
      })
      .catch((error) => {
        console.log(error)
        message.error('文件下载失败')
      })
  }

  const handlePreview = (file) => {
    window.open(
      process.env.REACT_APP_FILE_REVIEW +
        '/onlinePreview?url=' +
        encodeURIComponent(encode(file.response?.url))
    )
  }

  return (
    <Upload
      action={getUploadUrl() + '/common/upload'}
      headers={{ Authorization: 'Bearer ' + getAccessToken() }}
      onChange={changeFile}
      onDownload={handleDownload}
      onPreview={handlePreview}
      showUploadList={{ showPreviewIcon: true, showDownloadIcon: true }}
      beforeUpload={beforeUpload}
      defaultFileList={attachments}
    >
      <Button type="link">上传</Button>
    </Upload>
  )
}

export default EditTableUpload
