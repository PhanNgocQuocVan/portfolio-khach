"use client";

import { useCallback, useState } from "react";
import { set, unset } from "sanity";
import type { ObjectInputProps, FileValue } from "sanity";
import { useClient } from "sanity";
import {
  Stack,
  Button,
  Text,
  Box,
  Card,
  Flex,
  Badge,
  Spinner,
} from "@sanity/ui";
import {
  UploadIcon,
  TrashIcon,
  DownloadIcon,
  CheckmarkIcon,
} from "@sanity/icons";

export function CvUploadInput(props: ObjectInputProps<FileValue>) {
  const { value, onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2024-01-01" });

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFile = Boolean(value?.asset?._ref);

  // Lấy URL download của file hiện tại
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Fetch thông tin file khi có asset ref
  const fetchFileInfo = useCallback(async () => {
    if (!value?.asset?._ref) return;
    try {
      const assetId = value.asset._ref
        .replace("file-", "")
        .replace(/-pdf$/, ".pdf")
        .replace(/-([^-]+)$/, ".$1");
      // Dùng GROQ để lấy URL
      const asset = await client.fetch(
        `*[_id == $ref][0]{ url, originalFilename }`,
        {
          ref: value.asset._ref,
        },
      );
      if (asset) {
        setFileUrl(asset.url);
        setFileName(asset.originalFilename || "cv.pdf");
      }
    } catch {
      // ignore
    }
  }, [value?.asset?._ref, client]);

  // Gọi fetchFileInfo khi component mount hoặc value thay đổi
  useState(() => {
    fetchFileInfo();
  });

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        setError("Chỉ chấp nhận file PDF!");
        return;
      }

      setIsUploading(true);
      setError(null);
      setUploadSuccess(false);

      try {
        // 1. Nếu có file cũ → xóa asset cũ trước
        if (value?.asset?._ref) {
          const oldRef = value.asset._ref;
          // Unset field trước
          onChange(unset());
          // Xóa asset khỏi Sanity
          try {
            await client.delete(oldRef);
          } catch {
            // Asset có thể đang được dùng ở chỗ khác, bỏ qua lỗi xóa
          }
        }

        // 2. Upload file mới
        const uploadedAsset = await client.assets.upload("file", file, {
          filename: file.name,
          contentType: "application/pdf",
        });

        // 3. Set giá trị mới vào field
        onChange(
          set({
            _type: "file",
            asset: {
              _type: "reference",
              _ref: uploadedAsset._id,
            },
          }),
        );

        // 4. Cập nhật updatedAt thông qua patch document cha
        // (sẽ được xử lý bởi document save)

        setFileName(file.name);
        setFileUrl(uploadedAsset.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
        setError("Tải lên thất bại. Vui lòng thử lại.");
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
        // Reset input để có thể chọn lại cùng file
        event.target.value = "";
      }
    },
    [value, onChange, client],
  );

  const handleDelete = useCallback(async () => {
    if (!value?.asset?._ref) return;
    if (!confirm("Bạn có chắc muốn xóa CV hiện tại không?")) return;

    setIsDeleting(true);
    try {
      const oldRef = value.asset._ref;
      onChange(unset());
      try {
        await client.delete(oldRef);
      } catch {
        // ignore
      }
      setFileUrl(null);
      setFileName(null);
    } finally {
      setIsDeleting(false);
    }
  }, [value, onChange, client]);

  return (
    <Stack space={4}>
      {/* Khu vực hiển thị file hiện tại */}
      {hasFile ? (
        <Card padding={4} radius={3} tone="positive" border>
          <Flex align="center" gap={3} wrap="wrap">
            <Box flex={1}>
              <Stack space={2}>
                <Flex align="center" gap={2}>
                  <Badge tone="positive" mode="outline">
                    PDF
                  </Badge>
                  <Text size={2} weight="semibold">
                    {fileName || "cv.pdf"}
                  </Text>
                </Flex>
                <Text size={1} muted>
                  ✅ File CV hiện tại — Tải lên file mới sẽ tự động thay thế
                </Text>
              </Stack>
            </Box>

            <Flex gap={2}>
              {fileUrl && (
                <Button
                  as="a"
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={DownloadIcon}
                  text="Xem CV"
                  tone="primary"
                  mode="ghost"
                  fontSize={1}
                />
              )}
              <Button
                icon={TrashIcon}
                text={isDeleting ? "Đang xóa..." : "Xóa"}
                tone="critical"
                mode="ghost"
                fontSize={1}
                onClick={handleDelete}
                disabled={isDeleting || readOnly}
              />
            </Flex>
          </Flex>
        </Card>
      ) : (
        <Card padding={4} radius={3} tone="caution" border>
          <Text size={2} muted>
            📄 Chưa có CV nào được tải lên
          </Text>
        </Card>
      )}

      {/* Nút tải lên */}
      {!readOnly && (
        <Box>
          <label htmlFor="cv-upload-input">
            <Button
              as="span"
              icon={isUploading ? Spinner : UploadIcon}
              text={
                isUploading
                  ? "Đang tải lên..."
                  : hasFile
                    ? "🔄 Thay thế CV"
                    : "📤 Tải CV lên"
              }
              tone={hasFile ? "caution" : "primary"}
              disabled={isUploading || isDeleting}
              style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
            />
          </label>
          <input
            id="cv-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleUpload}
            disabled={isUploading}
            style={{ display: "none" }}
          />
        </Box>
      )}

      {/* Thông báo thành công */}
      {uploadSuccess && (
        <Card padding={3} radius={2} tone="positive" border>
          <Flex align="center" gap={2}>
            <CheckmarkIcon />
            <Text size={2} weight="semibold">
              ✅ CV đã được cập nhật thành công! Nhớ nhấn{" "}
              <strong>Publish</strong> để lưu thay đổi.
            </Text>
          </Flex>
        </Card>
      )}

      {/* Thông báo lỗi */}
      {error && (
        <Card padding={3} radius={2} tone="critical" border>
          <Text size={2}>❌ {error}</Text>
        </Card>
      )}
    </Stack>
  );
}
