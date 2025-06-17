import React, { useRef, useState } from "react";

export interface FileDropZoneProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function FileDropZone({ files, setFiles }: FileDropZoneProps) {
  const [highlight, setHighlight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlight(true);
  };

  const handleDragLeave = () => {
    setHighlight(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlight(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${
        highlight ? "border-purple-500" : "border-gray-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileSelect}
    >
      {files.length === 0 ? (
        <p>
          Drag & drop files here, or{" "}
          <button
            type="button"
            className="underline text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect();
            }}
          >
            Select files
          </button>
        </p>
      ) : (
        <p className="font-medium">
          {files.length} file{files.length > 1 ? "s" : ""} selected. Click to
          add more.
        </p>
      )}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
