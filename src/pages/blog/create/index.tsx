import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Form,
  Toast,
  Space,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconSave,
  IconMaximize,
  IconMinimize,
} from '@douyinfe/semi-icons';
import { createPost, getCategories, getTags } from '@/services/blogService';
import AppLayout from '@/components/AppLayout';
import './styles/CreateBlog.css';

const { Title } = Typography;

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formApi, setFormApi] = useState<any>(null);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState(false);

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
        content: values.content,
        excerpt: values.excerpt,
        category: values.category,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        imageUrl: values.imageUrl || undefined,
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
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

  // 统一的Form组件
  const renderForm = () => (
    <Form
      getFormApi={(api) => setFormApi(api)}
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
        >
          {categories.map((cat) => (
            <Form.Select.Option key={cat.id} value={cat.name}>
              {cat.name}
            </Form.Select.Option>
          ))}
        </Form.Select>

        <Form.Select
          field="tags"
          label="标签"
          placeholder="请选择标签（可多选）"
          multiple
          style={{ width: '100%' }}
          onChange={(value) => setSelectedTags(value as string[])}
        >
          {tags.map((tag) => (
            <Form.Select.Option key={tag.id} value={tag.name}>
              {tag.name}
            </Form.Select.Option>
          ))}
        </Form.Select>

        <Form.Input
          field="imageUrl"
          label="封面图片URL"
          placeholder="请输入封面图片URL（可选）"
          style={{ width: '100%' }}
        />

        <Form.DatePicker
          field="date"
          label="发布日期"
          type="date"
          placeholder="选择发布日期（默认今天）"
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

        <Form.TextArea
          field="content"
          label="内容（Markdown格式）"
          placeholder="请输入文章内容，支持Markdown格式"
          autosize={{ minRows: 15, maxRows: 30 }}
          rules={[{ required: true, message: '请输入文章内容' }]}
          style={{ width: '100%' }}
        />

        {/* 进入专注模式按钮（正常模式展示在内容框右上角） */}
        <Button
          className="focus-mode-enter-btn"
          icon={<IconMaximize />}
          theme="borderless"
          onClick={toggleFocusMode}
          title="专注模式"
        />
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
  );

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
        {renderForm()}
      </div>
    </AppLayout>
  );
}

