import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Space,
  Tag,
  Skeleton,
  Toast,
  Divider,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconCalendar,
  IconFolder,
  IconUser,
  IconEdit,
} from '@douyinfe/semi-icons';
import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import { getPostBySlug } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import AppLayout from '@/components/AppLayout';
import './styles/BlogDetail.css';

const { Title, Text, Paragraph } = Typography;

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPost = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await getPostBySlug(slug);
      if (data) {
        setPost(data);
      } else {
        Toast.error('文章不存在');
        navigate('/blog/list');
      }
    } catch (error) {
      Toast.error('加载文章详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleBack = () => {
    navigate('/blog/list');
  };

  const handleEdit = () => {
    // 假设有编辑页面，暂时预留
    if (post) {
      navigate(`/blog/edit/${post.slug}`);
    }
  };

  if (loading) {
    return (
      <AppLayout headerTitle="文章详情">
        <div className="blog-detail-container">
          <Skeleton placeholder={<Skeleton.Paragraph rows={10} />} loading={true}>
          </Skeleton>
        </div>
      </AppLayout>
    );
  }

  if (!post) return null;

  return (
    <AppLayout headerTitle={`文章详情 - ${post.title}`}>
      <div className="blog-detail-container">
        <div className="blog-detail-header">
          <Space vertical align="start" style={{ width: '100%' }}>
            <Button
              icon={<IconArrowLeft />}
              theme="borderless"
              onClick={handleBack}
            >
              返回列表
            </Button>
            
            <Title heading={1} style={{ margin: '16px 0' }}>{post.title}</Title>
            
            <div className="blog-detail-meta">
              <Space spacing="loose" wrap>
                <Text type="secondary">
                  <IconCalendar /> {post.date}
                </Text>
                <Text type="secondary">
                  <IconFolder /> {typeof post.category === 'string' ? post.category : post.category.name}
                </Text>
                {post.author && (
                  <Text type="secondary">
                    <IconUser /> {post.author.name}
                  </Text>
                )}
              </Space>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="blog-detail-tags" style={{ marginTop: 8 }}>
                <Space>
                  {post.tags.map((tag: any, index: number) => (
                    <Tag key={index} color="blue" type="light">
                      {typeof tag === 'string' ? tag : tag.name}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </Space>
          
          <Button
            icon={<IconEdit />}
            theme="light"
            onClick={handleEdit}
            style={{ position: 'absolute', right: 24, top: 24 }}
          >
            编辑
          </Button>
        </div>

        <Divider style={{ margin: '24px 0' }} />

        {post.imageUrl && (
          <div className="blog-detail-cover">
            <img src={post.imageUrl} alt={post.title} />
          </div>
        )}

        {post.excerpt && (
          <Paragraph className="blog-detail-excerpt">
            {post.excerpt}
          </Paragraph>
        )}

        <div className="blog-detail-content">
          <MdPreview modelValue={post.content} />
        </div>
      </div>
    </AppLayout>
  );
}

