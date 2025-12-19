import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Typography,
  Button,
  Input,
  Tag,
  Select,
  Empty,
  Toast,
  Space,
  Popconfirm,
  Image,
} from '@douyinfe/semi-ui';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconDelete,
  IconEyeOpened,
} from '@douyinfe/semi-icons';
import { useNavigate } from 'react-router-dom';
import { PostListItem, Category, Tag as BlogTag } from '@/types/blog';
import { getPosts, getCategories, getTags, deletePost } from '@/services/blogService';
import AppLayout from '@/components/AppLayout';
import './styles/BlogList.css';

const { Text, Title } = Typography;

export default function BlogListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // 加载文章列表
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      if (searchKeyword) {
        params.search = searchKeyword;
      }
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      if (selectedTag) {
        params.tag = selectedTag;
      }
      const data = await getPosts(params);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      Toast.error('加载文章列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, searchKeyword, selectedCategory, selectedTag]);

  // 加载分类和标签
  const loadCategoriesAndTags = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    loadCategoriesAndTags();
  }, [loadCategoriesAndTags]);

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 跳转到创建文章页面
  const handleCreate = () => {
    navigate('/blog/create');
  };

  // 处理删除
  const handleDelete = async (slug: string) => {
    try {
      await deletePost(slug);
      Toast.success('文章已删除');
      loadPosts();
    } catch (error) {
      Toast.error('删除文章失败');
      console.error(error);
    }
  };

  const columns = [
    {
      title: '封面',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (_: any, record: PostListItem) => (
        record.imageUrl ? (
          <Image
            src={record.imageUrl}
            width={80}
            height={50}
            style={{ borderRadius: '4px', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 80,
            height: 50,
            backgroundColor: 'var(--semi-color-fill-0)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'var(--semi-color-text-2)'
          }}>无封面</div>
        )
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: PostListItem) => (
        <Text
          link
          strong
          onClick={() => navigate(`/blog/posts/${record.slug}`)}
          style={{ fontSize: '14px' }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: any) => (
        <Tag color="blue" type="light">
          {category?.name || '-'}
        </Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: any[]) => (
        <Space wrap>
          {tags?.map((tag: any) => (
            <Tag key={tag.id} size="small" color="cyan" type="light">
              {tag.name}
            </Tag>
          )) || '-'}
        </Space>
      ),
    },
    {
      title: '发布日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: PostListItem) => (
        <Space>
          <Button
            icon={<IconEyeOpened />}
            theme="borderless"
            onClick={() => navigate(`/blog/posts/${record.slug}`)}
            title="查看"
          />
          <Button
            icon={<IconEdit />}
            theme="borderless"
            onClick={() => navigate(`/blog/edit/${record.slug}`)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这篇文章吗？"
            content="此操作不可逆，请谨慎操作。"
            onConfirm={() => handleDelete(record.slug)}
          >
            <Button
              icon={<IconDelete />}
              theme="borderless"
              type="danger"
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout headerTitle="Blog管理 - 列表">
      <div className="blog-list-container">
        <div className="blog-list-header">
          <Title heading={3}>文章列表</Title>
          <Button
            icon={<IconPlus />}
            theme="solid"
            type="primary"
            onClick={handleCreate}
          >
            新增文章
          </Button>
        </div>

        <div className="blog-list-filters">
          <Input
            placeholder="搜索文章..."
            prefix={<IconSearch />}
            value={searchKeyword}
            onChange={(value: string) => setSearchKeyword(value)}
            onEnterPress={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="选择分类"
            value={selectedCategory}
            onChange={(value: any) => {
              setSelectedCategory(value as string);
              setPagination((prev: any) => ({ ...prev, page: 1 }));
            }}
            style={{ width: 200 }}
            allowClear
          >
            {categories.map((cat: any) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="选择标签"
            value={selectedTag}
            onChange={(value: any) => {
              setSelectedTag(value as string);
              setPagination((prev: any) => ({ ...prev, page: 1 }));
            }}
            style={{ width: 200 }}
            allowClear
          >
            {tags.map((tag: any) => (
              <Select.Option key={tag.id} value={tag.name}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={posts}
          loading={loading}
          pagination={{
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onPageChange: (page: number) => setPagination((prev: any) => ({ ...prev, page })),
            showTotal: true,
          }}
          rowKey="id"
          empty={
            <Empty
              description="暂无文章"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          }
        />
      </div>
    </AppLayout>
  );
}
