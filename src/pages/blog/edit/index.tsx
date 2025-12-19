import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Typography,
  Form,
  Toast,
  Space,
  Spin,
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
import { updatePost, getPostBySlug, getCategories, getTags, uploadFile } from '@/services/blogService';
import { BlogPost, Category, Tag as BlogTag } from '@/types/blog';
import AppLayout from '@/components/AppLayout';
import '../create/styles/CreateBlog.css'; // 复用创建页面的样式

const { Title } = Typography;

export default function BlogEditPage() {
  const { slug: originalSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formApi, setFormApi] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [content, setContent] = useState('');
  const [coverFileList, setCoverFileList] = useState<any[]>([]);

  // 加载初始数据
  const loadData = useCallback(async () => {
    if (!originalSlug) return;
    setFetching(true);
    try {
      const [categoriesData, tagsData, postData] = await Promise.all([
        getCategories(),
        getTags(),
        getPostBySlug(originalSlug),
      ]);

      setCategories(categoriesData);
      setTags(tagsData);

      if (postData) {
        setContent(postData.content);

        // 获取标签 ID
        const tagIds = (postData.tags || []).map((tag: any) => tag.id);

        // 获取分类 ID
        const categoryId = typeof postData.category === 'object' ? postData.category.id : postData.category;

        // 设置封面图列表
        if (postData.imageUrl) {
          setCoverFileList([{
            url: postData.imageUrl,
            name: '封面图片',
            status: 'success',
            uid: '1',
          }]);
        }

        // 延迟一下确保 formApi 已就绪
        setTimeout(() => {
          formApi?.setValues({
            title: postData.title,
            slug: postData.slug,
            excerpt: postData.excerpt,
            category: categoryId,
            imageUrl: postData.imageUrl,
            tags: tagIds,
          });
        }, 100);
      } else {
        Toast.error('文章不存在');
        navigate('/blog/list');
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      Toast.error('加载数据失败');
    } finally {
      setFetching(false);
    }
  }, [originalSlug, formApi, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 专注模式下禁用页面滚动
  useEffect(() => {
    if (!focusMode) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [focusMode]);

  const handleSubmit = async (values: any) => {
    if (!originalSlug) return;
    setLoading(true);
    try {
      if (!content.trim()) {
        Toast.warning('请输入文章内容');
        return;
      }

      await updatePost(originalSlug, {
        title: values.title,
        slug: values.slug,
        content: content,
        excerpt: values.excerpt,
        category: values.category,
        tags: values.tags && values.tags.length > 0 ? values.tags : undefined,
        imageUrl: values.imageUrl || undefined,
      });
      Toast.success('更新成功');
      navigate(`/blog/posts/${values.slug || originalSlug}`);
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

  return (
    <AppLayout headerTitle={`编辑文章 - ${originalSlug}`}>
      <Spin spinning={fetching}>
        <div className={focusMode ? "create-blog-container focus-mode-active" : "create-blog-container"}>
          <div className="create-blog-header">
            <Space>
              <Button
                icon={<IconArrowLeft />}
                theme="borderless"
                onClick={handleCancel}
              >
                取消
              </Button>
              <Title heading={3}>编辑文章</Title>
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
                placeholder="URL标识符"
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

            <Form.Slot label="封面图片">
              <Upload
                action=""
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
                    更新
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
                />
              </div>

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
