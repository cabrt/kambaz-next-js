"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="border rounded p-3" style={{ minHeight: "150px" }}>Loading editor...</div>,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text here...",
  readOnly = false,
  height = "150px",
}: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "link",
  ];

  return (
    <div style={{ minHeight: height }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ height: `calc(${height} - 42px)` }}
      />
    </div>
  );
}

