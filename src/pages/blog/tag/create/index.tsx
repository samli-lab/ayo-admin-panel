import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Form,
  Toast,
  Space,
  Input,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconSave,
} from '@douyinfe/semi-icons';
import { createTag } from '@/services/blogService';
import AppLayout from '@/components/AppLayout';
import './styles/CreateTag.css';

const { Text, Title } = Typography;

export default function CreateTagPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formApi, setFormApi] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await createTag({
        name: values.name.trim(),
      });
      Toast.success('创建成功');
      navigate('/blog/list');
    } catch (error) {
      Toast.error('创建失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/blog/list');
  };

  return (
    <AppLayout headerTitle="Blog管理 - 新增标签">
      <div className="create-tag-container">
        <div className="create-tag-header">
          <Button
            icon={<IconArrowLeft />}
            theme="borderless"
            onClick={handleCancel}
          >
            返回
          </Button>
          <Title heading={3}>新增标签</Title>
        </div>

        <Form
          getFormApi={(api) => setFormApi(api)}
          onSubmit={handleSubmit}
          className="create-tag-form"
        >
          <Form.Input
            field="name"
            label="标签名称"
            placeholder="请输入标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { min: 1, max: 20, message: '标签名称长度应在1-20个字符之间' },
            ]}
            style={{ width: '100%' }}
          />

          <Form.Slot label=" ">
            <Space>
              <Button
                type="primary"
                theme="solid"
                htmlType="submit"
                loading={loading}
                icon={<IconSave />}
              >
                保存
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Slot>
        </Form>
      </div>
    </AppLayout>
  );
}

