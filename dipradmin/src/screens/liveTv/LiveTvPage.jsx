import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import {
  getLiveTv,
  setLiveTvOffline,
  upsertLiveTv,
} from "../../service/liveTv/LiveTvService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function extractYoutubeId(input) {
  if (!input || typeof input !== "string") return "";
  const raw = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  const patterns = [
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]{11})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) return match[1];
  }
  try {
    const url = new URL(raw);
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
  } catch (_) {
    // ignore
  }
  return "";
}

export default function LiveTvPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(null);
  const watchedUrl = Form.useWatch("playbackUrl", form);
  const previewId = useMemo(
    () => extractYoutubeId(watchedUrl || ""),
    [watchedUrl]
  );

  const loadLiveTv = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLiveTv();
      const data = res?.data || null;
      setCurrent(data);
      form.setFieldsValue({
        title: data?.title || "DIPR Live TV",
        playbackUrl: data?.playbackUrl || "",
      });
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to load Live TV");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadLiveTv();
  }, [loadLiveTv]);

  const handleGoLive = async (values) => {
    const playbackUrl = values.playbackUrl?.trim();
    if (!extractYoutubeId(playbackUrl)) {
      message.error("Paste a valid YouTube live / watch URL");
      return;
    }

    setSaving(true);
    try {
      const res = await upsertLiveTv({
        title: values.title?.trim() || "DIPR Live TV",
        playbackUrl,
        isOnline: true,
      });
      setCurrent(res?.data || null);
      form.setFieldsValue({
        title: res?.data?.title,
        playbackUrl: res?.data?.playbackUrl,
      });
      message.success("Live TV is online — website will show this stream");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to go live");
    } finally {
      setSaving(false);
    }
  };

  const handleOffline = async () => {
    setSaving(true);
    try {
      const res = await setLiveTvOffline();
      setCurrent(res?.data || null);
      message.success("Live TV is offline");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to go offline");
    } finally {
      setSaving(false);
    }
  };

  const isOnline = Boolean(current?.isOnline);

  return (
    <div style={{ minHeight: "100%", background: "#f6f7f9", padding: 24 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          wrap
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Live TV
            </Title>
            <Text type="secondary">
              Paste a YouTube Live URL and publish it to the website.
            </Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadLiveTv} loading={loading}>
            Refresh
          </Button>
        </Space>

        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="One YouTube stream at a time"
          description="A new URL replaces the previous one. Click Go Offline when the live ends."
        />

        <div className="live-tv-grid">
          <Card
            loading={loading}
            style={{
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <Space style={{ marginBottom: 16 }} wrap>
              <Tag color={isOnline ? "red" : "default"}>
                {isOnline ? "LIVE ON WEBSITE" : "OFFLINE"}
              </Tag>
              {current?.youtubeVideoId ? (
                <Tag icon={<YoutubeOutlined />} color="processing">
                  {current.youtubeVideoId}
                </Tag>
              ) : null}
            </Space>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleGoLive}
              initialValues={{ title: "DIPR Live TV" }}
            >
              <Form.Item label="Title" name="title">
                <Input placeholder="DIPR Live TV" maxLength={120} />
              </Form.Item>

              <Form.Item
                label="YouTube Live URL"
                name="playbackUrl"
                rules={[{ required: true, message: "Paste YouTube live URL" }]}
                extra="Example: https://www.youtube.com/live/XStXShPCViE"
              >
                <TextArea
                  rows={3}
                  placeholder="https://www.youtube.com/live/XXXXXXXXXXX"
                />
              </Form.Item>

              <Space wrap>
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  icon={<PlayCircleOutlined />}
                  loading={saving}
                  size="large"
                >
                  Go Live
                </Button>
                <Button
                  icon={<StopOutlined />}
                  onClick={handleOffline}
                  loading={saving}
                  size="large"
                  disabled={!isOnline && !current?.playbackUrl}
                >
                  Go Offline
                </Button>
              </Space>
            </Form>
          </Card>

          <Card
            title="Preview"
            style={{
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            {previewId ? (
              <>
                <div className="live-tv-thumb">
                  <img
                    src={`https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`}
                    alt="YouTube thumbnail"
                  />
                </div>
                <Paragraph style={{ marginBottom: 8 }}>
                  Video ID: <Text code>{previewId}</Text>
                </Paragraph>
                <Button
                  type="link"
                  href={`https://www.youtube.com/watch?v=${previewId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<YoutubeOutlined />}
                  style={{ paddingLeft: 0 }}
                >
                  Open on YouTube
                </Button>
              </>
            ) : (
              <Text type="secondary">
                Paste a YouTube live URL to preview the thumbnail.
              </Text>
            )}

            {current?.updatedAt ? (
              <Paragraph type="secondary" style={{ marginTop: 16, marginBottom: 0 }}>
                Last updated: {new Date(current.updatedAt).toLocaleString()}
              </Paragraph>
            ) : null}
          </Card>
        </div>
      </div>

      <style>{`
        .live-tv-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
          gap: 16px;
        }
        .live-tv-thumb {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          background: #111;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .live-tv-thumb img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @media (max-width: 900px) {
          .live-tv-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
