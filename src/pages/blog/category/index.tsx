import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Toast,
  Spin,
} from '@douyinfe/semi-ui';
import {
  IconPlus,
  IconEdit,
  IconDelete,
} from '@douyinfe/semi-icons';
import { Category } from '@/types/blog';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/blogService';
import AppLayout from '@/components/AppLayout';
import './styles/CategoryList.css';

const { Title } = Typography;

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formApi, setFormApi] = useState<any>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      Toast.error('加载分类失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAdd = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleDelete = (category: Category) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分类 "${category.name}" 吗？此操作无法撤销。`,
      onOk: async () => {
        try {
          await deleteCategory(category.id);
          Toast.success('删除成功');
          loadCategories();
        } catch (error) {
          Toast.error('删除失败');
          console.error(error);
        }
      },
    });
  };

  const handleModalOk = async () => {
    const values = await formApi.validate();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        Toast.success('更新成功');
      } else {
        await createCategory(values);
        Toast.success('创建成功');
      }
      setModalVisible(false);
      loadCategories();
    } catch (error) {
      Toast.error(editingCategory ? '更新失败' : '创建失败');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: '文章数量',
      dataIndex: 'count',
      key: 'count',
      render: (text: number) => text || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Category) => (
        <Space>
          <Button
            icon={<IconEdit />}
            theme="borderless"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<IconDelete />}
            theme="borderless"
            type="danger"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <AppLayout headerTitle="Blog管理 - 分类管理">
      <div className="category-list-container">
        <div className="category-list-header">
          <Title heading={3}>分类管理</Title>
          <Button
            icon={<IconPlus />}
            theme="solid"
            type="primary"
            onClick={handleAdd}
          >
            新增分类
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={categories}
            pagination={false}
            rowKey="id"
          />
        </Spin>

        <Modal
          title={editingCategory ? '编辑分类' : '新增分类'}
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          centered
        >
          <Form
            getFormApi={(api: any) => setFormApi(api)}
            initValues={editingCategory || {}}
            style={{ width: '100%' }}
          >
            <Form.Input
              field="name"
              label="分类名称"
              placeholder="请输入分类名称"
              rules={[{ required: true, message: '请输入分类名称' }]}
            />
            <Form.TextArea
              field="description"
              label="描述"
              placeholder="请输入分类描述"
              autosize={{ minRows: 2, maxRows: 4 }}
            />
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}

