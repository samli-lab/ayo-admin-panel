import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Space,
  Skeleton,
  Toast,
  Divider,
  Image,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconEdit,
  IconCalendar,
} from '@douyinfe/semi-icons';
import { getPhotoById } from '@/services/galleryService';
import { Photo } from '@/types/gallery';
import AppLayout from '@/components/AppLayout';
import './styles/GalleryDetail.css';

const { Title, Text, Paragraph } = Typography;

export default function GalleryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPhoto = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPhotoById(id);
      setPhoto(data);
    } catch (error) {
      Toast.error('照片不存在');
      navigate('/blog/gallery/list');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadPhoto();
  }, [loadPhoto]);

  const handleBack = () => {
    navigate('/blog/gallery/list');
  };

  const handleEdit = () => {
    if (photo) {
      navigate(`/blog/gallery/edit/${photo.id}`);
    }
  };

  if (loading) {
    return (
      <AppLayout headerTitle="照片详情">
        <div className="gallery-detail-container">
          <Skeleton placeholder={<Skeleton.Paragraph rows={10} />} loading={true}>
          </Skeleton>
        </div>
      </AppLayout>
    );
  }

  if (!photo) return null;

  return (
    <AppLayout headerTitle={`照片详情 - ${photo.title}`}>
      <div className="gallery-detail-container">
        <div className="gallery-detail-header">
          <Space vertical align="start" style={{ width: '100%' }}>
            <Button
              icon={<IconArrowLeft />}
              theme="borderless"
              onClick={handleBack}
            >
              返回列表
            </Button>
            
            <Title heading={1} style={{ margin: '16px 0' }}>{photo.title}</Title>
            
            <div className="gallery-detail-meta">
              <Space spacing="loose" wrap>
                {photo.sortOrder !== undefined && (
                  <Text type="secondary">
                    排序号: {photo.sortOrder}
                  </Text>
                )}
                {photo.createdAt && (
                  <Text type="secondary">
                    <IconCalendar /> {new Date(photo.createdAt).toLocaleString('zh-CN')}
                  </Text>
                )}
              </Space>
            </div>
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

        <div className="gallery-detail-image">
          <Image
            src={photo.url}
            alt={photo.title}
            preview={{
              src: photo.url,
              mask: '预览',
            }}
            style={{
              maxWidth: '100%',
              borderRadius: '8px',
            }}
          />
        </div>

        {photo.description && (
          <>
            <Divider style={{ margin: '24px 0' }} />
            <Paragraph className="gallery-detail-description">
              {photo.description}
            </Paragraph>
          </>
        )}
      </div>
    </AppLayout>
  );
}

