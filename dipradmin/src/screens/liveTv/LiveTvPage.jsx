import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
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
import {
  Page,
  StatusRow,
  Grid,
  Panel,
  PlayerPanel,
  PlayerShell,
  LiveBadge,
  PlayerEmpty,
  MetaRow,
  Hint,
  ThumbPlay,
} from "./LiveTvPage.Styles";
import PageHeader from "../../components/ui/PageHeader";

const { Text } = Typography;
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

function applyLiveTvToForm(form, data) {
  form.setFieldsValue({
    title: data?.title || "DIPR Live TV",
    playbackUrl: data?.playbackUrl || "",
  });
}

export default function LiveTvPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(null);
  const [playerActive, setPlayerActive] = useState(false);
  const watchedUrl = Form.useWatch("playbackUrl", form);
  const previewId = useMemo(
    () =>
      extractYoutubeId(watchedUrl || "") ||
      current?.youtubeVideoId ||
      "",
    [watchedUrl, current?.youtubeVideoId]
  );

  useEffect(() => {
    setPlayerActive(false);
  }, [previewId]);

  const embedUrl = useMemo(() => {
    if (!previewId) return "";
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });
    return `https://www.youtube.com/embed/${previewId}?${params.toString()}`;
  }, [previewId]);

  const loadLiveTv = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLiveTv();
      const data = res?.data || null;
      setCurrent(data);
      applyLiveTvToForm(form, data);
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
      const data = res?.data || null;
      setCurrent(data);
      applyLiveTvToForm(form, data);
      message.success(
        current?.isOnline
          ? "Live TV updated — website shows the new stream"
          : "Live TV is online — website will show this stream"
      );
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to go live");
    } finally {
      setSaving(false);
    }
  };

  const handleOffline = () => {
    Modal.confirm({
      title: "Go offline?",
      content:
        "The website will stop showing Live TV. The saved URL stays so you can go live again.",
      okText: "Go Offline",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        setSaving(true);
        try {
          const res = await setLiveTvOffline();
          const data = res?.data || null;
          setCurrent(data);
          applyLiveTvToForm(form, data);
          message.success("Live TV is offline");
        } catch (error) {
          console.error(error);
          message.error(error.message || "Failed to go offline");
          throw error;
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const isOnline = Boolean(current?.isOnline);
  const hasSavedStream = Boolean(
    current?.playbackUrl || current?.youtubeVideoId
  );

  return (
    <Page>
      <PageHeader
        title="Live TV"
        breadcrumbs={[{ title: "Live TV" }]}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={loadLiveTv}
            loading={loading}
          >
            Refresh
          </Button>
        }
      />
      <Text type="secondary" style={{ display: "block", marginTop: -8, marginBottom: 16 }}>
        Paste a YouTube Live URL, preview it here, then publish to the website.
      </Text>

      <Grid>
        <Panel>
          <StatusRow>
            <Tag color={isOnline ? "red" : "default"}>
              {isOnline ? "LIVE ON WEBSITE" : "OFFLINE"}
            </Tag>
          </StatusRow>

          <Hint>
            One stream at a time. Update replaces the current URL. Go Offline
            hides it on the site but keeps the URL saved.
          </Hint>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleGoLive}
            initialValues={{ title: "DIPR Live TV", playbackUrl: "" }}
            disabled={loading}
          >
            <Form.Item label="Title" name="title">
              <Input placeholder="DIPR Live TV" maxLength={120} size="large" />
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
                style={{ resize: "vertical" }}
              />
            </Form.Item>

            <Space wrap size="middle">
              <Button
                type="primary"
                danger
                htmlType="submit"
                icon={<PlayCircleOutlined />}
                loading={saving}
                size="large"
              >
                {isOnline ? "Update & Go Live" : "Go Live"}
              </Button>
              <Button
                icon={<StopOutlined />}
                onClick={handleOffline}
                loading={saving}
                size="large"
                disabled={!isOnline && !hasSavedStream}
              >
                Go Offline
              </Button>
            </Space>
          </Form>
        </Panel>

        <PlayerPanel>
          <StatusRow style={{ marginBottom: 12 }}>
            <Text strong style={{ fontSize: 15 }}>
              Live player
            </Text>
            {isOnline ? (
              <Tag color="error">Broadcasting</Tag>
            ) : (
              <Tag>Preview only</Tag>
            )}
          </StatusRow>

          <PlayerShell>
            {isOnline && previewId ? <LiveBadge>Live</LiveBadge> : null}
            {previewId && playerActive ? (
              <iframe
                key={previewId}
                title="Live TV preview player"
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : previewId ? (
              <ThumbPlay
                type="button"
                onClick={() => setPlayerActive(true)}
                aria-label="Play live preview"
              >
                <img
                  src={`https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`}
                  alt=""
                />
                <div className="play-btn">
                  <span>
                    <PlayCircleOutlined />
                  </span>
                </div>
              </ThumbPlay>
            ) : (
              <PlayerEmpty>
                <YoutubeOutlined className="empty-icon" />
                <Text style={{ color: "#c5cad6" }}>
                  Paste a YouTube Live URL to play preview
                </Text>
              </PlayerEmpty>
            )}
          </PlayerShell>

          <MetaRow>
            <div>
              {previewId ? (
                <Text type="secondary">Stream ready in player</Text>
              ) : (
                <Text type="secondary">No stream loaded</Text>
              )}
              {current?.updatedAt ? (
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Updated {new Date(current.updatedAt).toLocaleString()}
                  </Text>
                </div>
              ) : null}
            </div>
            {previewId ? (
              <Button
                type="link"
                href={`https://www.youtube.com/watch?v=${previewId}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={<YoutubeOutlined />}
              >
                Open on YouTube
              </Button>
            ) : null}
          </MetaRow>
        </PlayerPanel>
      </Grid>
    </Page>
  );
}
