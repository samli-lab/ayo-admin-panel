import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Typography,
  Space,
  Divider,
  Toast,
} from "@douyinfe/semi-ui";
import {
  IconUser,
  IconLock,
  IconGithubLogo,
  IconHome,
} from "@douyinfe/semi-icons";
import { login } from "@/services/authService";
import "./styles/Login.css";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const result = await login({
        email: values.email || values.username, // 兼容 username 字段
        password: values.password,
      });

      // 保存 token（从 data.token.value 中获取）
      const tokenValue = result.token?.value || result.token;
      if (tokenValue) {
        localStorage.setItem("auth_token", tokenValue);
      }

      // 保存用户信息
      if (result.user) {
        localStorage.setItem("user_info", JSON.stringify(result.user));
      }

      Toast.success({
        content: "登录成功！",
        duration: 2,
      });

      // 处理重定向
      const redirect = searchParams.get("redirect");
      if (redirect) {
        navigate(decodeURIComponent(redirect), { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      Toast.error({
        content: error.message || "登录失败，请检查邮箱和密码",
        duration: 3,
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 背景动画层 */}
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </div>

      {/* 粒子效果背景 */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}></div>
        ))}
      </div>

      {/* 主要内容 */}
      <div className="login-content">
        {/* Logo 和标题区域 */}
        <div className="login-header">
          <div className="logo-container">
            <IconHome size="extra-large" className="logo-icon" />
            <div className="logo-glow"></div>
          </div>
          <Title heading={1} className="login-title">
            AI Story Flow
          </Title>
          <Text className="login-subtitle">
            智能流程可视化平台
          </Text>
        </div>

        {/* 登录卡片 */}
        <Card className="login-card" shadows="hover">
          <Form
            onSubmit={handleSubmit}
            style={{ width: "100%" }}
            initValues={{
              email: "",
              password: "",
              remember: false,
            }}
          >
            {() => (
              <>
                <Form.Input
                  field="email"
                  label="邮箱"
                  placeholder="请输入邮箱"
                  prefix={<IconUser />}
                  rules={[
                    { required: true, message: "请输入邮箱" },
                    { type: "email", message: "请输入有效的邮箱地址" },
                  ]}
                  style={{ marginBottom: 20 }}
                />

                <Form.Input
                  field="password"
                  label="密码"
                  type="password"
                  placeholder="请输入密码"
                  prefix={<IconLock />}
                  rules={[
                    { required: true, message: "请输入密码" },
                    { min: 6, message: "密码长度至少6位" },
                  ]}
                  style={{ marginBottom: 20 }}
                />

                <div className="login-options">
                  <Form.Checkbox field="remember" noLabel>
                    记住我
                  </Form.Checkbox>
                  <Button theme="borderless" type="tertiary" size="small">
                    忘记密码？
                  </Button>
                </div>

                <Button
                  type="primary"
                  theme="solid"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="login-button"
                >
                  登录
                </Button>

                <Divider margin={24}>或</Divider>

                <Space vertical spacing="loose" style={{ width: "100%" }}>
                  <Button
                    theme="borderless"
                    type="tertiary"
                    block
                    icon={<IconGithubLogo />}
                    className="social-button"
                  >
                    使用 GitHub 登录
                  </Button>
                  <Button
                    theme="borderless"
                    type="tertiary"
                    block
                    icon={<IconGithubLogo />}
                    className="social-button"
                  >
                    使用 Google 登录
                  </Button>
                </Space>

                <div className="login-footer">
                  <Text type="tertiary" size="small">
                    还没有账号？{" "}
                    <Button theme="borderless" type="primary" size="small">
                      立即注册
                    </Button>
                  </Text>
                </div>
              </>
            )}
          </Form>
        </Card>

        {/* 装饰性元素 */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;

