import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Form,
  Toast,
  Space,
  Upload,
  Image,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconSave,
  IconMaximize,
  IconMinimize,
  IconPlus,
} from '@douyinfe/semi-icons';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { Category, Tag as BlogTag } from '@/types/blog';
import { createPost, getCategories, getTags, uploadFile } from '@/services/blogService';
import AppLayout from '@/components/AppLayout';
import './styles/CreateBlog.css';

const { Title } = Typography;

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formApi, setFormApi] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [content, setContent] = useState('');
  const [coverFileList, setCoverFileList] = useState<any[]>([]);

  // 加载分类和标签
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('加载分类和标签失败:', error);
      }
    };
    loadData();
  }, []);

  // 专注模式下禁用页面滚动，退出时恢复
  useEffect(() => {
    if (!focusMode) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [focusMode]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (!content.trim()) {
        Toast.warning('请输入文章内容');
        return;
      }

      // 生成 slug（如果未提供）
      let slug = values.slug?.trim();
      if (!slug) {
        // 从标题生成 slug
        slug = values.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      await createPost({
        title: values.title,
        slug: slug,
        content: content,
        excerpt: values.excerpt,
        category: values.category,
        tags: values.tags && values.tags.length > 0 ? values.tags : undefined,
        imageUrl: values.imageUrl || undefined,
        createTime: values.createTime ? new Date(values.createTime).toISOString() : undefined,
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

  const toggleFocusMode = () => {
    setFocusMode(prev => !prev);
  };

  const handleUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    try {
      const res = await Promise.all(files.map(file => uploadFile(file)));
      callback(res.map(item => item.url));
    } catch (error) {
      Toast.error('上传图片失败');
      console.error(error);
    }
  };

  // 同步内容到 formApi（让保存/校验时也能拿到最新内容）
  useEffect(() => {
    if (!formApi) return;
    formApi.setValue?.('content', content);
  }, [formApi, content]);

  return (
    <AppLayout headerTitle="Blog管理 - 新增文章">
      <div className={focusMode ? "create-blog-container focus-mode-active" : "create-blog-container"}>
        <div className="create-blog-header">
          <Space>
            <Button
              icon={<IconArrowLeft />}
              theme="borderless"
              onClick={handleCancel}
            >
              返回
            </Button>
            <Title heading={3}>新增文章</Title>
          </Space>
          <Button
            icon={<IconMaximize />}
            theme="borderless"
            onClick={toggleFocusMode}
            title="专注模式"
          >
            专注模式
          </Button>
        </div>

        <Form
          getFormApi={(api: any) => setFormApi(api)}
          onSubmit={handleSubmit}
          className="create-blog-form"
        >
          <div className="create-blog-non-content">
            <Form.Input
              field="title"
              label="标题"
              placeholder="请输入文章标题"
              rules={[{ required: true, message: '请输入文章标题' }]}
              style={{ width: '100%' }}
            />

            <Form.Input
              field="slug"
              label="Slug（URL标识符）"
              placeholder="留空将自动从标题生成"
              style={{ width: '100%' }}
            />

            <Form.TextArea
              field="excerpt"
              label="摘要"
              placeholder="请输入文章摘要"
              autosize={{ minRows: 3, maxRows: 6 }}
              style={{ width: '100%' }}
            />

            <Form.Select
              field="category"
              label="分类"
              placeholder="请选择分类"
              rules={[{ required: true, message: '请选择分类' }]}
              style={{ width: '100%' }}
              optionList={categories.map((cat: any) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />

            <Form.Select
              field="tags"
              label="标签"
              placeholder="请选择标签（可多选）"
              multiple
              style={{ width: '100%' }}
              optionList={tags.map((tag: any) => ({
                label: tag.name,
                value: tag.id,
              }))}
            />

            <Form.DatePicker
              field="createTime"
              label="创建时间"
              placeholder="留空则使用当前时间"
              style={{ width: '100%' }}
              type="dateTime"
              format="yyyy-MM-dd HH:mm:ss"
            />

            <Form.Slot label="封面图片">
              <Upload
                action="" // 不使用默认上传，使用自定义上传
                listType="picture"
                accept="image/*"
                fileList={coverFileList}
                limit={1}
                onFileChange={(files: any[]) => {
                  // 确保上传成功后 url 被设置到 file 对象上，这样 Image 组件才能正确显示预览
                  const updatedFiles = files.map(file => {
                    if (file.status === 'success' && file.response && !file.url) {
                      return { ...file, url: file.response.url };
                    }
                    return file;
                  });
                  setCoverFileList(updatedFiles);
                  if (files.length === 0) {
                    formApi.setValue('imageUrl', '');
                  }
                }}
                onRemove={() => {
                  setCoverFileList([]);
                  formApi.setValue('imageUrl', '');
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
                    formApi.setValue('imageUrl', res.url);
                    onSuccess(res, fileInstance);
                  } catch (error) {
                    onError(error);
                  }
                }}
              >
                <IconPlus size="extra-large" />
              </Upload>
            </Form.Slot>

            <Form.Input
              field="imageUrl"
              label="封面图片URL"
              placeholder="上传图片后自动填充，也可手动输入"
              style={{ width: '100%' }}
            />
          </div>

          <div className="create-blog-content">
            {/* 专注模式工具栏（只在专注模式显示） */}
            <div className="focus-mode-toolbar">
              <Space>
                <Button
                  icon={<IconMinimize />}
                  theme="borderless"
                  onClick={toggleFocusMode}
                  title="退出专注模式"
                >
                  退出专注模式
                </Button>
                <Button
                  type="primary"
                  theme="solid"
                  onClick={() => formApi?.submit()}
                  loading={loading}
                  icon={<IconSave />}
                >
                  保存
                </Button>
              </Space>
            </div>

            {!focusMode && <div className="markdown-editor-label">内容（Markdown格式）</div>}
            <div className="markdown-editor-wrapper">
              <MdEditor
                modelValue={content}
                onChange={setContent}
                onUploadImg={handleUploadImg}
                placeholder="开始写作..."
                style={{ height: focusMode ? 'calc(100vh - 64px)' : '500px' }}
                toolbars={[
                  'bold',
                  'underline',
                  'italic',
                  '-',
                  'strikeThrough',
                  'title',
                  'sub',
                  'sup',
                  'quote',
                  'unorderedList',
                  'orderedList',
                  '-',
                  'codeRow',
                  'code',
                  'link',
                  'image',
                  'table',
                  'mermaid',
                  'katex',
                  '-',
                  'revoke',
                  'next',
                  'save',
                  '=',
                  'pageFullscreen',
                  'fullscreen',
                  'preview',
                  'htmlPreview',
                  'catalog',
                ]}
              />
            </div>

            {/* 进入专注模式按钮（正常模式展示在内容框右上角） */}
            {!focusMode && (
              <Button
                className="focus-mode-enter-btn"
                icon={<IconMaximize />}
                theme="borderless"
                onClick={toggleFocusMode}
                title="专注模式"
              />
            )}
          </div>

          <Form.Slot label=" " className="create-blog-actions">
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

