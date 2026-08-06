"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Images,
  Palette,
  Eraser,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  StretchHorizontal,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SWATCHES = [
  "#0b4f9e",
  "#111827",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
];

/**
 * WYSIWYG editor (contentEditable + execCommand) with inline image upload,
 * multi-image gallery insertion, text color, drag-to-reposition images, a
 * corner resize handle, and live toolbar state.
 * Usage: <RichTextEditor value={html} onChange={setHtml} uploadType="news" />
 */
export default function RichTextEditor({
  value,
  onChange,
  uploadType = "news",
  placeholder = "Write your content here...",
  minHeight = 260,
}) {
  const { token } = useAuth();
  const wrapperRef = useRef(null);
  const editorRef = useRef(null);
  const lastRange = useRef(null);
  const initialized = useRef(false);
  const draggedImgRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selection, setSelection] = useState(null); // { img, rect }
  const [uploadStatus, setUploadStatus] = useState(null); // { done, total } while an upload is in flight

  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || !editorRef.current.contains(sel.anchorNode)) return;
    let block = "";
    try {
      block = (document.queryCommandValue("formatBlock") || "").toLowerCase();
    } catch {
      block = "";
    }
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
      h2: block === "h2",
      h3: block === "h3",
      p: block === "p" || block === "",
      blockquote: block === "blockquote",
    });
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      editorRef.current?.contains(sel.anchorNode)
    ) {
      lastRange.current = sel.getRangeAt(0).cloneRange();
    }
    updateActiveFormats();
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    if (lastRange.current) sel.addRange(lastRange.current);
  };

  const handleToolbarMouseDown = (e) => {
    e.preventDefault();
    saveSelection();
  };

  const emitChange = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const exec = (cmd, val = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    document.execCommand(cmd, false, val);

    if (cmd === "createLink" && val) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount) {
        let node = sel.anchorNode;
        while (node && node.nodeType === 3) node = node.parentElement;
        if (node && node.tagName === "A") {
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener noreferrer");
        }
      }
    }

    emitChange();
    saveSelection();
  };

  const handleLink = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    let node = sel.anchorNode;
    while (node && node.nodeType === 3) node = node.parentElement;

    let linkElement = null;
    if (node && node.tagName === "A") {
      linkElement = node;
    } else {
      const range = sel.getRangeAt(0);
      const container = range.commonAncestorContainer;
      if (container.nodeType === 1 && container.tagName === "A") {
        linkElement = container;
      } else if (
        container.parentElement &&
        container.parentElement.tagName === "A"
      ) {
        linkElement = container.parentElement;
      }
    }

    if (linkElement) {
      const currentUrl = linkElement.href;
      const action = prompt(
        `Current link: ${currentUrl}\n\nEnter a NEW URL to change it, type "remove" to delete it, or Cancel to keep it.`,
        currentUrl,
      );
      if (action === null) return;
      if (action.toLowerCase().trim() === "remove") {
        const text = linkElement.textContent;
        linkElement.replaceWith(document.createTextNode(text));
        emitChange();
      } else if (action.trim()) {
        linkElement.href = action.trim();
        linkElement.setAttribute("target", "_blank");
        linkElement.setAttribute("rel", "noopener noreferrer");
        emitChange();
      }
    } else {
      const url = prompt("Enter link URL (e.g., https://example.com)");
      if (url && url.trim()) exec("createLink", url.trim());
    }
  };

  useEffect(() => {
    document.execCommand("enableObjectResizing", false, true);
    document.execCommand("enableInlineTableEditing", false, true);
  }, []);

  // ---- Floating selection overlay (resize handle / align / delete) ----
  // Rendered outside the contentEditable tree so it never leaks into saved HTML.
  const computeRect = (img) => {
    if (!img || !wrapperRef.current || !document.contains(img)) return null;
    const imgRect = img.getBoundingClientRect();
    const wrapRect = wrapperRef.current.getBoundingClientRect();
    return {
      top: imgRect.top - wrapRect.top,
      left: imgRect.left - wrapRect.left,
      width: imgRect.width,
      height: imgRect.height,
    };
  };

  const selectImage = (img) => {
    setSelection({ img, rect: computeRect(img) });
  };

  const clearSelection = () => setSelection(null);

  const refreshSelectionRect = () => {
    setSelection((sel) => {
      if (!sel || !document.contains(sel.img)) return null;
      return { ...sel, rect: computeRect(sel.img) };
    });
  };

  useEffect(() => {
    const onOutsideDown = (e) => {
      const overlayEl = wrapperRef.current?.querySelector(
        "[data-image-overlay]",
      );
      if (overlayEl && overlayEl.contains(e.target)) return;
      if (selection && e.target === selection.img) return;
      clearSelection();
    };
    document.addEventListener("mousedown", onOutsideDown);
    return () => document.removeEventListener("mousedown", onOutsideDown);
  }, [selection]);

  useEffect(() => {
    if (!selection) return;
    const update = () => refreshSelectionRect();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [selection?.img]);

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selection?.img) return;
    const img = selection.img;
    const startX = e.clientX;
    const startWidth = img.getBoundingClientRect().width;

    const onMove = (moveEvt) => {
      const delta = moveEvt.clientX - startX;
      const newWidth = Math.max(60, Math.round(startWidth + delta));
      img.style.width = `${newWidth}px`;
      img.style.height = "auto";
      img.style.maxWidth = "100%";
      refreshSelectionRect();
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      emitChange();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const setAlign = (align) => {
    if (!selection?.img) return;
    const img = selection.img;
    img.style.float = "";
    img.style.display = "";
    img.style.margin = "";
    img.style.width = "";
    if (align === "left") {
      img.style.float = "left";
      img.style.margin = "0.25rem 1.25rem 1rem 0";
      img.style.maxWidth = "50%";
    } else if (align === "right") {
      img.style.float = "right";
      img.style.margin = "0.25rem 0 1rem 1.25rem";
      img.style.maxWidth = "50%";
    } else if (align === "center") {
      img.style.display = "block";
      img.style.margin = "1.5rem auto";
      img.style.maxWidth = "100%";
    } else if (align === "full") {
      img.style.display = "block";
      img.style.margin = "1.5rem 0";
      img.style.width = "100%";
      img.style.maxWidth = "100%";
    }
    emitChange();
    refreshSelectionRect();
  };

  const deleteSelectedImage = () => {
    if (!selection?.img) return;
    selection.img.remove();
    clearSelection();
    emitChange();
  };

  // ---- Image hydration: click-to-select, drag-to-move, gallery controls ----
  const attachSingleImageControls = (img) => {
    img.style.cursor = "grab";
    img.setAttribute("draggable", "true");
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      selectImage(img);
    });
    img.addEventListener("dragstart", (e) => {
      draggedImgRef.current = img;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "image-move");
      clearSelection();
    });
    img.addEventListener("dragend", () => {
      draggedImgRef.current = null;
    });
  };

  const attachGalleryImageControls = (img) => {
    img.addEventListener("click", () => {
      if (!confirm("Remove this image from the gallery?")) return;
      const gallery = img.closest(".news-gallery");
      img.remove();
      if (gallery) {
        const remaining = gallery.querySelectorAll("img").length;
        if (remaining === 0) gallery.remove();
        else gallery.setAttribute("data-count", String(remaining));
      }
      emitChange();
    });
  };

  const hydrateImages = () => {
    if (!editorRef.current) return;
    editorRef.current.querySelectorAll(".news-gallery").forEach((gallery) => {
      if (!gallery.hasAttribute("contenteditable")) {
        gallery.setAttribute("contenteditable", "false");
      }
    });
    editorRef.current.querySelectorAll("img").forEach((img) => {
      if (img.dataset.hydrated) return;
      img.dataset.hydrated = "1";
      if (img.closest(".news-gallery")) {
        attachGalleryImageControls(img);
      } else {
        // Only clamp overflow for images that don't already carry a size
        // (e.g. legacy content). Freshly inserted images get an explicit
        // default width in insertImageFile so several can sit side by side.
        if (!img.style.width && !img.style.maxWidth) {
          img.style.maxWidth = "100%";
        }
        img.style.verticalAlign = img.style.verticalAlign || "top";
        attachSingleImageControls(img);
      }
    });
  };

  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = value && value.trim() ? value : "<p></p>";
      initialized.current = true;
      hydrateImages();
    }
  }, [value]);

  // Custom drag-and-drop: move the actual image node to the drop caret
  // position instead of relying on inconsistent native element DnD.
  const handleDragOver = (e) => {
    if (!draggedImgRef.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    const img = draggedImgRef.current;
    if (!img) return;
    e.preventDefault();
    draggedImgRef.current = null;

    let range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }
    if (!range) return;

    img.remove();
    range.insertNode(img);
    emitChange();
    selectImage(img);
  };

  const uploadOne = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload/${uploadType}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      },
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Image upload failed");
    }
    return data.url;
  };

  const insertImageFile = async (file) => {
    setUploadStatus({ done: 0, total: 1 });
    try {
      const url = await uploadOne(file);
      exec("insertImage", url);
      setTimeout(() => {
        if (!editorRef.current) return;
        // Default new images to ~45% width (not maxWidth:100%) so two of them
        // can sit side by side in the same line instead of always stacking.
        editorRef.current
          .querySelectorAll("img:not([data-hydrated])")
          .forEach((img) => {
            if (img.closest(".news-gallery")) return;
            img.style.width = "45%";
            img.style.display = "inline-block";
            img.style.verticalAlign = "top";
            img.style.margin = "0.5rem 1%";
          });
        hydrateImages();
      }, 100);
    } finally {
      setUploadStatus(null);
    }
  };

  const insertGalleryFiles = async (files) => {
    setUploadStatus({ done: 0, total: files.length });
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await uploadOne(file));
        setUploadStatus((s) => (s ? { ...s, done: s.done + 1 } : s));
      }
      const imagesHtml = urls
        .map((url) => `<img src="${url}" alt="" data-hydrated="" />`)
        .join("");
      const html = `<div class="news-gallery" data-count="${urls.length}">${imagesHtml}</div><p><br></p>`;
      exec("insertHTML", html);
      setTimeout(hydrateImages, 100);
    } finally {
      setUploadStatus(null);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    if (files.length === 1) {
      insertImageFile(files[0]).catch((err) =>
        alert(err.message || "Image upload failed"),
      );
    } else {
      insertGalleryFiles(files).catch((err) =>
        alert(err.message || "Image upload failed"),
      );
    }
  };

  const applyColor = (color) => {
    exec("foreColor", color);
    setShowColorPicker(false);
  };

  const btnClass = (active) =>
    `rounded-md p-2 transition ${
      active
        ? "bg-[var(--color-primary-tint,#eef4fc)] text-[var(--color-primary,#0b4f9e)] shadow-sm"
        : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
    }`;

  const Divider = () => <span className="mx-1 h-5 w-px bg-slate-300" />;

  return (
    <div ref={wrapperRef} className="relative">
      <div className="rounded-lg border border-slate-300 overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 sticky top-0 z-10">
          <button
            type="button"
            title="Bold"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("bold")}
            className={btnClass(activeFormats.bold)}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("italic")}
            className={btnClass(activeFormats.italic)}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("underline")}
            className={btnClass(activeFormats.underline)}
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              title="Text color"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => setShowColorPicker((s) => !s)}
              className={btnClass(showColorPicker)}
            >
              <Palette className="w-4 h-4" />
            </button>
            {showColorPicker && (
              <div
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-0 top-full z-20 mt-1 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
              >
                <div className="grid grid-cols-4 gap-1.5">
                  {SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      title={color}
                      onClick={() => applyColor(color)}
                      className="h-6 w-6 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                  Custom
                  <input
                    type="color"
                    onChange={(e) => applyColor(e.target.value)}
                    className="h-6 w-10 cursor-pointer rounded border border-slate-200"
                  />
                </label>
              </div>
            )}
          </div>

          <Divider />

          <button
            type="button"
            title="Heading"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("formatBlock", "<h2>")}
            className={btnClass(activeFormats.h2)}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Subheading"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("formatBlock", "<h3>")}
            className={btnClass(activeFormats.h3)}
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Paragraph"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("formatBlock", "<p>")}
            className={btnClass(activeFormats.p)}
          >
            <Pilcrow className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Quote"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("formatBlock", "<blockquote>")}
            className={btnClass(activeFormats.blockquote)}
          >
            <Quote className="w-4 h-4" />
          </button>

          <Divider />

          <button
            type="button"
            title="Bullet list"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("insertUnorderedList")}
            className={btnClass(activeFormats.ul)}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered list"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("insertOrderedList")}
            className={btnClass(activeFormats.ol)}
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <Divider />

          <button
            type="button"
            title="Insert / edit link"
            onMouseDown={handleToolbarMouseDown}
            onClick={handleLink}
            className={btnClass(false)}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <label
            title="Insert one image (drag it anywhere after inserting)"
            onMouseDown={handleToolbarMouseDown}
            className={`rounded-md p-2 text-slate-600 transition ${
              uploadStatus
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-white hover:text-slate-900 hover:shadow-sm"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!!uploadStatus}
              onChange={handleImageChange}
            />
          </label>
          <label
            title="Insert a gallery — select as many images as you like, they'll auto-arrange 2 per row"
            onMouseDown={handleToolbarMouseDown}
            className={`rounded-md p-2 text-slate-600 transition ${
              uploadStatus
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-white hover:text-slate-900 hover:shadow-sm"
            }`}
          >
            <Images className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={!!uploadStatus}
              onChange={handleImageChange}
            />
          </label>

          {uploadStatus && (
            <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-tint,#eef4fc)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary,#0b4f9e)]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {uploadStatus.total > 1
                ? `Uploading ${uploadStatus.done}/${uploadStatus.total}...`
                : "Uploading..."}
            </span>
          )}

          <Divider />

          <button
            type="button"
            title="Clear formatting"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("removeFormat")}
            className={btnClass(false)}
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Undo"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("undo")}
            className={btnClass(false)}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo"
            onMouseDown={handleToolbarMouseDown}
            onClick={() => exec("redo")}
            className={btnClass(false)}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          style={{ minHeight }}
          className="max-w-none overflow-y-auto p-4 text-slate-900 focus:outline-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 [&_p]:mb-3 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_img]:my-2 [&_img]:rounded-lg [&_img]:align-top"
          onInput={emitChange}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onFocus={updateActiveFormats}
          onBlur={saveSelection}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
        <p
          className={`flex items-center gap-1.5 border-t px-3 py-2 text-xs ${
            uploadStatus
              ? "border-[var(--color-primary-tint,#eef4fc)] bg-[var(--color-primary-tint,#eef4fc)] font-semibold text-[var(--color-primary,#0b4f9e)]"
              : "border-slate-200 bg-slate-50 text-slate-500"
          }`}
        >
          {uploadStatus ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {uploadStatus.total > 1
                ? `Uploading image ${Math.min(uploadStatus.done + 1, uploadStatus.total)} of ${uploadStatus.total}...`
                : "Uploading image..."}
            </>
          ) : (
            placeholder
          )}
        </p>
      </div>

      {selection?.rect && (
        <div
          data-image-overlay
          className="pointer-events-none absolute z-30"
          style={{
            top: selection.rect.top,
            left: selection.rect.left,
            width: selection.rect.width,
            height: selection.rect.height,
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-[var(--color-primary,#0b4f9e)]" />

          {/* Align + delete toolbar (flips below the image if it would collide with the sticky toolbar) */}
          <div
            className="pointer-events-auto absolute left-0 flex items-center gap-1 rounded-lg bg-slate-900/90 p-1 shadow-lg"
            style={
              selection.rect.top < 44
                ? { top: selection.rect.height + 6 }
                : { top: -40 }
            }
          >
            <button
              type="button"
              title="Align left (wrap text)"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setAlign("left")}
              className="rounded p-1.5 text-white hover:bg-white/20"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Center"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setAlign("center")}
              className="rounded p-1.5 text-white hover:bg-white/20"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Align right (wrap text)"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setAlign("right")}
              className="rounded p-1.5 text-white hover:bg-white/20"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Full width"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setAlign("full")}
              className="rounded p-1.5 text-white hover:bg-white/20"
            >
              <StretchHorizontal className="w-3.5 h-3.5" />
            </button>
            <span className="mx-0.5 h-4 w-px bg-white/30" />
            <button
              type="button"
              title="Delete image"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={deleteSelectedImage}
              className="rounded p-1.5 text-white hover:bg-red-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Resize handle */}
          <div
            title="Drag to resize"
            onMouseDown={startResize}
            className="pointer-events-auto absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-full border-2 border-white bg-[var(--color-primary,#0b4f9e)] shadow cursor-nwse-resize"
          />
        </div>
      )}
    </div>
  );
}
