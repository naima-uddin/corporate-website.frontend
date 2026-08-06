"use client";

import React, { useEffect, useRef } from "react";
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
  Undo2,
  Redo2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Lightweight WYSIWYG editor (contentEditable + execCommand) with inline
 * image upload, matching the editing experience of the blog composer.
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

  const saveSelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      editorRef.current?.contains(sel.anchorNode)
    ) {
      lastRange.current = sel.getRangeAt(0).cloneRange();
    }
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

  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = value && value.trim() ? value : "<p></p>";
      initialized.current = true;
    }
  }, [value]);

  const insertImageFile = async (file) => {
    if (!file) return;
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

    exec("insertImage", data.url);

    setTimeout(() => {
      const imgs = editorRef.current?.querySelectorAll("img");
      if (imgs && imgs.length) {
        const img = imgs[imgs.length - 1];
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.borderRadius = "0.75rem";
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
      }
    }, 100);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    insertImageFile(file).catch((err) =>
      alert(err.message || "Image upload failed"),
    );
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", onClick: () => exec("bold") },
    { icon: Italic, label: "Italic", onClick: () => exec("italic") },
    { icon: Underline, label: "Underline", onClick: () => exec("underline") },
    {
      icon: Heading2,
      label: "Heading",
      onClick: () => exec("formatBlock", "<h2>"),
    },
    {
      icon: Heading3,
      label: "Subheading",
      onClick: () => exec("formatBlock", "<h3>"),
    },
    {
      icon: Pilcrow,
      label: "Paragraph",
      onClick: () => exec("formatBlock", "<p>"),
    },
    {
      icon: Quote,
      label: "Quote",
      onClick: () => exec("formatBlock", "<blockquote>"),
    },
    {
      icon: List,
      label: "Bullet list",
      onClick: () => exec("insertUnorderedList"),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      onClick: () => exec("insertOrderedList"),
    },
  ];

  return (
    <div className="rounded-lg border border-slate-300 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 sticky top-0 z-10">
        {toolbarButtons.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            title={label}
            onMouseDown={handleToolbarMouseDown}
            onClick={onClick}
            className="rounded-md p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition"
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <button
          type="button"
          title="Insert / edit link"
          onMouseDown={handleToolbarMouseDown}
          onClick={handleLink}
          className="rounded-md p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <label
          title="Insert image"
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
        <span className="mx-1 h-5 w-px bg-slate-300" />
        <button
          type="button"
          title="Undo"
          onMouseDown={handleToolbarMouseDown}
          onClick={() => exec("undo")}
          className="rounded-md p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Redo"
          onMouseDown={handleToolbarMouseDown}
          onClick={() => exec("redo")}
          className="rounded-md p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition"
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
        onBlur={saveSelection}
      />
      <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        {placeholder}
      </p>
    </div>
  );
}
