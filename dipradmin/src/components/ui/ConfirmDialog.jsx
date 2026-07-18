import { Modal } from "antd";

/**
 * Thin wrapper around Modal.confirm — preserves existing confirm patterns.
 */
export function confirmDialog({
  title = "Confirm",
  content,
  okText = "Confirm",
  cancelText = "Cancel",
  okType = "primary",
  danger = false,
  onOk,
}) {
  return Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    okType: danger ? "danger" : okType,
    centered: true,
    onOk,
  });
}

export default confirmDialog;
