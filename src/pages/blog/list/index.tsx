import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Typography,
  Button,
  Input,
  Tag,
  Pagination,
  Select,
  Empty,
  Spin,
  Toast,
  Space,
} from '@douyinfe/semi-ui';
import {
  IconPlus,
  IconSearch,
  IconCalendar,
  IconFolder,
  IconEyeOpened,
} from '@douyinfe/semi-icons';
import { useNavigate } from 'react-router-dom';
import { PostListItem } from '@/types/blog';
import { getPosts, getCategories, getTags } from '@/services/blogService';
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
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: number; name: string }>>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
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

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
            onChange={(value) => setSearchKeyword(value)}
            onEnterPress={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="选择分类"
            value={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value as string);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            style={{ width: 200 }}
            allowClear
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.name}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="选择标签"
            value={selectedTag}
            onChange={(value) => {
              setSelectedTag(value as string);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            style={{ width: 200 }}
            allowClear
          >
            {tags.map((tag) => (
              <Select.Option key={tag.id} value={tag.name}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Spin spinning={loading}>
          {posts.length === 0 ? (
            <Empty
              description="暂无文章"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className="blog-list-content">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="blog-post-card"
                  hoverable
                  onClick={() => navigate(`/blog/posts/${post.slug}`)}
                >
                  <div className="blog-post-card-content">
                    {post.imageUrl && (
                      <div className="blog-post-image">
                        <img src={post.imageUrl} alt={post.title} />
                      </div>
                    )}
                    <div className="blog-post-info">
                      <Title heading={4} className="blog-post-title">
                        {post.title}
                      </Title>
                      <Text className="blog-post-excerpt">{post.excerpt}</Text>
                      <div className="blog-post-meta">
                        <Space>
                          <Text type="secondary">
                            <IconCalendar /> {formatDate(post.date)}
                          </Text>
                          <Text type="secondary">
                            <IconFolder /> {post.category}
                          </Text>
                          {post.readTime && (
                            <Text type="secondary">
                              <IconEyeOpened /> {post.readTime}
                            </Text>
                          )}
                        </Space>
                        {post.tags && post.tags.length > 0 && (
                          <div className="blog-post-tags">
                            {post.tags.map((tag, index) => (
                              <Tag key={index} size="small">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Spin>

        {pagination.totalPages > 1 && (
          <div className="blog-list-pagination">
            <Pagination
              currentPage={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onPageChange={(page) =>
                setPagination(prev => ({ ...prev, page }))
              }
              showTotal
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

