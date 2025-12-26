import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Nav,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
} from '@douyinfe/semi-ui';
import {
  IconHome,
  IconEdit,
  IconSetting,
  IconExit,
  IconUser,
  IconSidebar,
  IconPlay,
  IconFile,
  IconList,
  IconPlus,
  IconImage,
} from '@douyinfe/semi-icons';
import { IconTag } from '@douyinfe/semi-icons-lab';
import './AppLayout.css';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

// localStorage 键名
const SIDEBAR_COLLAPSED_KEY = 'app-sidebar-collapsed';

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
  headerExtra?: ReactNode;
}

export default function AppLayout({
  children,
  showHeader = true,
  headerTitle = 'AI Story Flow',
  headerExtra,
}: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 localStorage 读取初始状态，如果没有则默认为 true
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  // 当折叠状态改变时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const navItems = [
    {
      itemKey: '/dashboard',
      text: '首页',
      icon: <IconHome />,
    },
    {
      itemKey: '/scripts',
      text: '剧本管理',
      icon: <IconEdit />,
    },
    {
      itemKey: '/videos',
      text: '视频管理',
      icon: <IconPlay />,
    },
    {
      itemKey: '/tags',
      text: '标签管理',
      icon: <IconTag />,
    },
    {
      itemKey: '/blog',
      text: 'Blog管理',
      icon: <IconFile />,
      items: [
        {
          itemKey: '/blog/list',
          text: '列表',
          icon: <IconList />,
        },
        {
          itemKey: '/blog/create',
          text: '新增文章',
          icon: <IconPlus />,
        },
        {
          itemKey: '/blog/category',
          text: '分类管理',
          icon: <IconList />,
        },
        {
          itemKey: '/blog/tag',
          text: '标签管理',
          icon: <IconTag />,
        },
        {
          itemKey: '/blog/gallery/list',
          text: '相册管理',
          icon: <IconImage />,
        },
      ],
    },
  ];

  const handleNavSelect = (itemKey: string) => {
    navigate(itemKey);
  };

  // 根据当前路径确定选中的导航项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') return '/dashboard';
    if (path.startsWith('/script/')) return '/scripts';
    if (path === '/scripts') return '/scripts';
    if (path === '/videos') return '/videos';
    if (path === '/tags') return '/tags';
    if (path.startsWith('/blog')) {
      // 如果是 blog 相关路径，返回具体的子菜单项
      if (path === '/blog/list' || path === '/blog') return '/blog/list';
      if (path === '/blog/create') return '/blog/create';
      if (path === '/blog/category') return '/blog/category';
      if (path === '/blog/tag') return '/blog/tag';
      if (path.startsWith('/blog/gallery')) return '/blog/gallery/list';
      return '/blog/list'; // 默认返回列表
    }
    return path;
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        style={{
          backgroundColor: 'var(--semi-color-bg-1)',
          width: isCollapsed ? 60 : 240,
        }}
        {...({ collapsible: true, onCollapse: (collapsed: boolean) => setIsCollapsed(collapsed) } as any)}
      >
        <div className="app-layout-logo" style={{ borderRight: '1px solid var(--semi-color-border)' }}>
          {!isCollapsed && (
            <Space spacing="loose">
              <IconHome size="large" style={{ color: 'var(--semi-color-primary)' }} />
              <Text strong>AI Story Flow</Text>
            </Space>
          )}
          {isCollapsed && (
            <IconHome size="large" style={{ color: 'var(--semi-color-primary)' }} />
          )}
        </div>
        <Nav
          className="app-layout-nav"
          style={{ height: 'calc(100vh - 72px)' }}
          items={navItems}
          selectedKeys={[getSelectedKey()]}
          onSelect={({ itemKey }) => handleNavSelect(itemKey as string)}
          isCollapsed={isCollapsed}
        />
      </Sider>
      <Layout>
        {showHeader && (
          <Header
            style={{
              backgroundColor: 'var(--semi-color-bg-0)',
              borderBottom: '1px solid var(--semi-color-border)',
              padding: '0 32px',
              height: 72,
              minHeight: 72,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Space spacing="loose">
                <Button
                  icon={<IconSidebar />}
                  theme="borderless"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                />
                <Text strong size="normal">
                  {headerTitle}
                </Text>
              </Space>
              <Space spacing="loose">
                {headerExtra}
                <Dropdown
                  trigger="click"
                  position="bottomRight"
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item icon={<IconSetting />}>
                        个人设置
                      </Dropdown.Item>
                      <Dropdown.Item
                        icon={<IconExit />}
                        onClick={() => {
                          navigate('/login');
                        }}
                      >
                        退出登录
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                >
                  <Space
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                    }}
                    className="user-info-trigger"
                  >
                    <Avatar
                      size="small"
                      color="blue"
                      style={{ backgroundColor: 'var(--semi-color-primary)' }}
                    >
                      <IconUser />
                    </Avatar>
                    <Text strong>用户名</Text>
                  </Space>
                </Dropdown>
              </Space>
            </div>
          </Header>
        )}
        <Content
          style={{
            backgroundColor: 'var(--semi-color-bg-0)',
            padding: showHeader ? 0 : 0,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

