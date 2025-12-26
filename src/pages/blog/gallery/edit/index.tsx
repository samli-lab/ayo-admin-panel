import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Typography,
  Form,
  Toast,
  Space,
  Spin,
  Image,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconSave,
} from '@douyinfe/semi-icons';
import { updatePhoto, getPhotoById } from '@/services/galleryService';
import { Photo } from '@/types/gallery';
import AppLayout from '@/components/AppLayout';
import '../create/styles/CreateGallery.css';

const { Title } = Typography;

export default function EditGalleryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formApi, setFormApi] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // 加载初始数据
  const loadData = useCallback(async () => {
    if (!id) return;
    setFetching(true);
    try {
      const photo = await getPhotoById(id);
      setPreviewUrl(photo.url);
      
      // 延迟一下确保 formApi 已就绪
      setTimeout(() => {
        formApi?.setValues({
          title: photo.title,
          url: photo.url,
          description: photo.description || '',
          sortOrder: photo.sortOrder ?? 0,
        });
      }, 100);
    } catch (error) {
      console.error('加载数据失败:', error);
      Toast.error('加载数据失败');
      navigate('/blog/gallery/list');
    } finally {
      setFetching(false);
    }
  }, [id, formApi, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    setLoading(true);
    try {
      if (!values.url || !values.url.trim()) {
        Toast.warning('请输入照片URL');
        return;
      }

      // 验证 URL 格式
      try {
        new URL(values.url);
      } catch {
        Toast.warning('请输入有效的URL格式');
        return;
      }

      await updatePhoto(id, {
        title: values.title,
        url: values.url,
        description: values.description || undefined,
        sortOrder: values.sortOrder ? Number(values.sortOrder) : undefined,
      });
      Toast.success('更新成功');
      navigate(`/blog/gallery/${id}`);
    } catch (error) {
      Toast.error('更新失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    if (formApi) {
      formApi.setValue('url', url);
    }
  };

  return (
    <AppLayout headerTitle={`编辑照片 - ${id}`}>
      <Spin spinning={fetching}>
        <div className="create-gallery-container">
          <div className="create-gallery-header">
            <Space>
              <Button
                icon={<IconArrowLeft />}
                theme="borderless"
                onClick={handleCancel}
              >
                取消
              </Button>
              <Title heading={3}>编辑照片</Title>
            </Space>
          </div>

          <Form
            getFormApi={(api: any) => setFormApi(api)}
            onSubmit={handleSubmit}
            className="create-gallery-form"
          >
            <Form.Input
              field="title"
              label="标题"
              placeholder="请输入照片标题"
              rules={[{ required: true, message: '请输入照片标题' }]}
              style={{ width: '100%' }}
            />

            <Form.Input
              field="url"
              label="照片URL"
              placeholder="请输入照片URL（必须是有效的URL）"
              rules={[
                { required: true, message: '请输入照片URL' },
                {
                  validator: (rule: any, value: string) => {
                    if (!value) return Promise.resolve();
                    try {
                      new URL(value);
                      return Promise.resolve();
                    } catch {
                      return Promise.reject('请输入有效的URL格式');
                    }
                  },
                },
              ]}
              style={{ width: '100%' }}
              onChange={(value: string) => handleUrlChange(value)}
            />

            {previewUrl && (
              <Form.Slot label="预览">
                <Image
                  src={previewUrl}
                  width={400}
                  height={300}
                  style={{ borderRadius: '4px', objectFit: 'contain' }}
                  preview={{
                    src: previewUrl,
                    mask: '预览',
                  }}
                />
              </Form.Slot>
            )}

            <Form.TextArea
              field="description"
              label="描述"
              placeholder="请输入照片描述（可选）"
              autosize={{ minRows: 3, maxRows: 6 }}
              style={{ width: '100%' }}
            />

            <Form.InputNumber
              field="sortOrder"
              label="排序号"
              placeholder="排序号（数字越小越靠前，默认为0）"
              style={{ width: '100%' }}
              min={0}
            />

            <Form.Slot label=" " className="create-gallery-actions">
              <Space>
                <Button
                  type="primary"
                  theme="solid"
                  htmlType="submit"
                  loading={loading}
                  icon={<IconSave />}
                >
                  保存更改
                </Button>
                <Button onClick={handleCancel}>取消</Button>
              </Space>
            </Form.Slot>
          </Form>
        </div>
      </Spin>
    </AppLayout>
  );
}

