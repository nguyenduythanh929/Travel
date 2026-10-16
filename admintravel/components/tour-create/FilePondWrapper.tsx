"use client";

import { useFilePond } from "@/hooks/useFilePond";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

export default function FilePondWrapper({ initialFiles = [], onChange }: any) {
  
  const getMimeFromFilename = (file: string) => {
    if (file.endsWith(".png")) return "image/png";
    if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
    if (file.endsWith(".gif")) return "image/gif";
    if (file.endsWith(".webp")) return "image/webp";
    return "image/*";
  };

  const getImageUrl = (fileName: string) => {
    // If it's already a full URL, return as is
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
      return fileName;
    }
    // Otherwise, use the API endpoint
    return `${API_BASE_URL}/tours/images/${fileName}`;
  };

  const formattedInitialFiles = initialFiles.map((fileName: string) => ({
    source: getImageUrl(fileName),
    options: {
      type: "local",
      metadata: {
        mimeType: getMimeFromFilename(fileName),
      }
    }
  }));

  const { elementRef } = useFilePond({
    maxFiles: 5,
    acceptedFileTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onFileChange: onChange,
    initialFiles: formattedInitialFiles,
  });

  return <input type="file" ref={elementRef} accept="image/*" multiple />;
}