import React, { useEffect, useState } from 'react'
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-form'
import { Row, Col } from 'antd'
import Extension from './Extension'
import {
  transFormEditTableSelectData,
  transFormEditTableOptions,
} from '@/utils/dictUtils'
import { listPost } from '@/api/system/post'
import { getDeptTreeList } from '@/api/system/dept'

function FromContent(props) {
  const [inspectionOpt, setInspectionOpt] = useState({})
  const [dimensionKeyOpt, setDimensionKeyOpt] = useState({})

  useEffect(() => {
    transFormEditTableSelectData('inspection_dict', setInspectionOpt)
    transFormEditTableOptions('user_extension_dict_type', setDimensionKeyOpt)
  }, [])

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24} order={1}>
          <ProFormText
            name="userCode"
            label={'职员编号'}
            labelCol={{ span: 2 }}
            placeholder="请输入职员编号"
            rules={[
              {
                required: true,
                message: '请输入职员编号！',
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12} order={1}>
          <ProFormText
            name="nickName"
            label={'职员名称'}
            labelCol={{ span: 4 }}
            placeholder="请输入职员名称"
            rules={[
              {
                required: true,
                message: '请输入职员名称！',
              },
            ]}
          />
        </Col>
        <Col span={12} order={2}>
          <ProFormTreeSelect
            name="deptId"
            label={'职员部门'}
            labelCol={{ span: 4 }}
            request={async () => {
              const res = await getDeptTreeList({})
              return res
            }}
            placeholder="请输入职员部门"
            rules={[
              {
                required: true,
                message: '请输入职员部门！',
              },
            ]}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12} order={1}>
          <ProFormSelect
            name="postId"
            // mode="multiple"
            label={'职员岗位'}
            labelCol={{ span: 4 }}
            request={async () => {
              const res = await listPost()
              return res.rows.map((item) => ({
                value: item.postId,
                label: item.postName,
              }))
            }}
            placeholder="请选择职员岗位"
            rules={[{ required: true, message: '请选择职员岗位!' }]}
          />
        </Col>
        <Col span={12} order={2}>
          <ProFormSelect
            name="roleId"
            mode="multiple"
            label={'职员职务'}
            labelCol={{ span: 4 }}
            options={null}
            placeholder="请选择职员职务"
            rules={[{ required: false, message: '请选择职员职务!' }]}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12} order={1}>
          <ProFormSelect
            name="hireType"
            label={'人员性质'}
            labelCol={{ span: 4 }}
            options={[
              {
                value: '1',
                label: '在编',
              },
              {
                value: '2',
                label: '聘用',
              },
            ]}
            placeholder="请选择人员性质"
            rules={[{ required: true, message: '请选择人员性质!' }]}
          />
        </Col>
        <Col span={12} order={1}>
          <ProFormSelect
            name="status"
            label={'职员状态'}
            labelCol={{ span: 4 }}
            options={[
              {
                value: '0',
                label: '启用',
              },
              {
                value: '1',
                label: '禁用',
              },
            ]}
            placeholder="请选择职员状态"
            rules={[{ required: true, message: '请选择职员状态!' }]}
          />
        </Col>
      </Row>
      <Extension
        inspectionOpt={inspectionOpt}
        dimensionKeyOpt={dimensionKeyOpt}
        formRef={props.formRef}
      />
    </>
  )
}

export default FromContent