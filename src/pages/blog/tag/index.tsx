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
import { Tag } from '@/types/blog';
import { getTags, createTag, updateTag, deleteTag } from '@/services/blogService';
import AppLayout from '@/components/AppLayout';
import './styles/TagList.css';

const { Title } = Typography;

export default function TagManagementPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formApi, setFormApi] = useState<any>(null);

  const loadTags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      Toast.error('加载标签失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleAdd = () => {
    setEditingTag(null);
    setModalVisible(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setModalVisible(true);
  };

  const handleDelete = (tag: Tag) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除标签 "${tag.name}" 吗？此操作无法撤销。`,
      onOk: async () => {
        try {
          await deleteTag(tag.id);
          Toast.success('删除成功');
          loadTags();
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
      if (editingTag) {
        await updateTag(editingTag.id, values);
        Toast.success('更新成功');
      } else {
        await createTag(values);
        Toast.success('创建成功');
      }
      setModalVisible(false);
      loadTags();
    } catch (error) {
      Toast.error(editingTag ? '更新失败' : '创建失败');
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
      title: '引用次数',
      dataIndex: 'count',
      key: 'count',
      render: (text: number) => text || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Tag) => (
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
    <AppLayout headerTitle="Blog管理 - 标签管理">
      <div className="tag-list-container">
        <div className="tag-list-header">
          <Title heading={3}>标签管理</Title>
          <Button
            icon={<IconPlus />}
            theme="solid"
            type="primary"
            onClick={handleAdd}
          >
            新增标签
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={tags}
            pagination={false}
            rowKey="id"
          />
        </Spin>

        <Modal
          title={editingTag ? '编辑标签' : '新增标签'}
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          centered
        >
          <Form
            getFormApi={(api: any) => setFormApi(api)}
            initValues={editingTag || {}}
            style={{ width: '100%' }}
          >
            <Form.Input
              field="name"
              label="标签名称"
              placeholder="请输入标签名称"
              rules={[{ required: true, message: '请输入标签名称' }]}
            />
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}

