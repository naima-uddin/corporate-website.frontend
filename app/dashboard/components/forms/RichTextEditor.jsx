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
 * multi-image gallery insertion, text color, and live toolbar state.
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
  const editorRef = useRef(null);
  const lastRange = useRef(null);
  const initialized = useRef(false);
  const [activeFormats, setActiveFormats] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  // Attach click-to-remove / click-to-resize behaviour to images that were
  // rendered directly from saved HTML (edit mode) or just inserted.
  const attachSingleImageControls = (img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      const action = prompt(
        'Enter a new max-width in px, or type "remove" to delete this image:',
      );
      if (!action) return;
      if (action.toLowerCase().trim() === "remove") {
        img.remove();
        emitChange();
      } else {
        const w = parseInt(action, 10);
        if (!isNaN(w) && w > 0) {
          img.style.maxWidth = w + "px";
          emitChange();
        }
      }
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
        img.style.maxWidth = img.style.maxWidth || "100%";
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
    const url = await uploadOne(file);
    exec("insertImage", url);
    setTimeout(hydrateImages, 100);
  };

  const insertGalleryFiles = async (files) => {
    const urls = [];
    for (const file of files) {
      urls.push(await uploadOne(file));
    }
    const imagesHtml = urls
      .map((url) => `<img src="${url}" alt="" data-hydrated="" />`)
      .join("");
    const html = `<div class="news-gallery" data-count="${urls.length}">${imagesHtml}</div><p><br></p>`;
    exec("insertHTML", html);
    setTimeout(hydrateImages, 100);
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
          title="Insert one image"
          onMouseDown={handleToolbarMouseDown}
          className="cursor-pointer rounded-md p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition"
        >
          <ImageIcon className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
        <label
          title="Insert a gallery (select multiple images)"
          onMouseDown={handleToolbarMouseDown}
          className="cursor-pointer rounded-md p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition"
        >
          <Images className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

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
        className="max-w-none overflow-y-auto p-4 text-slate-900 focus:outline-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 [&_p]:mb-3 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_img]:my-2 [&_img]:rounded-lg"
        onInput={emitChange}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onFocus={updateActiveFormats}
        onBlur={saveSelection}
      />
      <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        {placeholder}
      </p>
    </div>
  );
}
