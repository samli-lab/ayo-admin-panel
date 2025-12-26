import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Form,
  Toast,
  Space,
  Image,
  Upload,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconSave,
  IconPlus,
} from '@douyinfe/semi-icons';
import { createPhoto } from '@/services/galleryService';
import { uploadFile } from '@/services/blogService';
import AppLayout from '@/components/AppLayout';
import './styles/CreateGallery.css';

const { Title } = Typography;

export default function CreateGalleryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formApi, setFormApi] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [photoFileList, setPhotoFileList] = useState<any[]>([]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (!values.url || !values.url.trim()) {
        Toast.warning('请上传照片或输入照片URL');
        return;
      }

      // 验证 URL 格式
      try {
        new URL(values.url);
      } catch {
        Toast.warning('请输入有效的URL格式');
        return;
      }

      await createPhoto({
        title: values.title,
        url: values.url,
        description: values.description || undefined,
        sortOrder: values.sortOrder ? Number(values.sortOrder) : undefined,
      });
      Toast.success('创建成功');
      navigate('/blog/gallery/list');
    } catch (error) {
      Toast.error('创建失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/blog/gallery/list');
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    if (formApi) {
      formApi.setValue('url', url);
    }
  };

  return (
    <AppLayout headerTitle="相册管理 - 新增照片">
      <div className="create-gallery-container">
        <div className="create-gallery-header">
          <Space>
            <Button
              icon={<IconArrowLeft />}
              theme="borderless"
              onClick={handleCancel}
            >
              返回
            </Button>
            <Title heading={3}>新增照片</Title>
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

          <Form.Slot label="照片">
            <Upload
              action="" // 不使用默认上传，使用自定义上传
              listType="picture"
              accept="image/*"
              fileList={photoFileList}
              limit={1}
              onFileChange={(files: any[]) => {
                // 确保上传成功后 url 被设置到 file 对象上，这样 Image 组件才能正确显示预览
                const updatedFiles = files.map(file => {
                  if (file.status === 'success' && file.response && !file.url) {
                    return { ...file, url: file.response.url };
                  }
                  return file;
                });
                setPhotoFileList(updatedFiles);
                if (files.length > 0 && files[0].status === 'success') {
                  const url = files[0].url || files[0].response?.url;
                  if (url) {
                    setPreviewUrl(url);
                    formApi.setValue('url', url);
                  }
                }
                if (files.length === 0) {
                  setPreviewUrl('');
                  formApi.setValue('url', '');
                }
              }}
              onRemove={() => {
                setPhotoFileList([]);
                setPreviewUrl('');
                formApi.setValue('url', '');
              }}
              renderThumbnail={(file: any) => {
                const url = file.url || file.response?.url;
                return (
                  <Image
                    src={url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                );
              }}
              customRequest={async ({ fileInstance, onSuccess, onError }: any) => {
                try {
                  const res = await uploadFile(fileInstance);
                  setPreviewUrl(res.url);
                  formApi.setValue('url', res.url);
                  onSuccess(res, fileInstance);
                } catch (error) {
                  Toast.error('上传图片失败');
                  onError(error);
                }
              }}
            >
              <IconPlus size="extra-large" />
            </Upload>
          </Form.Slot>

          <Form.Input
            field="url"
            label="照片URL"
            placeholder="上传图片后自动填充，也可手动输入"
            rules={[
              { required: true, message: '请上传照片或输入照片URL' },
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

