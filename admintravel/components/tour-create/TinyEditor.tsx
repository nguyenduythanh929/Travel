"use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyEditorProps {
  initialValue?: string;
  height?: number;
  onEditorChange?: (content: string) => void;
}

export default function TinyEditor({
  initialValue = "",
  height = 400,
  onEditorChange,
}: TinyEditorProps) {
  const editorRef = useRef<any>(null);
  const TINYMCE_BASE = "/tinymce";

  return (
    <Editor
      apiKey="wcmxywpuerdtkgqp1ytzvprr27s9v62nxc14lbmsu1a1jkg9"
      tinymceScriptSrc={`${TINYMCE_BASE}/tinymce.min.js`}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height,
        menubar: true,
        plugins: ["charmap", "image", "link", "media", "lists", "code"],
        toolbar:
          "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap code emoticons image link numlist bullist media",
        branding: false,
        promotion: false,
        license_key: "gpl", // ✅ Fix: Add GPL license key for open source use
        base_url: TINYMCE_BASE,
        suffix: ".min",
        images_upload_url: "http://localhost:8088/api/tinymce/upload",
        // File picker types
        file_picker_types: "image",

        // Custom file picker callback (optional)
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.onchange = function () {
              const file = (input as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                  // Upload file to server
                  const formData = new FormData();
                  formData.append("file", file);

                  fetch("http://localhost:8088/api/tinymce/upload", {
                    method: "POST",
                    body: formData,
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      // Call the callback with the uploaded image URL
                      callback(data.location, {
                        alt: file.name,
                        title: file.name,
                      });
                    })
                    .catch((error) => {
                      console.error("Error uploading image:", error);
                      alert("Failed to upload image");
                    });
                };
                reader.readAsDataURL(file);
              }
            };

            input.click();
          }
        },

        // Image upload handler (for paste/drop)
        images_upload_handler: async (blobInfo, progress) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());

            fetch("http://localhost:8088/api/tinymce/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Upload failed");
                }
                return response.json();
              })
              .then((data) => {
                resolve(data.location);
              })
              .catch((error) => {
                console.error("Error uploading image:", error);
                reject("Image upload failed: " + error.message);
              });
          });
        },
        automatic_uploads: true,
      }}
      onEditorChange={onEditorChange}
    />
  );
}
