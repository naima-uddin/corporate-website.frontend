"use client";

import React, { useEffect, useRef } from "react";
import { Bold, Italic, Underline, Eraser } from "lucide-react";

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
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className="w-full px-4 py-3 min-h-[120px] bg-white text-slate-900 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
      />
    </div>
  );
}
