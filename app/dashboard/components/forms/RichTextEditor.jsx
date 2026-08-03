"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Eraser,
  CornerDownLeft,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 96;

const COLORS = [
  "#0f172a",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
  "#2563eb",
  "#7c3aed",
  "#db2777",
];

const ToolbarButton = ({ onClick, title, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
  >
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const lastRangeRef = useRef(null);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      editorRef.current &&
      editorRef.current.contains(sel.anchorNode)
    ) {
      lastRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (lastRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(lastRangeRef.current);
    }
  };

  useEffect(() => {
    document.execCommand("styleWithCSS", false, true);
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const exec = (command, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const increaseBreak = () => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, "<br>");
    handleInput();
  };

  const decreaseBreak = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    // Walk backward from the caret over empty text to find an adjacent <br>
    // and remove exactly that, instead of deleting real characters.
    let node = sel.getRangeAt(0).startContainer;
    let offset = sel.getRangeAt(0).startOffset;
    let candidate =
      node.nodeType === Node.TEXT_NODE
        ? offset === 0
          ? node.previousSibling
          : null
        : node.childNodes[offset - 1] || null;

    while (candidate && candidate.nodeType === Node.TEXT_NODE && candidate.textContent === "") {
      candidate = candidate.previousSibling;
    }

    if (candidate && candidate.nodeType === Node.ELEMENT_NODE && candidate.tagName === "BR") {
      candidate.remove();
    } else {
      document.execCommand("delete", false);
    }
    handleInput();
  };

  const applyFontSize = (size) => {
    const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));
    setFontSize(clamped);

    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      // Nothing selected — there's no existing text to resize.
      return;
    }

    // Wrap the selected range directly in a sized span instead of relying on
    // document.execCommand("fontSize"), which (especially with styleWithCSS)
    // doesn't reliably produce a wrapper we can find and override across browsers.
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = `${clamped}px`;
    span.appendChild(range.extractContents());
    range.insertNode(span);

    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);
    lastRangeRef.current = newRange.cloneRange();

    handleInput();
  };

  const stepFontSize = (delta) => applyFontSize(fontSize + delta);

  return (
    <div className="w-full border border-slate-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 bg-slate-50 border-b border-slate-200 p-2">
        <ToolbarButton onClick={() => exec("bold")} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("italic")} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("underline")} title="Underline">
          <Underline className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("foreColor", color)}
            className="w-5 h-5 rounded-full border border-slate-300"
            style={{ backgroundColor: color }}
          />
        ))}
        <label
          title="Custom color"
          className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer overflow-hidden bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]"
        >
          <input
            type="color"
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => exec("foreColor", e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer"
          />
        </label>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <ToolbarButton onClick={() => exec("removeFormat")} title="Clear formatting">
          <Eraser className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <span className="flex items-center gap-0.5 pr-1" title="Click where you want to add/remove space between lines">
          <CornerDownLeft className="w-4 h-4 text-slate-400" />
          <ToolbarButton onClick={decreaseBreak} title="Decrease break (remove space)">
            <Minus className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={increaseBreak} title="Increase break (add space)">
            <Plus className="w-4 h-4" />
          </ToolbarButton>
        </span>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <div className="flex items-center gap-0.5" title="Font size">
          <input
            type="number"
            value={fontSize}
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            onChange={(e) => applyFontSize(Number(e.target.value) || DEFAULT_FONT_SIZE)}
            className="w-12 px-1.5 py-1 text-sm border border-slate-300 rounded text-slate-700"
          />
          <div className="flex flex-col">
            <button
              type="button"
              title="Increase font size"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => stepFontSize(1)}
              className="hover:bg-slate-200 rounded-sm text-slate-700"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Decrease font size"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => stepFontSize(-1)}
              className="hover:bg-slate-200 rounded-sm text-slate-700"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        data-placeholder={placeholder}
        className="w-full px-4 py-3 min-h-[120px] bg-white text-slate-900 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
      />
    </div>
  );
}
