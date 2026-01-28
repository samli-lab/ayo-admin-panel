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
      setLoading(true);

      const base64Result = await imageService.generateImageTest(
        values.prompt || '根据这张图的风格，生成一张在火星上的城市景观',
        imageFile || undefined
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

  const beforeUpload = (file: any) => {
    console.log('beforeUpload called with:', file);
    
    // Semi Design Upload 组件的 file 参数结构
    // 可能是 { fileInstance: File } 或直接是 File 对象
    let fileInstance: File | null = null;
    
    if (file instanceof File) {
      fileInstance = file;
    } else if (file?.fileInstance instanceof File) {
      fileInstance = file.fileInstance;
    } else if (file?.originFile instanceof File) {
      fileInstance = file.originFile;
    }
    
    // 确保是 File 对象
    if (fileInstance instanceof File) {
      console.log('File instance found:', fileInstance.name);
      setImageFile(fileInstance);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setInitImage(result);
        console.log('Image loaded successfully');
      };
      reader.onerror = () => {
        console.error('FileReader error');
        Toast.error({ content: '图片读取失败，请重新选择' });
      };
      reader.readAsDataURL(fileInstance);
    } else {
      console.error('上传的文件格式不正确:', file);
      Toast.error({ content: '文件格式不正确，请重新选择' });
    }
    
    return false; // 阻止自动上传，手动处理
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
                onSubmit={(values) => {
                  handleGenerate(values);
                }}
              >
                {({ values, formApi }) => (
                  <>
                    <Form.TextArea
                      field="prompt"
                      label="提示词 (Prompt)"
                      placeholder="根据这张图的风格，生成一张在火星上的城市景观"
                      rows={4}
                    />

                    <Divider margin="16px" />

                    <div style={{ marginBottom: '16px' }}>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                        上传基础图 (image) <Text type="tertiary" size="small">(可选)</Text>
                      </Text>
                      <Upload
                        action="#"
                        beforeUpload={beforeUpload}
                        limit={1}
                        onChange={(info: any) => {
                          // 当 beforeUpload 返回 false 时，文件仍会触发 onChange
                          // 确保文件状态同步
                          const fileList = info.fileList || [];
                          if (fileList.length > 0) {
                            const lastFile = fileList[fileList.length - 1];
                            const fileInstance = lastFile.fileInstance || lastFile.originFile || lastFile;
                            if (fileInstance instanceof File && !imageFile) {
                              setImageFile(fileInstance);
                            }
                          } else {
                            // 文件被移除时清空状态
                            setImageFile(null);
                            setInitImage(null);
                          }
                        }}
                        onRemove={() => {
                          setInitImage(null);
                          setImageFile(null);
                        }}
                        listType="picture"
                        accept="image/*"
                        showUploadList={true}
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
                        disabled={loading}
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
