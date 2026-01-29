import { useState, useEffect } from 'react';
import {
  Card,
  Slider,
  Space,
  Typography,
  Image,
  Button,
  Progress,
  Row,
  Col,
  Divider,
  Tag,
  Toast,
} from '@douyinfe/semi-ui';
import {
  IconImage,
  IconRefresh,
} from '@douyinfe/semi-icons';
import imageCompression from 'browser-image-compression';

const { Title, Text } = Typography;

interface ImageCompressorProps {
  file: File;
  onCompressed: (compressedFile: File) => void;
  onUseOriginal: (originalFile: File) => void;
  onCancel: () => void;
}

export default function ImageCompressor({
  file,
  onCompressed,
  onUseOriginal,
  onCancel,
}: ImageCompressorProps) {
  const [quality, setQuality] = useState(70);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [compressing, setCompressing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedPreview, setCompressedPreview] = useState<string>('');
  const [compressionRatio, setCompressionRatio] = useState<number>(0);

  useEffect(() => {
    // 生成原始图片预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 自动压缩一次
    handleCompress(quality, maxSizeMB);
  }, [file]);

  const handleCompress = async (qualityValue: number, maxSizeValue: number) => {
    setCompressing(true);
    try {
      const options = {
        maxSizeMB: maxSizeValue,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: qualityValue / 100,
      };

      const compressed = await imageCompression(file, options);

      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompressedPreview(reader.result as string);
      };
      reader.readAsDataURL(compressed);

      setCompressedFile(compressed);

      // 计算压缩比例
      const ratio = ((file.size - compressed.size) / file.size) * 100;
      setCompressionRatio(ratio);

      Toast.success('压缩完成');
    } catch (error) {
      console.error('压缩失败:', error);
      Toast.error('压缩失败，请重试');
    } finally {
      setCompressing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleQualityChange = (value: number) => {
    setQuality(value);
  };

  const handleSizeChange = (value: number) => {
    setMaxSizeMB(value);
  };

  const handleRecompress = () => {
    handleCompress(quality, maxSizeMB);
  };

  const handleUseCompressed = () => {
    if (compressedFile) {
      onCompressed(compressedFile);
    }
  };

  const handleUseOriginal = () => {
    onUseOriginal(file);
  };

  return (
    <Card
      style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
      bodyStyle={{ padding: '24px' }}
    >
      <Space vertical align="start" spacing="large" style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          <Title heading={4} icon={<IconImage />}>
            图片压缩工具
          </Title>
          <Text type="tertiary">
            选择合适的压缩参数，查看压缩效果后再决定是否上传
          </Text>
        </div>

        <Divider margin="12px" />

        {/* 压缩参数设置 */}
        <div style={{ width: '100%' }}>
          <Space vertical spacing="large" style={{ width: '100%' }}>
            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '14px' }}>压缩质量: {quality}%</Text>
              </div>
              <div style={{ padding: '0 8px', marginBottom: '16px' }}>
                <Slider
                  value={quality}
                  onChange={handleQualityChange}
                  min={10}
                  max={100}
                  step={5}
                  style={{ width: '100%' }}
                  tipFormatter={(value) => `${value}%`}
                  marks={{
                    10: '最小',
                    50: '中等',
                    100: '最高',
                  }}
                />
              </div>
              <Text size="small" type="tertiary" style={{ display: 'block', marginTop: '12px', marginBottom: '4px' }}>
                质量越低，文件越小，但图片可能会失真
              </Text>
            </div>

            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '14px' }}>目标大小: {maxSizeMB} MB</Text>
              </div>
              <div style={{ padding: '0 8px', marginBottom: '16px' }}>
                <Slider
                  value={maxSizeMB}
                  onChange={handleSizeChange}
                  min={0.1}
                  max={5}
                  step={0.1}
                  style={{ width: '100%' }}
                  tipFormatter={(value) => `${value} MB`}
                  marks={{
                    0.1: '0.1',
                    1: '1',
                    3: '3',
                    5: '5',
                  }}
                />
              </div>
              <Text size="small" type="tertiary" style={{ display: 'block', marginTop: '12px', marginBottom: '4px' }}>
                压缩后的目标文件大小（单位：MB）
              </Text>
            </div>

            <Button
              theme="solid"
              type="primary"
              icon={<IconRefresh />}
              onClick={handleRecompress}
              loading={compressing}
              style={{ alignSelf: 'flex-start' }}
            >
              重新压缩
            </Button>
          </Space>
        </div>

        <Divider margin="12px" />

        {/* 压缩信息 */}
        {compressedFile && (
          <div style={{ width: '100%' }}>
            <Space vertical spacing="medium" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Card 
                    style={{ 
                      textAlign: 'center', 
                      background: '#f7f9fa',
                      height: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    bodyStyle={{ padding: '16px', width: '100%' }}
                  >
                    <Text type="tertiary" style={{ display: 'block', marginBottom: '8px' }}>原始大小</Text>
                    <Title heading={4} style={{ margin: 0 }}>
                      {formatFileSize(file.size)}
                    </Title>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    style={{ 
                      textAlign: 'center', 
                      background: '#f7f9fa',
                      height: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    bodyStyle={{ padding: '16px', width: '100%' }}
                  >
                    <Text type="tertiary" style={{ display: 'block', marginBottom: '8px' }}>压缩后大小</Text>
                    <Title heading={4} style={{ margin: 0 }}>
                      {formatFileSize(compressedFile.size)}
                    </Title>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    style={{ 
                      textAlign: 'center', 
                      background: '#f7f9fa',
                      height: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    bodyStyle={{ padding: '16px', width: '100%' }}
                  >
                    <Text type="tertiary" style={{ display: 'block', marginBottom: '8px' }}>压缩率</Text>
                    <Title heading={4} style={{ margin: 0 }}>
                      <Tag color="green" size="large">
                        {compressionRatio.toFixed(1)}%
                      </Tag>
                    </Title>
                  </Card>
                </Col>
              </Row>

              {compressing && (
                <Progress percent={50} showInfo={false} stroke="var(--semi-color-primary)" />
              )}
            </Space>
          </div>
        )}

        <Divider margin="12px" />

        {/* 图片对比预览 */}
        <div style={{ width: '100%' }}>
          <Title heading={5} icon={<IconImage />} style={{ marginBottom: '16px' }}>
            图片对比
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="原始图片"
                headerStyle={{ textAlign: 'center' }}
                bodyStyle={{ padding: '12px' }}
              >
                {originalPreview && (
                  <Image
                    src={originalPreview}
                    width="100%"
                    height={300}
                    style={{ objectFit: 'contain', borderRadius: '4px' }}
                    preview={{
                      src: originalPreview,
                      mask: '查看原图',
                    }}
                  />
                )}
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <Text type="tertiary">{formatFileSize(file.size)}</Text>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="压缩后图片"
                headerStyle={{ textAlign: 'center' }}
                bodyStyle={{ padding: '12px' }}
              >
                {compressedPreview ? (
                  <>
                    <Image
                      src={compressedPreview}
                      width="100%"
                      height={300}
                      style={{ objectFit: 'contain', borderRadius: '4px' }}
                      preview={{
                        src: compressedPreview,
                        mask: '查看压缩图',
                      }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                      <Text type="tertiary">
                        {compressedFile ? formatFileSize(compressedFile.size) : '--'}
                      </Text>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f7f9fa',
                      borderRadius: '4px',
                    }}
                  >
                    <Text type="tertiary">压缩中...</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>

        <Divider margin="12px" />

        {/* 操作按钮 */}
        <Space style={{ width: '100%', justifyContent: 'center' }} spacing="medium">
          <Button
            size="large"
            type="primary"
            theme="solid"
            disabled={!compressedFile || compressing}
            onClick={handleUseCompressed}
          >
            使用压缩后的图片
          </Button>
          <Button
            size="large"
            type="secondary"
            onClick={handleUseOriginal}
          >
            使用原图
          </Button>
          <Button size="large" onClick={onCancel}>
            取消
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
