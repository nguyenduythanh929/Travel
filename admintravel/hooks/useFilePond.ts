import { useEffect, useRef, useCallback } from "react";


interface UseFilePondOptions {
  onFileChange?: (files: any[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  allowMultiple?: boolean;
  imagePreviewHeight?: number;
  initialFiles?: (File | string)[];
}

export const useFilePond = (options: UseFilePondOptions = {}) => {
  const pondRef = useRef<any>(null);
  const elementRef = useRef<HTMLInputElement>(null);
  const isInitializedRef = useRef(false);

  // Store options in refs to avoid re-initialization
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const {
    maxFiles = 5,
    acceptedFileTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"],
    allowMultiple = true,
    imagePreviewHeight = 170,
    initialFiles = [],
  } = options;

  useEffect(() => {
    // Prevent re-initialization if already initialized
    if (isInitializedRef.current || pondRef.current) {
      return;
    }

  const initFilePond = async () => {
    if (typeof window !== "undefined" && elementRef.current) {
      // Import linh hoạt
      const FilePondModule = await import("filepond");
      const FilePond = FilePondModule.default || FilePondModule;

      const ImgPreviewModule = await import("filepond-plugin-image-preview");
      const FileValidateModule = await import("filepond-plugin-file-validate-type");

      const FilePondPluginImagePreview =
        ImgPreviewModule.default || ImgPreviewModule;
      const FilePondPluginFileValidateType =
        FileValidateModule.default || FileValidateModule;

      FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginFileValidateType
      );

      if (!elementRef.current || isInitializedRef.current) return;

      isInitializedRef.current = true;

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

      pondRef.current = FilePond.create(elementRef.current, {
        labelIdle: "+",
        maxFiles,
        acceptedFileTypes,
        allowMultiple,
        allowImagePreview: true,
        imagePreviewHeight,
        stylePanelLayout: "compact",
        credits: false,
        
        // Server configuration for loading remote images
        server: {
          load: (source, load, error, progress, abort, headers) => {
            // For remote images, fetch them and convert to blob
            fetch(source)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to load image: ${response.statusText}`);
                }
                return response.blob();
              })
              .then((blob) => {
                load(blob);
              })
              .catch((err) => {
                error(err.message || "Failed to load image");
              });
            
            // Return abort function
            return {
              abort: () => {
                abort();
              },
            };
},
        },

        onupdatefiles: (fileItems) => {
          const files = fileItems.map((x) => x.file);
          optionsRef.current.onFileChange?.(files);
        },
      });

      // Add initial files AFTER the pond is created
      if (optionsRef.current.initialFiles?.length && pondRef.current) {
        for (const file of optionsRef.current.initialFiles) {
          try {
            if (typeof file === "string") {
              // URL case - string path
              pondRef.current.addFile(file, {
                type: "local",
              });
            } else if (file && typeof file === "object") {
              // Check if it's a formatted object from FilePondWrapper
              if ("source" in file && "options" in file) {
                // Formatted object case: { source: string, options: { type: "local", metadata: {...} } }
                pondRef.current.addFile(file.source, file.options);
              } else if (file instanceof File) {
                // File object case
                pondRef.current.addFile(file);
              }
            }
          } catch (error) {
            console.error("Error adding file to FilePond:", error);
          }
        }
      }
    }
  };


    initFilePond();

    // Cleanup
    return () => {
      if (pondRef.current) {
        pondRef.current.destroy();
        pondRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Empty deps - only initialize once

  // Handle initialFiles updates (e.g., when editing a tour and data loads)
  useEffect(() => {
    if (
      pondRef.current &&
      isInitializedRef.current &&
      optionsRef.current.initialFiles?.length
    ) {
      // Clear existing files first
      const currentFiles = pondRef.current.getFiles();
      if (currentFiles.length === 0) {
        // Only add files if pond is empty (to avoid duplicates)
        for (const file of optionsRef.current.initialFiles) {
          try {
            if (typeof file === "string") {
              pondRef.current.addFile(file, {
                type: "local",
              });
            } else if (file && typeof file === "object") {
              if ("source" in file && "options" in file) {
                pondRef.current.addFile(file.source, file.options);
              } else if (file instanceof File) {
                pondRef.current.addFile(file);
              }
            }
          } catch (error) {
            console.error("Error adding file to FilePond:", error);
          }
        }
      }
    }
  }, [initialFiles]); // Watch for initialFiles changes

  const getFiles = () => {
    return pondRef.current?.getFiles() || [];
  };

  const removeFile = (index: number) => {
    pondRef.current?.removeFile(index);
  };

  const addFile = (file: File) => {
    pondRef.current?.addFile(file);
  };

  return {
    pondRef,
    elementRef,
    getFiles,
    removeFile,
    addFile,
  };
};