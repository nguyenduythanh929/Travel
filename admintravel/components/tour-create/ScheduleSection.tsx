"use client";

import { ScheduleItemType } from "@/schemaValidations/tour.schema";
import { useState, useEffect, useRef } from "react";
import { FaUpDownLeftRight, FaTrashCan, FaAngleDown } from "react-icons/fa6";

interface ScheduleSectionProps {
  schedules: ScheduleItemType[];
  onSchedulesChange: (schedules: ScheduleItemType[]) => void;
}

export default function ScheduleSection({
  schedules,
  onSchedulesChange,
}: ScheduleSectionProps) {
  const [localSchedules, setLocalSchedules] =
    useState<ScheduleItemType[]>(schedules);
  const lastSyncedIdsRef = useRef<string>(
    schedules
      .map((s) => s.id)
      .sort()
      .join(",")
  );
  // Track if the change was internal (user action) to avoid syncing prop changes back
  const isInternalChange = useRef(false);

  // Sync localSchedules to parent when changed by user actions
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      onSchedulesChange(localSchedules);
    }
  }, [localSchedules, onSchedulesChange]);

  // Sync localSchedules with prop when schedule structure changes (IDs change, not content)
  useEffect(() => {
    const currentIds = schedules
      .map((s) => s.id)
      .sort()
      .join(",");
    const lastSyncedIds = lastSyncedIdsRef.current;

    // Only sync if the IDs are different (new items added/removed from parent)
    // This prevents overwriting user input when they're typing
    if (currentIds !== lastSyncedIds) {
      lastSyncedIdsRef.current = currentIds;
      setLocalSchedules(schedules);
    }
  }, [schedules]);

  useEffect(() => {
    let tinymce: any = null;
    let sortableInstance: any = null;

    // Dynamically import libraries
    const initLibraries = async () => {
      if (typeof window !== "undefined") {
        try {
          const Sortable = (await import("sortablejs")).default;
          tinymce = (await import("tinymce/tinymce")).default;

          // Import TinyMCE dependencies
          // @ts-expect-error
          await import("tinymce/icons/default");
          // @ts-expect-error
          await import("tinymce/themes/silver");
          // @ts-expect-error
          await import("tinymce/models/dom");

          // Import plugins
          const plugins = [
            "charmap",
            "image",
            "link",
            "media",
            "lists",
            "code",
          ];
          for (const plugin of plugins) {
            try {
              await import(`tinymce/plugins/${plugin}`);
            } catch (err) {
              console.warn(`Plugin ${plugin} not found, skipping...`);
            }
          }

          // Wait for DOM and imports to be ready
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Initialize TinyMCE for existing textareas
          const currentSchedules = localSchedules;
          for (const schedule of currentSchedules) {
            const selector = `#schedule-content-${schedule.id}`;
            const element = document.querySelector(selector);

            if (element) {
              // Remove existing editor if any
              const existingEditor = tinymce.get(
                `schedule-content-${schedule.id}`
              );
              if (existingEditor) {
                existingEditor.remove();
              }

              await tinymce.init({
                selector,
                plugins: "charmap image link media lists code",
                toolbar:
                  "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap code emoticons image link numlist bullist media",
                menubar: false,
                branding: false,
                height: 300,
                license_key: "gpl",

                // Critical settings to prevent loading external resources
                skin: false,
                content_css: false,
                promotion: false,

                // Inline styles
                content_style: `
                  body {font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    font-size: 14px;
                    padding: 10px;
                    line-height: 1.5;
                  }
                  p { margin: 0 0 10px 0; }
                `,

                setup: (editor: any) => {
                  editor.on("change keyup", () => {
                    // Use functional update to get latest state
                    isInternalChange.current = true;
                    setLocalSchedules((prev) =>
                      prev.map((s) =>
                        s.id === schedule.id
                          ? { ...s, content: editor.getContent() }
                          : s
                      )
                    );
                  });
                },
              });
            }
          }

          // Initialize Sortable
          const scheduleList = document.querySelector(".inner-schedule-list");
          if (scheduleList) {
            // Destroy existing Sortable instance if any
            if (sortableInstance) {
              sortableInstance.destroy();
            }

            sortableInstance = new Sortable(scheduleList as HTMLElement, {
              handle: ".inner-move",
              animation: 150,
              onStart: async (evt) => {
                const itemId = evt.item.getAttribute("data-schedule-id");
                if (itemId && tinymce) {
                  const editor = tinymce.get(`schedule-content-${itemId}`);
                  if (editor) {
                    // Save content before removing editor
                    const content = editor.getContent();
                    isInternalChange.current = true;
                    setLocalSchedules((prev) =>
                      prev.map((s) =>
                        s.id === itemId ? { ...s, content } : s
                      )
                    );
                    editor.remove();
                  }
                }
              },
              onEnd: async (evt) => {
                // Get current state to preserve all data
                let reorderedSchedules: ScheduleItemType[] = [];

                isInternalChange.current = true;
                setLocalSchedules((prev) => {
                  const scheduleList = document.querySelector(
                    ".inner-schedule-list"
                  );
                  if (!scheduleList) return prev;

                  // Get new order from DOM
                  const newOrder = Array.from(scheduleList.children).map(
                    (child) => child.getAttribute("data-schedule-id")
                  );

                  // Create a map of current schedules for quick lookup
                  const scheduleMap = new Map(prev.map((s) => [s.id, s]));

                  // Reorder schedules preserving all data
                  reorderedSchedules = newOrder
                    .map((id) => scheduleMap.get(id!))
                    .filter((s): s is ScheduleItemType => s !== undefined);

                  return reorderedSchedules;
                });

                // Reinitialize TinyMCE for all items after reorder
                setTimeout(async () => {
                  if (tinymce && reorderedSchedules.length > 0) {
                    for (const schedule of reorderedSchedules) {
                      const selector = `#schedule-content-${schedule.id}`;
                      const element = document.querySelector(selector);

                      if (element) {
                        // Remove existing editor if any
                        const existingEditor = tinymce.get(
                          `schedule-content-${schedule.id}`
                        );
                        if (existingEditor) {
                          existingEditor.remove();
                        }

                        await tinymce.init({
                          selector,
                          plugins: "charmap image link media lists code",
                          toolbar:
                            "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap code emoticons image link numlist bullist media",
                          menubar: false,
                          branding: false,
                          height: 300,
                          license_key: "gpl",
                          skin: false,
                          content_css: false,
                          promotion: false,
                          content_style: `
                            body {
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                              font-size: 14px;
                              padding: 10px;
                              line-height: 1.5;
                            }
                            p { margin: 0 0 10px 0; }
                          `,
                          setup: (editor: any) => {
                            editor.on("change keyup", () => {
                              isInternalChange.current = true;
                              setLocalSchedules((current) =>
                                current.map((s) =>
                                  s.id === schedule.id
                                    ? { ...s, content: editor.getContent() }
                                    : s
                                )
                              );
                            });
                          },
                        });
                      }
                    }
                  }
                }, 100);
              },
            });
          }
        } catch (error) {
          console.error("Error initializing libraries:", error);
        }
      }
    };

    initLibraries();

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        import("tinymce/tinymce").then(({ default: tinymce }) => {
          localSchedules.forEach((schedule) => {
            const editor = tinymce.get(`schedule-content-${schedule.id}`);
            if (editor) {
              editor.remove();
            }
          });
        });
      }
      if (sortableInstance) {
        sortableInstance.destroy();
      }
    };
  }, [localSchedules.length]);

  const handleTitleChange = (id: string, title: string) => {
    isInternalChange.current = true;
    setLocalSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, title } : schedule
      )
    );
  };

  const handleContentChange = (id: string, content: string) => {
    isInternalChange.current = true;
    setLocalSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, content } : schedule
      )
    );
  };

  const handleAddSchedule = async () => {
    const newSchedule: ScheduleItemType = {
      id: `schedule-${Date.now()}`,
      title: "",
      content: "",
    };

    isInternalChange.current = true;
    setLocalSchedules((prev) => [...prev, newSchedule]);

    // Initialize TinyMCE for new item
    setTimeout(async () => {
      if (typeof window !== "undefined") {
        try {
          const tinymce = (await import("tinymce/tinymce")).default;

          // Wait for DOM update
          await new Promise((resolve) => setTimeout(resolve, 100));

          const selector = `#schedule-content-${newSchedule.id}`;
          const element = document.querySelector(selector);

          if (element) {
            tinymce.init({
              selector,
              plugins: "charmap image link media lists code",
              toolbar:
                "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap code emoticons image link numlist bullist media",
              menubar: false,
              branding: false,
              height: 300,
              license_key: "gpl",

              // Critical settings to prevent loading external resources
              skin: false,
              content_css: false,
              promotion: false,

              // Inline styles
              content_style: `
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                  font-size: 14px;
                  padding: 10px;
                  line-height: 1.5;
                }
                p { margin: 0 0 10px 0; }
              `,

              setup: (editor: any) => {
                editor.on("change keyup", () => {
                  isInternalChange.current = true;
                  setLocalSchedules((prev) =>
                    prev.map((s) =>
                      s.id === newSchedule.id
                        ? { ...s, content: editor.getContent() }
                        : s
                    )
                  );
                });
              },
            });
          }
        } catch (error) {
          console.error("Error initializing TinyMCE for new schedule:", error);
        }
      }
    }, 200);
  };

  const handleRemoveSchedule = async (id: string) => {
    setLocalSchedules((prev) => {
      if (prev.length <= 1) {
        alert("Phải có ít nhất 1 lịch trình!");
        return prev;
      }

      // Remove TinyMCE editor
      if (typeof window !== "undefined") {
        import("tinymce/tinymce").then(({ default: tinymce }) => {
          const editor = tinymce.get(`schedule-content-${id}`);
          if (editor) {
            editor.remove();
          }
        });
      }

      isInternalChange.current = true;
      return prev.filter((schedule) => schedule.id !== id);
    });
  };

  const handleToggleSchedule = (event: React.MouseEvent<HTMLDivElement>) => {
    const clicked = event.target as HTMLElement;
    if (!clicked.closest(".inner-more")) return;

    const item = clicked.closest(".inner-schedule-item");
    const body = item?.querySelector(".inner-schedule-body");
    const icon = item?.querySelector(".icon-toggle");

    if (!body) return;

    body.classList.toggle("hidden");
    icon?.classList.toggle("rotated");
  };

  return (
    <div className="inner-schedule">
      <div className="inner-schedule-list" onClick={handleToggleSchedule}>
        {localSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="inner-schedule-item"
            data-schedule-id={schedule.id}
          >
            <div className="inner-schedule-head">
              <div className="inner-schedule-button inner-move">
                <FaUpDownLeftRight />
              </div>
              <input
                type="text"
                value={schedule.title}
                onChange={(e) => handleTitleChange(schedule.id, e.target.value)}
                placeholder="Tiêu đề lịch trình..."
              />
              <div
                className="inner-schedule-button inner-remove"
                onClick={() => handleRemoveSchedule(schedule.id)}
              >
                <FaTrashCan />
              </div>
              <div className="inner-schedule-button inner-more">
                <FaAngleDown className="icon-toggle" />
              </div>
            </div>
            <div className="inner-schedule-body">
              <textarea
                id={`schedule-content-${schedule.id}`}
                defaultValue={schedule.content}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="inner-schedule-create" onClick={handleAddSchedule}>
        + Thêm lịch trình
      </div>
    </div>
  );
}
