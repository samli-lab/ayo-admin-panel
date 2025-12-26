import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Typography,
  Button,
  Input,
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
import { Photo } from '@/types/gallery';
import { getPhotos, deletePhoto } from '@/services/galleryService';
import AppLayout from '@/components/AppLayout';
import './styles/GalleryList.css';

const { Text, Title } = Typography;

export default function GalleryListPage() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });

  // 加载照片列表
  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      if (searchKeyword) {
        params.search = searchKeyword;
      }
      const data = await getPhotos(params);
      setPhotos(data.photos);
      setPagination(data.pagination);
    } catch (error) {
      Toast.error('加载照片列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, searchKeyword]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 跳转到创建照片页面
  const handleCreate = () => {
    navigate('/blog/gallery/create');
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      await deletePhoto(id);
      Toast.success('照片已删除');
      loadPhotos();
    } catch (error) {
      Toast.error('删除照片失败');
      console.error(error);
    }
  };

  const columns = [
    {
      title: '照片',
      dataIndex: 'url',
      key: 'url',
      width: 150,
      render: (url: string, record: Photo) => (
        <Image
          src={url}
          width={120}
          height={80}
          style={{ borderRadius: '4px', objectFit: 'cover' }}
          preview={{
            src: url,
            mask: '预览',
          }}
        />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Photo) => (
        <Text
          link
          strong
          onClick={() => navigate(`/blog/gallery/${record.id}`)}
          style={{ fontSize: '14px' }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string | null) => (
        <Text type="secondary" ellipsis={{ showTooltip: true }}>
          {text || '-'}
        </Text>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (sortOrder: number) => sortOrder ?? 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('zh-CN');
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Photo) => (
        <Space>
          <Button
            icon={<IconEyeOpened />}
            theme="borderless"
            onClick={() => navigate(`/blog/gallery/${record.id}`)}
            title="查看"
          />
          <Button
            icon={<IconEdit />}
            theme="borderless"
            onClick={() => navigate(`/blog/gallery/edit/${record.id}`)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这张照片吗？"
            content="此操作不可逆，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
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
    <AppLayout headerTitle="相册管理 - 照片列表">
      <div className="gallery-list-container">
        <div className="gallery-list-header">
          <Title heading={3}>照片列表</Title>
          <Button
            icon={<IconPlus />}
            theme="solid"
            type="primary"
            onClick={handleCreate}
          >
            新增照片
          </Button>
        </div>

        <div className="gallery-list-filters">
          <Input
            placeholder="搜索照片标题或描述..."
            prefix={<IconSearch />}
            value={searchKeyword}
            onChange={(value: string) => setSearchKeyword(value)}
            onEnterPress={handleSearch}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={photos}
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
              description="暂无照片"
            />
          }
        />
      </div>
    </AppLayout>
  );
}

