import React, { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Upload,
  Image,
  Typography,
  Divider,
  Toast,
  Spin,
  Empty,
} from '@douyinfe/semi-ui';
import { IconUpload, IconImage, IconSend } from '@douyinfe/semi-icons';
import AppLayout from '@/components/AppLayout';
import { imageService } from '@/services/imageService';

const { Title, Text } = Typography;

const ImageGeneratePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [initImage, setInitImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleGenerate = async (values: any) => {
    try {
      if (!imageFile) {
        Toast.warning({ content: '请先上传一张图片' });
        return;
      }
      setLoading(true);

      const base64Result = await imageService.generateImageTest(
        values.prompt || '根据这张图的风格，生成一张在火星上的城市景观',
        imageFile
      );

      setGeneratedImages([base64Result]);

      Toast.success({ content: '图片生成成功' });
    } catch (error: any) {
      console.error('生成图片失败:', error);
      Toast.error({ content: error.message || '生成图片失败' });
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (props: any) => {
    const { file } = props;
    const fileInstance = file.fileInstance || file;
    setImageFile(fileInstance);

    const reader = new FileReader();
    reader.onload = (e) => {
      setInitImage(e.target?.result as string);
    };
    reader.readAsDataURL(fileInstance);
    return false; // 阻止自动上传
  };

  return (
    <AppLayout headerTitle="图片生成 (测试接口)">
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title heading={2}>AI 图片生成测试</Title>
          <Text type="secondary">测试接口: http://localhost:3333/api/ai/test/image (form-data)</Text>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          {/* 左侧：结果展示 */}
          <Card
            title="生成结果"
            headerExtraContent={
              loading && <Spin size="small" />
            }
          >
            {generatedImages.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {generatedImages.map((img, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <Image
                      src={img.startsWith('data:') ? img : `data:image/png;base64,${img}`}
                      width="100%"
                      style={{ borderRadius: '8px', border: '1px solid var(--semi-color-border)' }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                  <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>
                      <Text>模型正在处理图片...</Text>
                    </div>
                  </div>
                ) : (
                  <Empty
                    image={<IconImage style={{ fontSize: '48px' }} />}
                    description="生成的图片将在这里显示"
                  />
                )}
              </div>
            )}
          </Card>

          {/* 右侧：配置面板 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card title="测试配置">
              <Form
                initValues={{
                  prompt: '根据这张图的风格，生成一张在火星上的城市景观',
                }}
                onSubmit={handleGenerate}
              >
                {() => (
                  <>
                    <Form.TextArea
                      field="prompt"
                      label="提示词 (Prompt)"
                      placeholder="根据这张图的风格，生成一张在火星上的城市景观"
                      rows={4}
                    />

                    <Divider margin="16px" />

                    <div style={{ marginBottom: '16px' }}>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>上传基础图 (image)</Text>
                      <Upload
                        action="#"
                        beforeUpload={beforeUpload}
                        limit={1}
                        onRemove={() => {
                          setInitImage(null);
                          setImageFile(null);
                        }}
                        listType="picture"
                        accept="image/*"
                      >
                        <Button icon={<IconUpload />} theme="light">选择图片</Button>
                      </Upload>

                      {initImage && (
                        <div style={{ marginTop: '16px' }}>
                          <Text size="small" type="secondary">原图预览：</Text>
                          <Image src={initImage} width="100%" style={{ marginTop: '8px', borderRadius: '4px' }} />
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <Button
                        type="primary"
                        theme="solid"
                        block
                        icon={<IconSend />}
                        loading={loading}
                        htmlType="submit"
                        disabled={!imageFile}
                      >
                        提交测试
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ImageGeneratePage;
