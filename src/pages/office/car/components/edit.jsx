import React, { useEffect } from 'react'
import OFormContent from '@/components/OForm/OFormContent'
import { Modal, Form, Input, Select, DatePicker, Upload, message } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import '../index.module.scss'
import { useState } from 'react'
import { getUploadUrl } from '@/utils/common'
import { getAccessToken } from '@/utils/access'

function formateDate(dateObj) {
  return dateObj ? moment(dateObj).format('YYYY-MM-DD') : undefined
}

function convertMoment(date, parttern) {
  return date ? moment(date, parttern) : date
}

function CarInfo(props) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])

  const { title, record, open, readOnly, onCancel } = props

  useEffect(() => {
    form.resetFields()
    record.buyInsuranceDate = convertMoment(
      record.buyInsuranceDate,
      'YYYY-MM-DD'
    )
    record.yearCheckDate = convertMoment(record.yearCheckDate, 'YYYY-MM-DD')
    record.buyDate = convertMoment(record.buyDate, 'YYYY-MM-DD')
    if (record.pictures) {
      const picturesList = record.pictures.map((item, index) => {
        return {
          uid: index,
          status: 'done',
          url: item,
        }
      })
      setFileList(picturesList)
    }

    form.setFieldsValue(record)
  }, [form, props])

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传
      </div>
    </div>
  )

  const onFinish = (values) => {
    values.buyInsuranceDate = formateDate(values.buyInsuranceDate)
    values.yearCheckDate = formateDate(values.yearCheckDate)
    values.buyDate = formateDate(values.buyDate)
    const { pictures } = values
    if (pictures && pictures.fileList) {
      values.pictures = pictures.fileList.map((item) =>
        item.response ? item.response.url : item.url
      )
    }

    const data = { id: record.id, ...values }
    // console.log('Success:', data)
    props.onSubmit(data)
  }

  const handleCancel = () => {
    onCancel(false)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('请上传上传JPG/PNG格式图片')
    }
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      message.error('图片大小超过10MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      if (file.response.code !== 200) {
        message.error(file.response.msg)
        setFileList(fileList.pop())
      }
    }
    console.log(fileList)
    setFileList(fileList)
  }

  const desc = [
    {
      name: 'plateNumber',
      label: '车牌号',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请输入车牌号!',
        },
      ],
    },
    {
      name: 'carType',
      label: '车辆类型',
      iptCell: (
        <Select>
          <Select.Option value="1">轿车</Select.Option>
          <Select.Option value="2">SUV</Select.Option>
          <Select.Option value="3">皮卡</Select.Option>
          <Select.Option value="4">MPV</Select.Option>
        </Select>
      ),
      rules: [
        {
          required: true,
          message: '请选择车辆类型!',
        },
      ],
    },
    {
      name: 'seater',
      label: '车座',
      iptCell: (
        <Select>
          <Select.Option value="1">5座</Select.Option>
          <Select.Option value="2">7座</Select.Option>
        </Select>
      ),
      rules: [
        {
          required: true,
          message: '请选择车座!',
        },
      ],
    },
    {
      name: 'brand',
      label: '车辆品牌',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请输入车辆品牌!',
        },
      ],
    },
    {
      name: 'newPercent',
      label: '新旧程度',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请输入新旧程度!',
        },
      ],
    },
    {
      name: 'color',
      label: '车身颜色',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'engineNum',
      label: '发动机号',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请输入发动机号!',
        },
      ],
    },
    {
      name: 'engineModel',
      label: '发动机型号',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'carModel',
      label: '车辆型号',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请输入车辆型号!',
        },
      ],
    },
    {
      name: 'bigCarNum',
      label: '大驾号',
      iptCell: <Input autoComplete="off" />,
      rules: [
        {
          required: true,
          message: '请输入大驾号!',
        },
      ],
    },
    {
      name: 'regCertNum',
      label: '登记证编号',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'licenseNum',
      label: '行驶证号',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'madeInChina',
      label: '国产/进口',
      iptCell: (
        <Select>
          <Select.Option value="1">国产</Select.Option>
          <Select.Option value="2">进口</Select.Option>
        </Select>
      ),
    },
    {
      name: 'parking',
      label: '车位',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'maxMileage',
      label: '最大里程',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'maxSpeed',
      label: '最高时速',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'energyType',
      label: '燃料类型',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'fuelConsumption',
      label: '油耗',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'initialKilometer',
      label: '初始公里数',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'lineName',
      label: '服务路线',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'buyInsuranceDate',
      label: '投保日期',
      iptCell: <DatePicker />,
    },
    {
      name: 'yearCheckDate',
      label: '年检日期',
      iptCell: <DatePicker />,
    },
    {
      name: 'chassisNum',
      label: '底盘号',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'factoryName',
      label: '制造厂名字',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'carLoad',
      label: '车辆负重',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'tireSpecifications',
      label: '轮胎规格',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'wheelbase',
      label: '轴距',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'buyDate',
      label: '购买日期',
      iptCell: <DatePicker />,
    },
    {
      name: 'price',
      label: '购买价格(万元)',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'saleStore',
      label: '购买处',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'responsibleName',
      label: '责任人姓名',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'responsiblePhone',
      label: '责任人电话',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'attachment',
      label: '附件',
      singleRow: 'true',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'remark',
      label: '备注',
      singleRow: 'true',
      iptCell: <Input autoComplete="off" />,
    },
    {
      name: 'pictures',
      label: '车辆图片',
      singleRow: 'true',
      iptCell: (
        <Upload
          action={getUploadUrl() + '/common/upload'}
          headers={{ Authorization: 'Bearer ' + getAccessToken() }}
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
      ),
    },
    {
      name: 'status',
      label: '状态',
      singleRow: 'true',
      iptCell: (
        <Select>
          <Select.Option value="1">正常</Select.Option>
          <Select.Option value="2">停用</Select.Option>
          <Select.Option value="3">报废</Select.Option>
        </Select>
      ),
    },
  ]

  return (
    <Modal
      forceRender
      title={title}
      width={'70%'}
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      destroyOnClose
      footer={readOnly ? null : undefined}
    >
      <Form form={form} onFinish={onFinish} disabled={readOnly}>
        <OFormContent formCellDesc={desc} />
      </Form>
    </Modal>
  )
}

export default CarInfo
